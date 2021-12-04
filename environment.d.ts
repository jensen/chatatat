declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
      COOKIE_SESSION_KEY_A: string;
      COOKIE_SESSION_KEY_B: string;
    }
  }
}

export {};
