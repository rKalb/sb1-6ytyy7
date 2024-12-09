import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { 
  DynamoDBDocumentClient, 
  PutCommand,
  GetCommand,
  QueryCommand
} from '@aws-sdk/lib-dynamodb';
import { config } from '../config';
import { User, UserCreateInput } from '../types/user';

const client = new DynamoDBClient({
  region: config.AWS_REGION,
  credentials: config.AWS_ACCESS_KEY_ID && config.AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  } : undefined,
});

const docClient = DynamoDBDocumentClient.from(client);

export class AuthService {
  private tableName: string;

  constructor() {
    this.tableName = 'plm_users';
  }

  async createUser(input: UserCreateInput): Promise<User> {
    const now = new Date().toISOString();
    const user: User = {
      id: crypto.randomUUID(),
      email: input.email,
      name: input.name,
      role: input.role,
      createdAt: now,
      updatedAt: now,
    };

    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        ...user,
        password: input.password, // In production, hash the password
      },
      ConditionExpression: 'attribute_not_exists(email)',
    });

    try {
      await docClient.send(command);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { email },
    });

    try {
      const response = await docClient.send(command);
      if (!response.Item) return null;
      
      const { password, ...user } = response.Item;
      return user as User;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async validateCredentials(email: string, password: string): Promise<User | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { email },
    });

    try {
      const response = await docClient.send(command);
      if (!response.Item) return null;

      // In production, compare hashed passwords
      if (response.Item.password !== password) return null;

      const { password: _, ...user } = response.Item;
      return user as User;
    } catch (error) {
      console.error('Error validating credentials:', error);
      throw error;
    }
  }
}