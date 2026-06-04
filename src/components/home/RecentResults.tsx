"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  listResultHistory,
  type ResultHistoryEntry,
} from "@/lib/result-history";

function subscribe(cb: () => void) {
  window.addEventListener("result-history-change", cb);
  window.addEventListener("focus", cb);
  return () => {
    window.removeEventListener("result-history-change", cb);
    window.removeEventListener("focus", cb);
  };
}

function getSnapshot(): ResultHistoryEntry[] {
  return listResultHistory();
}

function getServerSnapshot(): ResultHistoryEntry[] {
  return [];
}

export function RecentResults() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (items.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-foreground">최근 본 결과</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        최근 7일 · 이 기기에 저장됩니다 (생년월일은 서버에 저장하지 않습니다)
      </p>
      <ul className="mt-4 space-y-2">
        {items.slice(0, 6).map((item) => (
          <li key={`${item.kind}-${item.id}-${item.at}`}>
            <Link
              href={item.href}
              className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm transition hover:border-violet-300 dark:border-zinc-700 dark:bg-zinc-900"
            >
              <span>
                <span className="font-semibold text-foreground">{item.title}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {item.subtitle}
                </span>
              </span>
              <span className="text-xs text-violet-600">보기 →</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
