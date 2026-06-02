/**
 * 클라이언트에 노출 가능한 환경 변수만 중앙 관리합니다.
 * 비밀 키(서비스 롤 등)는 NEXT_PUBLIC_ 접두사 없이 서버 전용으로 두고,
 * 이 파일에 포함하지 마세요.
 */

function readPublic(name: string, fallback = ""): string {
  const v = process.env[name];
  return typeof v === "string" && v.length > 0 ? v : fallback;
}

export const publicEnv = {
  siteUrl: readPublic("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
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

export function assertSafePublicEnv() {
  if (process.env.NODE_ENV !== "production") return;
  const forbidden = ["SERVICE_ROLE", "SECRET", "PRIVATE_KEY"];
  for (const key of Object.keys(process.env)) {
    if (!key.startsWith("NEXT_PUBLIC_")) continue;
    if (forbidden.some((f) => key.toUpperCase().includes(f))) {
      console.warn(`[env] NEXT_PUBLIC 변수명에 비밀이 포함될 수 있습니다: ${key}`);
    }
  }
}
