/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />

type EnvironemntVars =
  | "SUPABASE_URL"
  | "SUPABASE_ANON_KEY"
  | "COOKIE_SESSION_KEY_A"
  | "COOKIE_SESSION_KEY_B";

type WindowWithEnvironment = Window &
  typeof globalThis & {
    env: Record<EnvironemntVars, "string">;
  };

interface IEnvironment extends Record<EnvironemntVars, string> {}
