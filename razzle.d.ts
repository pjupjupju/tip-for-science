declare namespace NodeJS {
  export interface ProcessEnv {
    RAZZLE_ASSETS_MANIFEST: string;
    RAZZLE_PUBLIC_DIR: string;
    SUPABASE_KEY: string;
    DB_PASSWORD: string;
  }
}
