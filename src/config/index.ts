import { z } from 'zod';

const configSchema = z.object({
  // AWS Configuration
  AWS_REGION: z.string().default('eu-west-2'),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  DYNAMODB_TABLE_NAME: z.string().default('plm_parts'),
  
  // Feature Flags
  USE_DYNAMODB: z.boolean().default(false),
  DEBUG_MODE: z.boolean().default(false),
  
  // Local Storage Keys
  LOCAL_STORAGE_PREFIX: z.string().default('plm_'),
});

type Config = z.infer<typeof configSchema>;

function validateEnvVars(): void {
  const missingVars: string[] = [];
  
  if (!import.meta.env.VITE_AWS_ACCESS_KEY_ID) missingVars.push('VITE_AWS_ACCESS_KEY_ID');
  if (!import.meta.env.VITE_AWS_SECRET_ACCESS_KEY) missingVars.push('VITE_AWS_SECRET_ACCESS_KEY');
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars.join(', '));
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

function loadConfig(): Config {
  console.log('[PLM Debug] Loading configuration...');
  
  try {
    validateEnvVars();

    const env = {
      AWS_REGION: import.meta.env.VITE_AWS_REGION,
      AWS_ACCESS_KEY_ID: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
      DYNAMODB_TABLE_NAME: import.meta.env.VITE_DYNAMODB_TABLE_NAME,
      USE_DYNAMODB: import.meta.env.VITE_USE_DYNAMODB === 'true',
      DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
      LOCAL_STORAGE_PREFIX: import.meta.env.VITE_LOCAL_STORAGE_PREFIX || 'plm_',
    };

    const config = configSchema.parse(env);
    console.log('[PLM Debug] Configuration loaded successfully:', {
      ...config,
      AWS_ACCESS_KEY_ID: '***',
      AWS_SECRET_ACCESS_KEY: '***'
    });
    return config;
  } catch (error) {
    console.error('[PLM Error] Configuration validation failed:', error);
    throw new Error('Invalid configuration');
  }
}

export const config = loadConfig();