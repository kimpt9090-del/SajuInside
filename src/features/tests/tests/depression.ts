import type { TestDefinition } from "../types";
import { getDepressionReportSections } from "../reports/depression-reports";
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
    sections: getDepressionReportSections(id),
    quickSummary: getQuickSummary("depression", id),
    color,
  };
}

export const depressionTest: TestDefinition = {
  id: "depression",
  category: "psychology",
  title: "우울증 자가 진단",
  description:
    "18문항 · PHQ-9 핵심 9문항 합산(0~27) + 추가 항목. 30초 요약 + 자가 관리·직장·관계·FAQ (진단 대체 불가).",
  version: 4,
  questions: [
    { id: "q1", text: "최근 2주간, 기분이 가라앉거나 슬프거나 절망적인 날이 많았다." },
    { id: "q2", text: "평소 즐기던 일에 흥미나 즐거움이 거의 없었다." },
    { id: "q3", text: "잠들기 어렵거나, 자주 깨거나, 너무 많이 잤다." },
    { id: "q4", text: "피곤하고 기력이 없었다." },
    { id: "q5", text: "식욕이 줄었거나, 과식했다." },
    { id: "q6", text: "자신을 실패자라고 느끼거나, 자신·가족을 실망시켰다고 느꼈다." },
    { id: "q7", text: "일·공부·집안일에 집중하기 어려웠다." },
    { id: "q8", text: "움직임·말이 느려졌거나, 반대로 초조하고 가만히 있기 어려웠다." },
    { id: "q9", text: "죽는 것이 더 낫겠다거나, 자해·자살 생각이 들었다." },
    { id: "q10", text: "사람 만나기·연락하기가 귀찮고 피하고 싶었다." },
    { id: "q11", text: "아침에 일어나기 특히 힘들었다." },
    { id: "q12", text: "대체로 기분 좋고 희망적인 날이 많았다.", reverse: true },
    { id: "q13", text: "집중·기억·결정하기가 평소보다 어려웠다." },
    { id: "q14", text: "움직이거나 말하는 속도가 느려진 것 같다." },
    { id: "q15", text: "아무것도 해낼 수 없다는 느낌이 들었다." },
    { id: "q16", text: "몸이 무겁거나 두통·소화 문제 등 신체 증상이 동반되었다." },
    { id: "q17", text: "작은 일에도 짜증이 나거나 예민해졌다." },
    { id: "q18", text: "미래에 대한 희망이 거의 느껴지지 않았다." },
  ],
  results: {
    minimal: bucket(
      "minimal",
      "최소~정상",
      "우울 증상이 거의 없거나 일시적 스트레스 수준입니다.",
      [
        "기분·수면·에너지가 대체로 안정적",
        "예방적 자기 돌봄 유지",
        "2주 이상 악화 시 재검사",
      ],
      "emerald",
    ),
    mild: bucket(
      "mild",
      "가벼운 우울",
      "기분 저하·피로가 있으나 일상은 유지되는 수준입니다.",
      [
        "흥미·수면·에너지에 작은 변화",
        "생활 습관·대화·휴식 권장",
        "2주 이상 지속 시 상담",
      ],
      "sky",
    ),
    moderate: bucket(
      "moderate",
      "중간 우울",
      "일상 기능에 영향이 있을 수 있습니다. 상담·검진을 권장합니다.",
      [
        "거의 매일 우울·무기력",
        "일·관계·자기 돌보기 어려움",
        "전문가 상담 권장",
      ],
      "amber",
    ),
    severe: bucket(
      "severe",
      "심한 우울",
      "즉시 전문가 도움이 필요할 수 있습니다.",
      [
        "심한 절망·무가치감·기능 저하",
        "자살·자해 생각 가능",
        "1393·1577-0199·119 연락",
      ],
      "rose",
    ),
  },
  scoring: {
    strategy: "sum",
    sumMode: "phq",
    buckets: [
      { min: 0, max: 4, resultId: "minimal" },
      { min: 5, max: 9, resultId: "mild" },
      { min: 10, max: 14, resultId: "moderate" },
      { min: 15, max: 27, resultId: "severe" },
    ],
  },
};
