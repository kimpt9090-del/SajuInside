import { createBrowserClient } from "@supabase/ssr";

import { publicEnv } from "@/lib/env";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export { isSupabaseConfigured };

export function createSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) return null;
  try {
    return createBrowserClient(
      publicEnv.supabaseUrl,
      publicEnv.supabaseAnonKey,
    );
  } catch {
    return null;
  }
}
