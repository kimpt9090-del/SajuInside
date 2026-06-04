import type { DimensionScore } from "@/features/tests/engine";

const LABELS: Record<string, string> = {
  secure: "안정",
  anxious: "불안",
  avoidant: "회피",
  sanguine: "다혈질",
  choleric: "담즙질",
  melancholic: "우울질",
  phlegmatic: "점액질",
};

export function DimensionSummary({
  dimensions,
  primaryId,
}: {
  dimensions: DimensionScore[];
  primaryId: string;
}) {
  if (!dimensions.length) return null;

  const isMixed =
    dimensions.length >= 2 &&
    dimensions[0]!.percent - dimensions[1]!.percent < 12;

  return (
    <div className="mt-4 space-y-3">
      {isMixed ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          혼합형: {LABELS[dimensions[0]!.key] ?? dimensions[0]!.label}{" "}
          {dimensions[0]!.percent}% + {LABELS[dimensions[1]!.key] ?? dimensions[1]!.label}{" "}
          {dimensions[1]!.percent}% — 두 경향이 함께 나타납니다.
        </p>
      ) : null}
      {dimensions.map((d) => (
        <div key={d.key}>
          <div className="flex justify-between text-xs font-medium text-zinc-700 dark:text-zinc-300">
            <span>
              {LABELS[d.key] ?? d.label}
              {d.key === primaryId ? " · 주 유형" : ""}
            </span>
            <span>{d.percent}%</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
            <div
              className={[
                "h-full rounded-full transition-all",
                d.key === primaryId ? "bg-violet-500" : "bg-zinc-400",
              ].join(" ")}
              style={{ width: `${d.percent}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
