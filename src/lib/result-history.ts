/** 최근 결과 기록 (localStorage, 7일 보관) + 마이페이지 확장 + 클라우드 동기화 */

import { getTest } from "@/features/tests/registry";
import type { CloudSnapshot } from "@/lib/cloud-sync";
import { scheduleCloudPush } from "@/lib/cloud-sync";

const KEY = "result-history-v1";
const PIN_KEY = "result-history-pins-v1";
const PROFILE_KEY = "user-profile-v1";
const MAX = 24;
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type ResultHistoryEntry = {
  id: string;
  kind: "test" | "saju" | "compat" | "pastlife";
  title: string;
  subtitle: string;
  href: string;
  sharePayload?: string;
  at: number;
};

export type UserProfile = {
  nickname: string;
};

let cloudUserId: string | null = null;

export function setCloudUserId(userId: string | null): void {
  cloudUserId = userId;
}

function read(): ResultHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const items = JSON.parse(raw) as ResultHistoryEntry[];
    const now = Date.now();
    return items.filter((i) => now - i.at < TTL_MS);
  } catch {
    return [];
  }
}

function readPins(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PIN_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writePins(pins: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PIN_KEY, JSON.stringify(pins));
  } catch {
    // ignore
  }
}

function entryKey(entry: Pick<ResultHistoryEntry, "id" | "kind">): string {
  return `${entry.kind}:${entry.id}`;
}

function write(items: ResultHistoryEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX)));
  } catch {
    // ignore
  }
}

function triggerCloudPush(): void {
  if (!cloudUserId) return;
  scheduleCloudPush(cloudUserId, getLocalCloudSnapshot);
}

export function getLocalCloudSnapshot(): CloudSnapshot {
  return {
    profile: getUserProfile(),
    history: read(),
    pins: readPins(),
    updatedAt: Date.now(),
  };
}

export function applyCloudSnapshot(snapshot: CloudSnapshot): void {
  setUserProfile(snapshot.profile);
  write(snapshot.history);
  writePins(snapshot.pins);
  notifyHistoryChange();
}

export function saveResultHistory(
  entry: Omit<ResultHistoryEntry, "at">,
): void {
  const items = read().filter(
    (i) => !(i.kind === entry.kind && i.id === entry.id),
  );
  write([{ ...entry, at: Date.now() }, ...items]);
  triggerCloudPush();
}

export function listResultHistory(): ResultHistoryEntry[] {
  const pins = new Set(readPins());
  return read()
    .sort((a, b) => {
      const aPin = pins.has(entryKey(a)) ? 1 : 0;
      const bPin = pins.has(entryKey(b)) ? 1 : 0;
      if (aPin !== bPin) return bPin - aPin;
      return b.at - a.at;
    });
}

export function isPinned(entry: Pick<ResultHistoryEntry, "id" | "kind">): boolean {
  return readPins().includes(entryKey(entry));
}

export function togglePin(entry: Pick<ResultHistoryEntry, "id" | "kind">): void {
  const key = entryKey(entry);
  const pins = readPins();
  if (pins.includes(key)) {
    writePins(pins.filter((p) => p !== key));
  } else {
    writePins([key, ...pins]);
  }
  notifyHistoryChange();
  triggerCloudPush();
}

export function deleteResultHistory(
  entry: Pick<ResultHistoryEntry, "id" | "kind">,
): void {
  const key = entryKey(entry);
  write(read().filter((i) => entryKey(i) !== key));
  writePins(readPins().filter((p) => p !== key));
  notifyHistoryChange();
  triggerCloudPush();
}

export function clearResultHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(PIN_KEY);
  } catch {
    // ignore
  }
  notifyHistoryChange();
  triggerCloudPush();
}

export function exportResultHistory(): string {
  return JSON.stringify(
    {
      version: 1,
      exportedAt: Date.now(),
      profile: getUserProfile(),
      history: read(),
      pins: readPins(),
    },
    null,
    2,
  );
}

export function importResultHistory(json: string): boolean {
  try {
    const data = JSON.parse(json) as {
      profile?: UserProfile;
      history?: ResultHistoryEntry[];
      pins?: string[];
    };
    if (data.profile) setUserProfile(data.profile);
    if (data.history) write(data.history);
    if (data.pins) writePins(data.pins);
    notifyHistoryChange();
    triggerCloudPush();
    return true;
  } catch {
    return false;
  }
}

export function getUserProfile(): UserProfile {
  if (typeof window === "undefined") return { nickname: "" };
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : { nickname: "" };
  } catch {
    return { nickname: "" };
  }
}

export function setUserProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
  triggerCloudPush();
}

export function notifyHistoryChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("result-history-change"));
}

/** sessionStorage에 저장된 완료 테스트 목록 */
export type CompletedTestRun = {
  testId: string;
  title: string;
  category: string;
  completedAt: number;
};

export function listCompletedTestRuns(): CompletedTestRun[] {
  if (typeof window === "undefined") return [];
  const items: CompletedTestRun[] = [];
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (!key?.startsWith("testrun:")) continue;
      const testId = key.slice("testrun:".length);
      const raw = sessionStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as { completedAt?: number };
      const test = getTest(testId);
      if (!test) continue;
      items.push({
        testId,
        title: test.title,
        category: test.category,
        completedAt: parsed.completedAt ?? 0,
      });
    }
  } catch {
    // ignore
  }
  return items.sort((a, b) => b.completedAt - a.completedAt);
}
