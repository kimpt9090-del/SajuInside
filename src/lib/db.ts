import { publicEnv } from "@/lib/env";

/**
 * 피드백 저장 레이어 (Supabase / Firebase / 로컬 큐)
 *
 * .env.local 예시:
 *   NEXT_PUBLIC_DB_PROVIDER=supabase
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
 *
 * 또는:
 *   NEXT_PUBLIC_DB_PROVIDER=firebase
 *   NEXT_PUBLIC_FIREBASE_* (프로젝트 설정)
 */

export type FeedbackContentType = "test" | "fortune";

export type FeedbackRecord = {
  contentType: FeedbackContentType;
  contentId: string;
  resultId?: string;
  rating: number;
  liked: boolean;
  comment: string;
  createdAt: string;
};

export type SubmitFeedbackInput = Omit<FeedbackRecord, "createdAt">;

export type DbResult = { ok: true; id?: string } | { ok: false; error: string };

const LOCAL_QUEUE_KEY = "feedback:queue";

function readLocalQueue(): FeedbackRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_QUEUE_KEY);
    return raw ? (JSON.parse(raw) as FeedbackRecord[]) : [];
  } catch {
    return [];
  }
}

function writeLocalQueue(items: FeedbackRecord[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_QUEUE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

async function submitViaLocalQueue(
  input: SubmitFeedbackInput,
): Promise<DbResult> {
  const record: FeedbackRecord = {
    ...input,
    createdAt: new Date().toISOString(),
  };
  const queue = readLocalQueue();
  queue.push(record);
  writeLocalQueue(queue.slice(-50));
  return { ok: true, id: `local-${Date.now()}` };
}

async function submitViaSupabase(
  input: SubmitFeedbackInput,
): Promise<DbResult> {
  const url = publicEnv.supabaseUrl;
  const key = publicEnv.supabaseAnonKey;
  if (!url || !key) {
    return {
      ok: false,
      error: "Supabase URL/ANON_KEY가 설정되지 않았습니다.",
    };
  }

  const res = await fetch(`${url}/rest/v1/feedbacks`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      content_type: input.contentType,
      content_id: input.contentId,
      result_id: input.resultId ?? null,
      rating: input.rating,
      liked: input.liked,
      comment: input.comment,
      created_at: new Date().toISOString(),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { ok: false, error: text || res.statusText };
  }
  return { ok: true };
}

async function submitViaFirebase(
  input: SubmitFeedbackInput,
): Promise<DbResult> {
  const projectId = publicEnv.firebaseProjectId;
  const apiKey = publicEnv.firebaseApiKey;
  if (!projectId || !apiKey) {
    return {
      ok: false,
      error: "Firebase PROJECT_ID/API_KEY가 설정되지 않았습니다.",
    };
  }

  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/feedbacks?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          contentType: { stringValue: input.contentType },
          contentId: { stringValue: input.contentId },
          resultId: { stringValue: input.resultId ?? "" },
          rating: { integerValue: String(input.rating) },
          liked: { booleanValue: input.liked },
          comment: { stringValue: input.comment },
          createdAt: { stringValue: new Date().toISOString() },
        },
      }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    return { ok: false, error: text || res.statusText };
  }
  const data = (await res.json()) as { name?: string };
  return { ok: true, id: data.name };
}

/**
 * 피드백 제출 — provider 미설정 시 로컬 큐에 저장 (개발/데모)
 */
export async function submitFeedback(
  input: SubmitFeedbackInput,
): Promise<DbResult> {
  const provider = publicEnv.dbProvider;

  if (input.rating < 1 || input.rating > 5) {
    return { ok: false, error: "별점은 1~5 사이여야 합니다." };
  }

  if (provider === "supabase") return submitViaSupabase(input);
  if (provider === "firebase") return submitViaFirebase(input);
  return submitViaLocalQueue(input);
}

export function getFeedbackProviderLabel(): string {
  const p = publicEnv.dbProvider;
  if (p === "supabase") return "Supabase";
  if (p === "firebase") return "Firebase";
  return "로컬 저장(데모)";
}
