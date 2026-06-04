"use client";

import type { AxisPairScore } from "@/features/tests/engine";

export function AxisSummary({ axes }: { axes: AxisPairScore[] }) {
  return (
    <div className="mt-4 space-y-3">
      {axes.map((axis) => {
        const winner =
          axis.poleA.percent >= axis.poleB.percent ? axis.poleA : axis.poleB;
        const borderline = Math.abs(axis.poleA.percent - axis.poleB.percent) < 12;

        return (
          <div key={axis.axisId}>
            <div className="flex items-center justify-between text-xs font-medium text-zinc-700">
              <span>{axis.poleA.label}</span>
              <span className="text-zinc-500">
                {borderline ? "경계" : winner.label} {winner.percent}%
              </span>
              <span>{axis.poleB.label}</span>
            </div>
            <div className="mt-1 flex h-2.5 overflow-hidden rounded-full bg-zinc-200">
              <div
                className="bg-zinc-700 transition-all"
                style={{ width: `${axis.poleA.percent}%` }}
              />
              <div
                className="bg-zinc-400 transition-all"
                style={{ width: `${axis.poleB.percent}%` }}
              />
            </div>
            <div className="mt-0.5 flex justify-between text-[10px] text-zinc-500">
              <span>{axis.poleA.percent}%</span>
              <span>{axis.poleB.percent}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
