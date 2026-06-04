import type { TestDefinition } from "../types";
import { buildMbtiResults } from "./mbti-helpers";
import {
  MBTI_SIMPLE_AXES,
  MBTI_SIMPLE_QUESTIONS,
} from "./mbti-simple-questions";

export const mbtiTest: TestDefinition = {
  id: "mbti",
  category: "types",
  title: "MBTI 간단 검사",
  description:
    "24문항 · 약 5분 · E/I·S/N·T/F·J/P 4축 분석. 16유형 리포트 + 16×16 궁합 매트릭스.",
  version: 3,
  questions: MBTI_SIMPLE_QUESTIONS,
  results: buildMbtiResults(),
  scoring: {
    strategy: "mbti",
    axes: [...MBTI_SIMPLE_AXES],
  },
};
