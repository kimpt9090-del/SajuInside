import type { Pillar, SajuResult } from "@/features/fortune/types";

export function SajuPillars({ result }: { result: SajuResult }) {
  const order: Array<{ key: keyof SajuResult["pillars"]; title: string }> = [
    { key: "hour", title: "시주" },
    { key: "day", title: "일주" },
    { key: "month", title: "월주" },
    { key: "year", title: "년주" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {order.map(({ key, title }) => (
        <PillarCard key={key} title={title} pillar={result.pillars[key]} />
      ))}
    </div>
  );
}

function PillarCard({ title, pillar }: { title: string; pillar: Pillar }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white p-4 shadow-sm">
      <p className="text-xs font-semibold text-amber-800">{title}</p>
      <div className="mt-3 flex flex-col items-center gap-1">
        <span className="text-2xl font-bold text-zinc-900">{pillar.stemHanja}</span>
        <span className="text-xs text-zinc-500">{pillar.stem}</span>
      </div>
      <div className="my-2 h-px w-8 bg-amber-200" />
      <div className="flex flex-col items-center gap-1">
        <span className="text-2xl font-bold text-zinc-900">{pillar.branchHanja}</span>
        <span className="text-xs text-zinc-500">{pillar.branch}</span>
      </div>
    </div>
  );
}
