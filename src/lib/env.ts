/**
 * 클라이언트에 노출 가능한 환경 변수만 중앙 관리합니다.
 */

function readPublic(name: string, fallback = ""): string {
  const v = process.env[name];
  return typeof v === "string" && v.length > 0 ? v : fallback;
}

function normalizeSiteUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed.replace(/\/$/, "");
  }
  return `https://${trimmed.replace(/\/$/, "")}`;
}

function defaultSiteUrl(): string {
  const explicit = normalizeSiteUrl(readPublic("NEXT_PUBLIC_SITE_URL"));
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const publicEnv = {
  siteUrl: defaultSiteUrl(),
  kakaoJsKey: readPublic("NEXT_PUBLIC_KAKAO_JS_KEY"),
  dbProvider: readPublic("NEXT_PUBLIC_DB_PROVIDER", "local") as
    | "local"
    | "supabase"
    | "firebase",
  supabaseUrl: readPublic("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: readPublic("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  firebaseProjectId: readPublic("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  firebaseApiKey: readPublic("NEXT_PUBLIC_FIREBASE_API_KEY"),
} as const;

export function getMetadataBaseUrl(): URL {
  try {
    return new URL(publicEnv.siteUrl);
  } catch {
    return new URL("http://localhost:3000");
  }
}
