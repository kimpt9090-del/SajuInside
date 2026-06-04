import type { TestDefinition } from "../types";
import { getAnxietyReportSections } from "../reports/anxiety-reports";
import { getQuickSummary } from "../reports/quick-summary";

function bucket(
  id: "minimal" | "mild" | "moderate" | "severe",
  title: string,
  summary: string,
  details: string[],
  color: "emerald" | "sky" | "amber" | "rose",
) {
  return {
    id,
    title,
    summary,
    details,
    sections: getAnxietyReportSections(id),
    quickSummary: getQuickSummary("anxiety", id),
    color,
  };
}

/** Likert 1-5 → GAD-0~3 환산 후 합산 (14문항, 최대 42) */
export const anxietyTest: TestDefinition = {
  id: "anxiety",
  category: "psychology",
  title: "불안 자가 진단 (GAD-7)",
  description:
    "14문항 · GAD-7 기반 + 추가 항목. 30초 요약 + 이완·직장·관계·응급 안내 (진단 대체 불가).",
  version: 2,
  questions: [
    { id: "q1", text: "최근 2주간, 초조하거나 불안하거나 긴장된 느낌이 들었다." },
    { id: "q2", text: "걱정을 멈추거나 조절하기 어려웠다." },
    { id: "q3", text: "여러 가지 일에 대해 지나치게 걱정했다." },
    { id: "q4", text: "편히 앉아 있기 어려웠다." },
    { id: "q5", text: "쉽게 짜증이 나거나 예민해졌다." },
    { id: "q6", text: "마치 끔찍한 일이 일어날 것처럼 두려웠다." },
    { id: "q7", text: "불안 때문에 일·공부·집안일에 집중하기 어려웠다." },
    { id: "q8", text: "가슴 두근거림·호흡 곤란·어지럼 등 신체 증상이 동반되었다." },
    { id: "q9", text: "잠들기 어렵거나, 불안한 꿈으로 자주 깼다." },
    { id: "q10", text: "사람 많은 곳·발표·회의 등에서 불안이 심해졌다." },
    { id: "q11", text: "완벽해야 한다는 생각 때문에 스트레스를 받았다." },
    { id: "q12", text: "갑작스러운 변화·불확실성을 견디기 어려웠다." },
    { id: "q13", text: "대체로 마음이 편안하고 안정적이었다.", reverse: true },
    { id: "q14", text: "걱정을 말로 나누면 조금은 가벼워지는 편이다.", reverse: true },
  ],
  results: {
    minimal: bucket(
      "minimal",
      "최소~정상",
      "불안 증상이 거의 없거나 일시적 스트레스 수준입니다.",
      ["일상 기능 유지", "예방적 이완·수면 습관 유지", "2주 이상 악화 시 재검사"],
      "emerald",
    ),
    mild: bucket(
      "mild",
      "가벼운 불안",
      "걱정·긴장이 있으나 일상은 유지되는 수준입니다.",
      ["호흡·이완·운동 권장", "카페인·수면 관리", "2주 이상 지속 시 상담 고려"],
      "sky",
    ),
    moderate: bucket(
      "moderate",
      "중간 불안",
      "일상 기능에 영향이 있을 수 있습니다. 상담·검진을 권장합니다.",
      ["거의 매일 불안·걱정", "집중·수면·관계에 영향", "전문가 상담 권장"],
      "amber",
    ),
    severe: bucket(
      "severe",
      "심한 불안",
      "일상 생활에 큰 지장이 있을 수 있습니다. 즉시 전문가 도움을 권장합니다.",
      ["강한 불안·신체 증상", "회피·고립 가능", "정신건강의학과·상담센터 연계"],
      "rose",
    ),
  },
  scoring: {
    strategy: "sum",
    sumMode: "gad",
    buckets: [
      { min: 0, max: 10, resultId: "minimal" },
      { min: 11, max: 18, resultId: "mild" },
      { min: 19, max: 26, resultId: "moderate" },
      { min: 27, max: 99, resultId: "severe" },
    ],
  },
};
