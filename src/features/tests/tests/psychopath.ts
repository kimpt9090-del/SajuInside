import type { TestDefinition } from "../types";
import { getPsychopathReportSections } from "../reports/psychopath-reports";
import { getQuickSummary } from "../reports/quick-summary";

function bucket(
  id: "low" | "average" | "elevated" | "high",
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
    sections: getPsychopathReportSections(id),
    quickSummary: getQuickSummary("psychopath", id),
    color,
  };
}

export const psychopathTest: TestDefinition = {
  id: "psychopath",
  category: "psychology",
  title: "사이코패스 성향 테스트",
  description:
    "30문항 · 공감·충동·조작·냉담함 다각 분석. 30초 요약 + 연애·직장·법·FAQ 10+섹션 (진단·오락 목적).",
  version: 3,
  questions: [
    { id: "q1", text: "다른 사람이 힘들어할 때, 크게 와닿지 않는 편이다." },
    { id: "q2", text: "규칙이나 약속은 상황에 따라 어겨도 된다고 생각할 때가 있다." },
    { id: "q3", text: "목표를 이루기 위해 필요하면 거짓말도 괜찮다고 느낀다." },
    { id: "q4", text: "충동적으로 돈·관계·일을 결정한 뒤 후회한 적이 많다." },
    { id: "q5", text: "상대의 감정보다 내가 이기는 것·내가 옳은 것이 더 중요할 때가 있다." },
    { id: "q6", text: "위험하거나 자극적인 일에 끌리는 편이다." },
    { id: "q7", text: "잘못을 인정하기보다 상황·타인 탓으로 돌리는 편이다." },
    { id: "q8", text: "남을 설득하거나 조종하는 데 재능이 있다고 느낀다." },
    { id: "q9", text: "죄책감이나 양심의 가책이 거의 없는 편이다." },
    { id: "q10", text: "장기 관계보다 즉각적 이득·쾌락을 우선하는 경향이 있다." },
    { id: "q11", text: "다른 사람의 실패·고통을 보며 무감각하거나 가끔 재미있다고 느낀다." },
    { id: "q12", text: "감정을 과장하거나 연기해서 상황을 유리하게 만든 적이 있다." },
    { id: "q13", text: "복수·보복 충동을 참기 어렵다." },
    { id: "q14", text: "타인의 경계·거절을 '배신'처럼 느낄 때가 있다." },
    { id: "q15", text: "나는 특별하고 규칙은 나에게 덜 적용된다고 느낀다." },
    { id: "q16", text: "감정적 약점을 보이면 이용당할까 두렵다." },
    { id: "q17", text: "지루함을 참지 못하고 자극·위험을 찾는다." },
    { id: "q18", text: "남의 실수·실패를 보며 속으로 비웃거나 무시한 적이 있다." },
    { id: "q19", text: "장기 계획보다 당장의 쾌락·이득이 더 중요하다." },
    { id: "q20", text: "사과·용서·화해가 어렵고, 상대가 먼저 해야 한다고 느낀다." },
    { id: "q21", text: "규칙·법·윤리는 '어리석은 사람들'을 위한 것이라고 생각한 적이 있다." },
    { id: "q22", text: "감정을 조작해 상황을 유리하게 만든 경험이 있다." },
    { id: "q23", text: "상대가 울거나 화내면 오히려 짜증이나 무감각함이 먼저 든다." },
    { id: "q24", text: "약속·계약을 어겨도 큰 문제가 아니라고 생각한 적이 있다." },
    { id: "q25", text: "사람을 '이용할 수 있는 자원'처럼 보는 순간이 있다." },
    { id: "q26", text: "거짓말이 들통나도 크게 부끄럽지 않은 편이다." },
    { id: "q27", text: "갈등에서 상대의 감정보다 내가 옳은지가 더 중요하다." },
    { id: "q28", text: "위험한 행동을 해도 두려움보다 흥분이 먼저 든다." },
    { id: "q29", text: "타인의 고통을 '과장'·'연기'로 치부하기 쉽다." },
    { id: "q30", text: "내가 원하는 것을 얻기 위해 상대를 테스트하거나 확인한다." },
  ],
  results: {
    low: bucket(
      "low",
      "낮은 성향",
      "공감·양심·관계에서 일반적인 범위에 가깝습니다.",
      [
        "타인 감정에 반응하고, 거짓·조작을 피하려는 편입니다.",
        "충동 후 후회·수습을 시도합니다.",
        "장기 신뢰·관계를 중시합니다.",
        "경계 설정만 보완하면 관계가 더 편안해집니다.",
      ],
      "emerald",
    ),
    average: bucket(
      "average",
      "보통 범위",
      "누구나 가진 자기중심·냉정·계산 면이 평균 수준입니다.",
      [
        "상황에 따라 공감과 이득 계산이 섞입니다.",
        "스트레스 시 냉정해질 수 있습니다.",
        "의식적 공감·경계 설정이 도움이 됩니다.",
        "거짓·과장·약속 어기기를 줄이면 신뢰가 쌓입니다.",
      ],
      "sky",
    ),
    elevated: bucket(
      "elevated",
      "높은 편",
      "공감·충동·조작 성향에서 주의가 필요한 패턴이 보입니다.",
      [
        "타인 감정·규칙을 유연하게 넘기는 경향.",
        "관계·직장에서 신뢰 문제가 반복될 수 있습니다.",
        "자기 성찰·상담을 권장합니다.",
        "작은 약속부터 지키는 것이 출발점입니다.",
      ],
      "amber",
    ),
    high: bucket(
      "high",
      "매우 높은 편",
      "냉담·충동·조작 성향이 매우 두드러집니다. 전문가 상담을 권장합니다.",
      [
        "공감·양심·책임에서 극단적 패턴 가능.",
        "법·윤리·관계 리스크가 클 수 있습니다.",
        "정신건강·상담 전문가 도움을 적극 권장.",
        "혼자 '괜찮다'고만 하면 패턴이 고착될 수 있습니다.",
      ],
      "rose",
    ),
  },
  scoring: {
    strategy: "sum",
    buckets: [
      { min: 30, max: 65, resultId: "low" },
      { min: 66, max: 95, resultId: "average" },
      { min: 96, max: 125, resultId: "elevated" },
      { min: 126, max: 150, resultId: "high" },
    ],
  },
};
