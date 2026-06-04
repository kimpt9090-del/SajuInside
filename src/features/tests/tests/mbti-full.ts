import type { TestDefinition } from "../types";
import { buildMbtiResults } from "./mbti-helpers";
import { MBTI_FULL_AXES, MBTI_FULL_QUESTIONS } from "./mbti-full-questions";

export const mbtiFullTest: TestDefinition = {
  id: "mbti-full",
  category: "types",
  title: "MBTI 정밀 검사 (공식급)",
  description:
    "93문항 · Form M 수준 · 4축 정밀 분석. 16유형 상세 리포트 + 16×16 궁합 매트릭스.",
  version: 1,
  questions: MBTI_FULL_QUESTIONS,
  results: buildMbtiResults(),
  scoring: {
    strategy: "mbti",
    axes: [...MBTI_FULL_AXES],
  },
};
