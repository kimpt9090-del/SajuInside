"use client";

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
    <div className="flex flex-col rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white p-3 shadow-sm sm:p-4">
      <p className="text-center text-xs font-semibold text-amber-800">{title}</p>
      <div className="mt-3 flex flex-col items-center gap-0.5">
        <span className="text-2xl font-bold text-zinc-900">{pillar.stemHanja}</span>
        <span className="text-sm font-medium text-zinc-700">{pillar.stem}</span>
        {pillar.stemElement ? (
          <span className="text-[10px] text-amber-700">{pillar.stemElement}·천간</span>
        ) : null}
      </div>
      <div className="my-2 h-px w-full bg-amber-200" />
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-2xl font-bold text-zinc-900">{pillar.branchHanja}</span>
        <span className="text-sm font-medium text-zinc-700">{pillar.branch}</span>
        {pillar.branchElement ? (
          <span className="text-[10px] text-amber-700">{pillar.branchElement}·지지</span>
        ) : null}
      </div>
      {pillar.stemDesc || pillar.branchDesc ? (
        <div className="mt-3 space-y-1.5 border-t border-amber-100 pt-2">
          {pillar.stemDesc ? (
            <p className="text-[10px] leading-4 text-zinc-600">{pillar.stemDesc}</p>
          ) : null}
          {pillar.branchDesc ? (
            <p className="text-[10px] leading-4 text-zinc-600">{pillar.branchDesc}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function ManseryeokTable({ result }: { result: SajuResult }) {
  const rows: Array<{ label: string; pillar: Pillar }> = [
    { label: "시주 (時柱)", pillar: result.pillars.hour },
    { label: "일주 (日柱)", pillar: result.pillars.day },
    { label: "월주 (月柱)", pillar: result.pillars.month },
    { label: "년주 (年柱)", pillar: result.pillars.year },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-3 py-2 font-semibold text-card-foreground">주(柱)</th>
            <th className="px-3 py-2 font-semibold text-card-foreground">천간</th>
            <th className="px-3 py-2 font-semibold text-card-foreground">지지</th>
            <th className="px-3 py-2 font-semibold text-card-foreground">해석</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ label, pillar }) => (
            <tr key={label} className="border-b border-border last:border-0">
              <td className="px-3 py-3 font-medium text-card-foreground">{label}</td>
              <td className="px-3 py-3">
                <span className="text-lg font-bold">{pillar.stemHanja}</span>
                <span className="ml-1 text-muted-foreground">({pillar.stem})</span>
              </td>
              <td className="px-3 py-3">
                <span className="text-lg font-bold">{pillar.branchHanja}</span>
                <span className="ml-1 text-muted-foreground">({pillar.branch})</span>
              </td>
              <td className="px-3 py-3 text-xs leading-5 text-muted-foreground">
                {pillar.stemDesc}
                <br />
                {pillar.branchDesc}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
