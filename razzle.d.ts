declare namespace NodeJS {
  export interface ProcessEnv {
    RAZZLE_ASSETS_MANIFEST: string;
    RAZZLE_PUBLIC_DIR: string;
    RAZZLE_SUPABASE_KEY: string;
    RAZZLE_DB_PASSWORD: string;
  }
}
