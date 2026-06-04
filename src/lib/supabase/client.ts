import { createBrowserClient } from "@supabase/ssr";

import { publicEnv } from "@/lib/env";

export function isSupabaseConfigured(): boolean {
  return Boolean(publicEnv.supabaseUrl && publicEnv.supabaseAnonKey);
}

export function createSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) return null;
  return createBrowserClient(
    publicEnv.supabaseUrl,
    publicEnv.supabaseAnonKey,
  );
}
