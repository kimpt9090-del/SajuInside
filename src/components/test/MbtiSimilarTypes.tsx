import { getMbtiSimilarTypes } from "@/features/tests/reports/mbti-similar-types";
import type { AxisPairScore } from "@/features/tests/engine";

export function MbtiSimilarTypes({
  code,
  axes,
}: {
  code: string;
  axes?: AxisPairScore[];
}) {
  const similar = getMbtiSimilarTypes(code, axes);

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        유사 유형 · 경계형 참고
      </h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        4축 중 한두 축이 50:50에 가까우면 아래 유형도 읽어보세요.
      </p>
      <ul className="mt-4 space-y-2">
        {similar.map((s, i) => (
          <li
            key={s.type}
            className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          >
            <span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                {i + 1}. {s.type}
              </span>
              <span className="ml-2 text-xs text-zinc-500">{s.reason}</span>
            </span>
            <span className="font-semibold text-sky-600 dark:text-sky-400">
              {s.similarity}%
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
