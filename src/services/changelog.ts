import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { 
  DynamoDBDocumentClient, 
  PutCommand,
  QueryCommand
} from '@aws-sdk/lib-dynamodb';
import { config } from '../config';
import { ChangeLogEntry, ChangeLogInput } from '../types/changelog';
import { debug } from '../utils/debug';

const client = new DynamoDBClient({
  region: config.AWS_REGION,
  credentials: config.AWS_ACCESS_KEY_ID && config.AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  } : undefined,
});

const docClient = DynamoDBDocumentClient.from(client);

export class ChangeLogService {
  private tableName: string;

  constructor() {
    this.tableName = 'plm_changelog';
  }

  async addEntry(partNumber: string, userId: string, userName: string, input: ChangeLogInput): Promise<ChangeLogEntry> {
    debug.log('Adding changelog entry:', { partNumber, userId, input });

    const entry: ChangeLogEntry = {
      id: crypto.randomUUID(),
      partNumber,
      userId,
      userName,
      type: input.type,
      description: input.description,
      oldValue: input.oldValue,
      newValue: input.newValue,
      comment: input.comment,
      timestamp: new Date().toISOString()
    };

    const command = new PutCommand({
      TableName: this.tableName,
      Item: entry
    });

    try {
      await docClient.send(command);
      debug.log('Changelog entry added successfully');
      return entry;
    } catch (error) {
      debug.error('Error adding changelog entry:', error);
      throw error;
    }
  }

  async getEntriesForPart(partNumber: string): Promise<ChangeLogEntry[]> {
    debug.log('Getting changelog entries for part:', partNumber);

    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: 'partNumber = :partNumber',
      ExpressionAttributeValues: {
        ':partNumber': partNumber
      },
      ScanIndexForward: false // Get newest entries first
    });

    try {
      const response = await docClient.send(command);
      debug.log(`Retrieved ${response.Items?.length || 0} changelog entries`);
      return (response.Items || []) as ChangeLogEntry[];
    } catch (error) {
      debug.error('Error getting changelog entries:', error);
      throw error;
    }
  }
}