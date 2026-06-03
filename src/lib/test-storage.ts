import type { Likert5, TestCategory } from "@/features/tests/types";
import { getTest } from "@/features/tests/registry";

const PROGRESS_PREFIX = "testprogress:";
const RUN_PREFIX = "testrun:";

export type TestProgress = {
  testId: string;
  version: number;
  category: TestCategory;
  title: string;
  answers: Record<string, Likert5>;
  currentIndex: number;
  totalQuestions: number;
  updatedAt: number;
};

export function progressKey(testId: string) {
  return `${PROGRESS_PREFIX}${testId}`;
}

export function saveTestProgress(
  data: Omit<TestProgress, "title" | "updatedAt"> & { title?: string },
) {
  if (typeof window === "undefined") return;
  const test = getTest(data.testId);
  const payload: TestProgress = {
    ...data,
    title: data.title ?? test?.title ?? data.testId,
    updatedAt: Date.now(),
  };
  try {
    sessionStorage.setItem(progressKey(data.testId), JSON.stringify(payload));
  } catch {
    // quota exceeded etc.
  }
}

export function loadTestProgress(testId: string): TestProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(progressKey(testId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TestProgress;
    const test = getTest(testId);
    if (!test || parsed.version !== test.version) {
      clearTestProgress(testId);
      return null;
    }
    const answered = Object.keys(parsed.answers ?? {}).length;
    if (answered === 0) return null;
    if (answered >= test.questions.length) {
      clearTestProgress(testId);
      return null;
    }
    return parsed;
  } catch {
    try {
      sessionStorage.removeItem(progressKey(testId));
    } catch {
      // ignore
    }
    return null;
  }
}

export function clearTestProgress(testId: string) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(progressKey(testId));
  } catch {
    // ignore
  }
}

export function listInProgressTests(): TestProgress[] {
  if (typeof window === "undefined") return [];
  const items: TestProgress[] = [];
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (!key?.startsWith(PROGRESS_PREFIX)) continue;
      const testId = key.slice(PROGRESS_PREFIX.length);
      const p = loadTestProgress(testId);
      if (p) items.push(p);
    }
  } catch {
    // ignore
  }
  items.sort((a, b) => b.updatedAt - a.updatedAt);
  return items;
}

export function saveCompletedRun(
  testId: string,
  version: number,
  answers: Record<string, Likert5>,
) {
  if (typeof window === "undefined") return;
  clearTestProgress(testId);
  try {
    sessionStorage.setItem(
      `${RUN_PREFIX}${testId}`,
      JSON.stringify({
        testId,
        version,
        answers,
        completedAt: Date.now(),
      }),
    );
  } catch {
    // ignore
  }
}

export function discardTestProgress(testId: string) {
  clearTestProgress(testId);
}
