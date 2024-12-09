import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { 
  DynamoDBDocumentClient, 
  PutCommand,
  GetCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand
} from '@aws-sdk/lib-dynamodb';
import { config } from '../config';
import { Part } from '../types/part';
import { ChangeLogEntry } from '../types/changelog';
import { PLMError } from './error';
import { debug } from '../utils/debug';

const client = new DynamoDBClient({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

export class DynamoDBService {
  private tableName: string;
  private changelogTableName: string;

  constructor() {
    this.tableName = config.DYNAMODB_TABLE_NAME;
    this.changelogTableName = 'plm_changelog';
    debug.log('DynamoDBService initialized with tables:', {
      parts: this.tableName,
      changelog: this.changelogTableName
    });
  }

  async getAllParts(): Promise<Part[]> {
    try {
      debug.log('Getting all parts');
      const command = new ScanCommand({
        TableName: this.tableName,
      });
      const response = await docClient.send(command);
      return (response.Items || []) as Part[];
    } catch (error) {
      debug.error('Error getting all parts:', error);
      throw PLMError.fromAWSError(error);
    }
  }

  async getPart(partNumber: string): Promise<Part | null> {
    try {
      debug.log('Getting part:', partNumber);
      const command = new GetCommand({
        TableName: this.tableName,
        Key: { partNumber }
      });
      const response = await docClient.send(command);
      return response.Item as Part || null;
    } catch (error) {
      debug.error('Error getting part:', error);
      throw PLMError.fromAWSError(error);
    }
  }

  async createPart(part: Part): Promise<void> {
    try {
      debug.log('Creating part:', part);
      const command = new PutCommand({
        TableName: this.tableName,
        Item: part,
        ConditionExpression: 'attribute_not_exists(partNumber)'
      });
      await docClient.send(command);
    } catch (error) {
      debug.error('Error creating part:', error);
      throw PLMError.fromAWSError(error);
    }
  }

  async updatePart(partNumber: string, updates: Partial<Part>): Promise<void> {
    try {
      debug.log('Updating part:', { partNumber, updates });
      
      const updateExpressions: string[] = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, any> = {};

      Object.entries(updates).forEach(([key, value]) => {
        if (key !== 'partNumber') {
          updateExpressions.push(`#${key} = :${key}`);
          expressionAttributeNames[`#${key}`] = key;
          expressionAttributeValues[`:${key}`] = value;
        }
      });

      const command = new UpdateCommand({
        TableName: this.tableName,
        Key: { partNumber },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ConditionExpression: 'attribute_exists(partNumber)'
      });

      await docClient.send(command);
    } catch (error) {
      debug.error('Error updating part:', error);
      throw PLMError.fromAWSError(error);
    }
  }

  async deletePart(partNumber: string): Promise<void> {
    try {
      debug.log('Deleting part:', partNumber);
      const command = new DeleteCommand({
        TableName: this.tableName,
        Key: { partNumber }
      });
      await docClient.send(command);
    } catch (error) {
      debug.error('Error deleting part:', error);
      throw PLMError.fromAWSError(error);
    }
  }

  async addChangeLogEntry(entry: ChangeLogEntry): Promise<void> {
    try {
      debug.log('Adding changelog entry:', entry);
      const command = new PutCommand({
        TableName: this.changelogTableName,
        Item: {
          ...entry,
          timestamp: new Date().toISOString()
        }
      });
      await docClient.send(command);
    } catch (error) {
      debug.error('Error adding changelog entry:', error);
      throw PLMError.fromAWSError(error);
    }
  }

  async getChangeLogEntries(partNumber: string): Promise<ChangeLogEntry[]> {
    try {
      debug.log('Getting changelog entries for part:', partNumber);
      const command = new QueryCommand({
        TableName: this.changelogTableName,
        IndexName: 'PartNumberIndex',
        KeyConditionExpression: 'partNumber = :partNumber',
        ExpressionAttributeValues: {
          ':partNumber': partNumber
        },
        ScanIndexForward: false // Get newest entries first
      });
      const response = await docClient.send(command);
      debug.log('Retrieved changelog entries:', response.Items);
      return (response.Items || []) as ChangeLogEntry[];
    } catch (error) {
      debug.error('Error getting changelog entries:', error);
      throw PLMError.fromAWSError(error);
    }
  }
}