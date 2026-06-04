import type { QuickSummary } from "@/features/tests/reports/quick-summary";

export function QuickSummaryBox({ summary }: { summary: QuickSummary }) {
  return (
    <section className="rounded-2xl border-2 border-violet-200 bg-violet-50/80 p-5 shadow-sm dark:border-violet-800 dark:bg-violet-950/40">
      <p className="text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
        30초 요약
      </p>
      <p className="mt-2 text-base font-semibold leading-7 text-violet-950 dark:text-violet-100">
        {summary.oneLiner}
      </p>
      <ul className="mt-3 space-y-1.5 text-sm leading-6 text-violet-900 dark:text-violet-200">
        {summary.bullets.map((b, i) => (
          <li key={i}>• {b}</li>
        ))}
      </ul>
      <p className="mt-4 rounded-xl border border-violet-200 bg-white/70 px-3 py-2 text-sm font-medium text-violet-900 dark:border-violet-700 dark:bg-violet-900/30 dark:text-violet-100">
        오늘의 실천: {summary.actionTip}
      </p>
    </section>
  );
}
