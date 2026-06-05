import { publicEnv } from "@/lib/env";

const PLACEHOLDER_PATTERNS = [
  /xxx/i,
  /your[_-]?supabase/i,
  /example\.com/i,
  /placeholder/i,
];

export function isSupabaseConfigured(): boolean {
  const url = publicEnv.supabaseUrl.trim();
  const key = publicEnv.supabaseAnonKey.trim();
  if (!url || !key) return false;
  if (PLACEHOLDER_PATTERNS.some((p) => p.test(url) || p.test(key))) {
    return false;
  }
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname.endsWith(".supabase.co")
    );
  } catch {
    return false;
  }
}
