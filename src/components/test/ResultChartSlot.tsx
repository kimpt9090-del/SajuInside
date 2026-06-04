"use client";

import dynamic from "next/dynamic";
import type { ScoreReport } from "@/features/tests/engine";

const ResultChart = dynamic(
  () =>
    import("@/components/test/ResultChart").then((m) => m.ResultChart),
  { ssr: false, loading: () => null },
);

export function ResultChartSlot({ report }: { report: ScoreReport }) {
  return <ResultChart report={report} />;
}
