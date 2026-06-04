import type { TestDefinition } from "../types";
import { getEgenTetoReportSections } from "../reports/egen-teto-reports";
import { getQuickSummary } from "../reports/quick-summary";

function bucket(
  id: "egen" | "teto" | "balanced",
  title: string,
  summary: string,
  details: string[],
  color: "emerald" | "sky" | "zinc",
) {
  return {
    id,
    title,
    summary,
    details,
    sections: getEgenTetoReportSections(id),
    quickSummary: getQuickSummary("egen-teto", id),
    color,
  };
}

export const egenTetoTest: TestDefinition = {
  id: "egen-teto",
  category: "types",
  title: "에겐·테토 성향 테스트",
  description:
    "24문항 · 에겐(섬세·정돈) vs 테토(대담·자유) 미학·성향. 30초 요약 + 스타일·연애·SNS·직장 8+섹션.",
  version: 1,
  questions: [
    { id: "q1", text: "옷·소품은 깔끔하고 통일감 있는 조합을 선호한다." },
    { id: "q2", text: "과감한 색·패턴·실험적 스타일이 더 끌린다." },
    { id: "q3", text: "방·책상 정리가 되어 있어야 마음이 편하다." },
    { id: "q4", text: "즉흥적·자유로운 분위기가 더 나답다고 느낀다." },
    { id: "q5", text: "사진·SNS는 톤·구도를 맞춰 정성껏 올린다." },
    { id: "q6", text: "솔직하고 거침없는 표현이 더 멋있다고 느낀다." },
    { id: "q7", text: "작은 디테일·섬세한 마무리를 중시한다." },
    { id: "q8", text: "큰 그림·임팩트·에너지가 더 중요하다." },
    { id: "q9", text: "계획·루틴·체크리스트가 있으면 안심된다." },
    { id: "q10", text: "계획 없이 흘러가는 하루가 더 즐겁다." },
    { id: "q11", text: "부드러운 색·자연스러운 분위기를 좋아한다." },
    { id: "q12", text: "강렬한 대비·개성 있는 분위기를 좋아한다." },
    { id: "q13", text: "말·행동에서 예의·배려를 세심히 챙긴다." },
    { id: "q14", text: "있는 그대로·직설적으로 말하는 편이다." },
    { id: "q15", text: "꾸준한 자기 관리·루틴이 중요하다." },
    { id: "q16", text: "규칙보다 기분·순간의 영감을 따르는 편이다." },
    { id: "q17", text: "조용하고 차분한 카페·공간이 편하다." },
    { id: "q18", text: "활기·소음·사람 많은 곳에서 에너지를 얻는다." },
    { id: "q19", text: "선물·메시지도 포장·문구를 정성껏 준비한다." },
    { id: "q20", text: "형식보다 마음·솔직함이 더 중요하다." },
    { id: "q21", text: "실수·지저분함이 보이면 신경 쓰인다." },
    { id: "q22", text: "완벽보다 재미·속도가 더 중요할 때가 많다." },
    { id: "q23", text: "조화·균형·조용한 아름다움을 추구한다." },
    { id: "q24", text: "자기주장·개성·대담함을 드러내는 편이다." },
  ],
  results: {
    egen: bucket(
      "egen",
      "에겐형",
      "섬세·정돈·조화를 중시하는 에겐 성향이 강합니다.",
      [
        "깔끔한 스타일·루틴·디테일에 강점",
        "관계에서 배려·예의·세심함이 돋보임",
        "완벽주의·스트레스 관리에 유의",
      ],
      "zinc",
    ),
    teto: bucket(
      "teto",
      "테토형",
      "대담·자유·임팩트를 중시하는 테토 성향이 강합니다.",
      [
        "개성·솔직함·에너지가 강점",
        "즉흥·실험·표현에 자신감",
        "세부·약속·정리에서 보완 여지",
      ],
      "sky",
    ),
    balanced: bucket(
      "balanced",
      "균형형",
      "에겐과 테토 성향이 고르게 섞인 균형형입니다.",
      [
        "상황에 따라 섬세함과 대담함을 전환",
        "스타일·관계·일 모두 유연하게 대응",
        "한쪽으로 치우칠 때 의식적 조율이 도움",
      ],
      "emerald",
    ),
  },
  scoring: {
    strategy: "pattern",
    dimensions: {
      egen: {
        label: "에겐",
        resultId: "egen",
        questionIds: [
          "q1", "q3", "q5", "q7", "q9", "q11", "q13", "q15", "q17", "q19", "q21", "q23",
        ],
      },
      teto: {
        label: "테토",
        resultId: "teto",
        questionIds: [
          "q2", "q4", "q6", "q8", "q10", "q12", "q14", "q16", "q18", "q20", "q22", "q24",
        ],
      },
    },
    balanced: { threshold: 12, resultId: "balanced" },
  },
};
