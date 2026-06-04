import type { TestResultBucket } from "../types";
import {
  getMbtiExtendedSummary,
  getMbtiReportSections,
} from "../reports/mbti-reports";
import { getQuickSummary } from "../reports/quick-summary";

const MBTI_TYPES = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
] as const;

const SUMMARIES: Record<string, { title: string; summary: string; details: string[] }> = {
  INTJ: {
    title: "INTJ — 전략가",
    summary: "큰 그림을 보고 체계적으로 목표를 설계하는 유형입니다.",
    details: [
      "독립적이며 원칙과 효율을 중시합니다.",
      "감정보다 논리와 장기 계획에 강점이 있습니다.",
      "혼자 집중할 시간이 필요할 때가 많습니다.",
    ],
  },
  INTP: {
    title: "INTP — 논리술사",
    summary: "아이디어와 이론을 탐구하며 본질을 파고드는 유형입니다.",
    details: [
      "호기심이 강하고 유연한 사고를 합니다.",
      "규칙보다 논리적 일관성을 우선할 수 있습니다.",
      "실행보다 분석·설계 단계에서 에너지를 얻습니다.",
    ],
  },
  ENTJ: {
    title: "ENTJ — 통솔자",
    summary: "목표 지향적이며 조직과 실행을 이끄는 유형입니다.",
    details: [
      "결단력 있고 리더십이 두드러집니다.",
      "효율과 성과를 중시합니다.",
      "비판을 성장의 재료로 삼는 편입니다.",
    ],
  },
  ENTP: {
    title: "ENTP — 변론가",
    summary: "새로운 가능성을 발견하고 도전하는 유형입니다.",
    details: [
      "창의적이며 토론과 아이디어 회의를 즐깁니다.",
      "루틴보다 변화와 실험에 에너지를 얻습니다.",
      "여러 아이디어를 동시에 다루는 편입니다.",
    ],
  },
  INFJ: {
    title: "INFJ — 옹호자",
    summary: "깊은 통찰과 가치관으로 사람을 이해하는 유형입니다.",
    details: [
      "이상과 현실 사이의 균형을 추구합니다.",
      "공감 능력이 높고 의미 있는 관계를 원합니다.",
      "혼자만의 시간으로 에너지를 회복합니다.",
    ],
  },
  INFP: {
    title: "INFP — 중재자",
    summary: "진정성과 가치에 따라 살아가는 이상주의 유형입니다.",
    details: [
      "창의적이고 감수성이 풍부합니다.",
      "자신만의 신념을 중요하게 여깁니다.",
      "압박보다 자율적 환경에서 잘합니다.",
    ],
  },
  ENFJ: {
    title: "ENFJ — 선도자",
    summary: "타인의 성장을 돕고 관계를 조율하는 유형입니다.",
    details: [
      "따뜻하고 설득력 있는 커뮤니케이션을 합니다.",
      "공동체의 조화를 중시합니다.",
      "타인의 필요를 먼저 챙기는 경향이 있습니다.",
    ],
  },
  ENFP: {
    title: "ENFP — 활동가",
    summary: "열정적이고 사람·가능성에 에너지를 얻는 유형입니다.",
    details: [
      "자유롭고 상상력이 풍부합니다.",
      "새로운 경험과 관계에서 동기가 생깁니다.",
      "루틴에 지루함을 느낄 수 있습니다.",
    ],
  },
  ISTJ: {
    title: "ISTJ — 현실주의자",
    summary: "책임감 있고 체계적으로 일을 완수하는 유형입니다.",
    details: [
      "신뢰와 일관성을 중시합니다.",
      "사실과 경험에 기반해 판단합니다.",
      "계획과 규칙을 지키는 편입니다.",
    ],
  },
  ISFJ: {
    title: "ISFJ — 수호자",
    summary: "세심하고 헌신적으로 주변을 돕는 유형입니다.",
    details: [
      "배려심이 깊고 실무적입니다.",
      "안정과 전통을 소중히 여깁니다.",
      "인정받을 때 동기가 높아집니다.",
    ],
  },
  ESTJ: {
    title: "ESTJ — 경영자",
    summary: "질서와 실행력으로 목표를 달성하는 유형입니다.",
    details: [
      "명확한 기준과 역할을 선호합니다.",
      "현실적이고 결과 중심입니다.",
      "조직화와 관리에 강점이 있습니다.",
    ],
  },
  ESFJ: {
    title: "ESFJ — 집정관",
    summary: "사람 중심으로 협력과 분위기를 만드는 유형입니다.",
    details: [
      "친절하고 사교적입니다.",
      "타인의 기대에 맞추려 노력합니다.",
      "공동체의 화합을 중시합니다.",
    ],
  },
  ISTP: {
    title: "ISTP — 장인",
    summary: "문제를 분석하고 손으로 해결하는 실용적 유형입니다.",
    details: [
      "침착하고 관찰력이 뛰어납니다.",
      "즉흥적 상황 대처에 강합니다.",
      "불필요한 감정 표현을 줄일 수 있습니다.",
    ],
  },
  ISFP: {
    title: "ISFP — 모험가",
    summary: "감각과 미학을 중시하는 온화한 유형입니다.",
    details: [
      "현재 순간을 즐기는 편입니다.",
      "개인적 가치와 자유를 중요하게 여깁니다.",
      "갈등을 피하고 조용히 자신만의 길을 갑니다.",
    ],
  },
  ESTP: {
    title: "ESTP — 사업가",
    summary: "현장에서 빠르게 판단하고 행동하는 유형입니다.",
    details: [
      "대담하고 현실 감각이 좋습니다.",
      "위기 상황에서 침착함을 유지합니다.",
      "지루한 이론보다 실전을 선호합니다.",
    ],
  },
  ESFP: {
    title: "ESFP — 연예인",
    summary: "밝고 즉흥적으로 분위기를 살리는 유형입니다.",
    details: [
      "사교적이고 표현력이 풍부합니다.",
      "경험과 즐거움을 중시합니다.",
      "계획보다 순간의 흐름을 따르는 편입니다.",
    ],
  },
};

const COLORS: TestResultBucket["color"][] = [
  "sky",
  "emerald",
  "amber",
  "rose",
  "zinc",
];

export function buildMbtiResults(): Record<string, TestResultBucket> {
  const results: Record<string, TestResultBucket> = {};
  MBTI_TYPES.forEach((code, i) => {
    const meta = SUMMARIES[code];
    const extended = getMbtiExtendedSummary(code);
    results[code] = {
      id: code,
      title: meta.title,
      summary: extended || meta.summary,
      details: meta.details,
      sections: getMbtiReportSections(code),
      quickSummary: getQuickSummary("mbti", code),
      color: COLORS[i % COLORS.length],
    };
  });
  return results;
}
