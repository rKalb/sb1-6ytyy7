/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AWS_REGION: string
  readonly VITE_AWS_ACCESS_KEY_ID: string
  readonly VITE_AWS_SECRET_ACCESS_KEY: string
  readonly VITE_DYNAMODB_TABLE_NAME: string
  readonly VITE_USE_DYNAMODB: string
  readonly VITE_DEBUG_MODE: string
  readonly VITE_LOCAL_STORAGE_PREFIX: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}