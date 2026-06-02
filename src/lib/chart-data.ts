import type { ScoreReport } from "@/features/tests/engine";

export type RadarPoint = {
  subject: string;
  value: number;
  fullMark: number;
};

export type PairBarPoint = {
  name: string;
  left: number;
  right: number;
  leftLabel: string;
  rightLabel: string;
};

export function buildRadarFromReport(report: ScoreReport): RadarPoint[] {
  if (report.byAxis?.length) {
    return report.byAxis.map((a) => ({
      subject: a.poleA.key,
      value: a.poleA.percent,
      fullMark: 100,
    }));
  }
  if (report.byDimension?.length) {
    return report.byDimension.map((d) => ({
      subject: d.label,
      value: d.percent,
      fullMark: 100,
    }));
  }
  return [];
}

export function buildPairBarsFromReport(report: ScoreReport): PairBarPoint[] {
  if (!report.byAxis?.length) return [];
  return report.byAxis.map((a) => ({
    name: a.axisId.toUpperCase(),
    left: a.poleA.percent,
    right: a.poleB.percent,
    leftLabel: a.poleA.label,
    rightLabel: a.poleB.label,
  }));
}

export function hasChartData(report: ScoreReport): boolean {
  return Boolean(report.byAxis?.length || report.byDimension?.length);
}
