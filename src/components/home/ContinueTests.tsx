"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSyncExternalStore } from "react";
import {
  discardTestProgress,
  listInProgressTests,
  type TestProgress,
} from "@/lib/test-storage";
import { testRunPath } from "@/lib/test-paths";

function subscribeProgress(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("focus", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("focus", onStoreChange);
  };
}

function getProgressSnapshot(): TestProgress[] {
  return listInProgressTests();
}

export function ContinueTests() {
  const items = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    (): TestProgress[] => [],
  );

  function onDiscard(testId: string) {
    discardTestProgress(testId);
    window.dispatchEvent(new Event("storage"));
  }

  if (items.length === 0) return null;

  return (
    <section className="card-surface mb-8 border-violet-300/50 bg-gradient-to-b from-violet-50 to-card dark:from-violet-950/40 dark:to-card">
      <h2 className="text-base font-semibold text-violet-900 dark:text-violet-200">
        이어서 계속하기
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        진행 중이던 테스트가 있습니다. 이어서 풀거나 삭제할 수 있어요.
      </p>

      <AnimatePresence mode="popLayout">
        <ul className="mt-4 space-y-3">
          {items.map((item) => {
            const answered = Object.keys(item.answers).length;
            const pct = Math.round((answered / item.totalQuestions) * 100);
            return (
              <motion.li
                key={item.testId}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
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
                    onClick={() => onDiscard(item.testId)}
                    className="btn-secondary"
                  >
                    삭제
                  </button>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </AnimatePresence>
    </section>
  );
}
