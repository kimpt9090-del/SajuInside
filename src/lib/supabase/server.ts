import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { publicEnv } from "@/lib/env";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function createSupabaseServerClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(
    publicEnv.supabaseUrl,
    publicEnv.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Component에서 set 불가 — middleware/route에서만 사용
          }
        },
      },
    },
  );
}
