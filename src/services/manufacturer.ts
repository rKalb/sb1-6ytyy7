import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { 
  DynamoDBDocumentClient, 
  PutCommand,
  GetCommand,
  ScanCommand
} from '@aws-sdk/lib-dynamodb';
import { config } from '../config';
import { Manufacturer } from '../types/manufacturer';

const client = new DynamoDBClient({
  region: config.AWS_REGION,
  credentials: config.AWS_ACCESS_KEY_ID && config.AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  } : undefined,
});

const docClient = DynamoDBDocumentClient.from(client);

export class ManufacturerService {
  private tableName: string;

  constructor() {
    this.tableName = 'plm_manufacturers';
  }

  async getAllManufacturers(): Promise<Manufacturer[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
    });
    const response = await docClient.send(command);
    return (response.Items || []) as Manufacturer[];
  }

  async createManufacturer(manufacturer: Omit<Manufacturer, 'id'>): Promise<Manufacturer> {
    const newManufacturer: Manufacturer = {
      ...manufacturer,
      id: crypto.randomUUID()
    };

    const command = new PutCommand({
      TableName: this.tableName,
      Item: newManufacturer,
    });

    await docClient.send(command);
    return newManufacturer;
  }

  async searchManufacturers(query: string): Promise<Manufacturer[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: 'contains(#name, :query) OR contains(#code, :query)',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#code': 'code',
      },
      ExpressionAttributeValues: {
        ':query': query.toUpperCase(),
      },
    });

    const response = await docClient.send(command);
    return (response.Items || []) as Manufacturer[];
  }
}