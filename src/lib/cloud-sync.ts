import { publicEnv } from "@/lib/env";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { ResultHistoryEntry, UserProfile } from "@/lib/result-history";

export type CloudSnapshot = {
  profile: UserProfile;
  history: ResultHistoryEntry[];
  pins: string[];
  updatedAt: number;
};

type UserDataRow = {
  user_id: string;
  nickname: string;
  history: ResultHistoryEntry[];
  pins: string[];
  updated_at: string;
};

let accessTokenProvider: (() => Promise<string | null>) | null = null;
let syncTimer: ReturnType<typeof setTimeout> | null = null;

export function registerCloudSyncAuth(provider: () => Promise<string | null>) {
  accessTokenProvider = provider;
}

export function isCloudSyncAvailable(): boolean {
  return isSupabaseConfigured();
}

function mergeHistories(
  local: ResultHistoryEntry[],
  remote: ResultHistoryEntry[],
): ResultHistoryEntry[] {
  const map = new Map<string, ResultHistoryEntry>();
  for (const item of [...remote, ...local]) {
    const key = `${item.kind}:${item.id}`;
    const prev = map.get(key);
    if (!prev || item.at >= prev.at) map.set(key, item);
  }
  return [...map.values()].sort((a, b) => b.at - a.at).slice(0, 24);
}

function mergePins(local: string[], remote: string[]): string[] {
  return [...new Set([...remote, ...local])];
}

async function getAccessToken(): Promise<string | null> {
  if (!accessTokenProvider) return null;
  return accessTokenProvider();
}

async function fetchRemote(userId: string, token: string): Promise<CloudSnapshot | null> {
  const url = publicEnv.supabaseUrl;
  const key = publicEnv.supabaseAnonKey;
  if (!url || !key) return null;

  const res = await fetch(
    `${url}/rest/v1/user_data?user_id=eq.${userId}&select=nickname,history,pins,updated_at`,
    {
      headers: {
        apikey: key,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) return null;
  const rows = (await res.json()) as UserDataRow[];
  const row = rows[0];
  if (!row) return null;

  return {
    profile: { nickname: row.nickname ?? "" },
    history: Array.isArray(row.history) ? row.history : [],
    pins: Array.isArray(row.pins) ? row.pins : [],
    updatedAt: row.updated_at ? Date.parse(row.updated_at) : 0,
  };
}

async function upsertRemote(
  userId: string,
  token: string,
  snapshot: CloudSnapshot,
): Promise<boolean> {
  const url = publicEnv.supabaseUrl;
  const key = publicEnv.supabaseAnonKey;
  if (!url || !key) return false;

  const res = await fetch(`${url}/rest/v1/user_data`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify({
      user_id: userId,
      nickname: snapshot.profile.nickname,
      history: snapshot.history,
      pins: snapshot.pins,
      updated_at: new Date().toISOString(),
    }),
  });

  return res.ok;
}

export async function pullCloudSnapshot(
  userId: string,
): Promise<CloudSnapshot | null> {
  const token = await getAccessToken();
  if (!token) return null;
  return fetchRemote(userId, token);
}

export async function pushCloudSnapshot(
  userId: string,
  snapshot: CloudSnapshot,
): Promise<boolean> {
  const token = await getAccessToken();
  if (!token) return false;
  return upsertRemote(userId, token, snapshot);
}

export async function mergeCloudWithLocal(
  userId: string,
  local: CloudSnapshot,
): Promise<CloudSnapshot> {
  const remote = await pullCloudSnapshot(userId);
  if (!remote) return local;

  return {
    profile: {
      nickname: local.profile.nickname || remote.profile.nickname,
    },
    history: mergeHistories(local.history, remote.history),
    pins: mergePins(local.pins, remote.pins),
    updatedAt: Date.now(),
  };
}

export function scheduleCloudPush(
  userId: string,
  getLocalSnapshot: () => CloudSnapshot,
): void {
  if (!isCloudSyncAvailable() || typeof window === "undefined") return;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    void (async () => {
      const local = getLocalSnapshot();
      await pushCloudSnapshot(userId, local);
    })();
  }, 900);
}

export async function syncCloudOnLogin(
  userId: string,
  getLocalSnapshot: () => CloudSnapshot,
  applySnapshot: (snapshot: CloudSnapshot) => void,
): Promise<{ ok: boolean; message: string }> {
  if (!isCloudSyncAvailable()) {
    return { ok: false, message: "Supabase 환경 변수가 설정되지 않았습니다." };
  }

  const local = getLocalSnapshot();
  const merged = await mergeCloudWithLocal(userId, local);
  applySnapshot(merged);
  const pushed = await pushCloudSnapshot(userId, merged);
  return pushed
    ? { ok: true, message: "클라우드와 동기화했습니다." }
    : { ok: false, message: "클라우드 업로드에 실패했습니다." };
}
