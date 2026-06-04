import type { TestAnswer, TestQuestion } from "@/features/tests/types";

const SUBSCALES = [
  { id: "empathy", label: "공감·양심", qids: ["q1", "q11", "q18", "q23", "q29"] },
  { id: "impulse", label: "충동·자극", qids: ["q4", "q6", "q17", "q19", "q28"] },
  { id: "manip", label: "조작·기만", qids: ["q3", "q8", "q12", "q22", "q30"] },
  { id: "cold", label: "냉담·특권", qids: ["q5", "q9", "q14", "q15", "q26", "q27"] },
] as const;

function scoreGroup(
  questions: TestQuestion[],
  answers: Record<string, TestAnswer>,
  qids: readonly string[],
): number {
  const map = new Map(questions.map((q) => [q.id, q]));
  let sum = 0;
  let max = 0;
  for (const id of qids) {
    const q = map.get(id);
    if (!q) continue;
    const raw = answers[id];
    const v = typeof raw === "number" ? raw : 3;
    const base = q.reverse ? 6 - v : v;
    sum += base;
    max += 5;
  }
  return max > 0 ? Math.round((sum / max) * 100) : 0;
}

export function PsychopathSubscales({
  questions,
  answers,
}: {
  questions: TestQuestion[];
  answers: Record<string, TestAnswer>;
}) {
  const rows = SUBSCALES.map((s) => ({
    ...s,
    percent: scoreGroup(questions, answers, s.qids),
  })).sort((a, b) => b.percent - a.percent);

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        하위 척도 분석
      </h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        공감·충동·조작·냉담 네 영역별 경향입니다. 높을수록 해당 특성이 두드러집니다.
      </p>
      <div className="mt-4 space-y-3">
        {rows.map((r) => (
          <div key={r.id}>
            <div className="flex justify-between text-xs font-medium">
              <span>{r.label}</span>
              <span>{r.percent}%</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className={[
                  "h-full rounded-full",
                  r.percent >= 70
                    ? "bg-rose-500"
                    : r.percent >= 50
                      ? "bg-amber-400"
                      : "bg-emerald-400",
                ].join(" ")}
                style={{ width: `${r.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
