"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  discardTestProgress,
  listInProgressTests,
  type TestProgress,
} from "@/lib/test-storage";
import { testRunPath } from "@/lib/test-paths";

const PROGRESS_EVENT = "test-progress-change";
const EMPTY_PROGRESS: TestProgress[] = [];

let cachedItems: TestProgress[] = EMPTY_PROGRESS;
let cachedDigest = "";

/** useSyncExternalStore는 동일 데이터면 같은 참조를 반환해야 무한 리렌더가 나지 않습니다. */
function getStableInProgressTests(): TestProgress[] {
  const fresh = listInProgressTests();
  const digest = fresh
    .map(
      (p) =>
        `${p.testId}:${p.updatedAt}:${Object.keys(p.answers).length}`,
    )
    .join("|");
  if (digest === cachedDigest) return cachedItems;
  cachedDigest = digest;
  cachedItems = fresh.length === 0 ? EMPTY_PROGRESS : fresh;
  return cachedItems;
}

function subscribeProgress(onStoreChange: () => void) {
  const refresh = () => {
    cachedDigest = "";
    onStoreChange();
  };
  window.addEventListener("storage", refresh);
  window.addEventListener("focus", refresh);
  window.addEventListener(PROGRESS_EVENT, refresh);
  return () => {
    window.removeEventListener("storage", refresh);
    window.removeEventListener("focus", refresh);
    window.removeEventListener(PROGRESS_EVENT, refresh);
  };
}

function notifyProgressChange() {
  cachedDigest = "";
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

export function ContinueTests() {
  const items = useSyncExternalStore(
    subscribeProgress,
    getStableInProgressTests,
    () => EMPTY_PROGRESS,
  );

  if (items.length === 0) return null;

  return (
    <section className="card-surface mb-8 border-violet-300/50 bg-gradient-to-b from-violet-50 to-card dark:from-violet-950/40 dark:to-card">
      <h2 className="text-base font-semibold text-violet-900 dark:text-violet-200">
        이어서 계속하기
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        진행 중이던 테스트가 있습니다. 이어서 풀거나 삭제할 수 있어요.
      </p>

      <ul className="mt-4 space-y-3">
        {items.map((item) => {
          const answered = Object.keys(item.answers).length;
          const pct = Math.round((answered / item.totalQuestions) * 100);
          return (
            <li
              key={item.testId}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-card-foreground">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {answered}/{item.totalQuestions}문항 · {pct}% 완료
                </p>
                <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-violet-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={testRunPath(item.category, item.testId)}
                  className="btn-primary bg-violet-600 text-white hover:opacity-90 dark:bg-violet-500"
                >
                  이어서 계속하기
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    discardTestProgress(item.testId);
                    notifyProgressChange();
                  }}
                  className="btn-secondary"
                >
                  삭제
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
