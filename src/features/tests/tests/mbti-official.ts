import type { TestDefinition } from "../types";
import { buildMbtiResults } from "./mbti-helpers";
import { MBTI_FORCED_QUESTIONS } from "./mbti-forced-questions";

export const mbtiOfficialTest: TestDefinition = {
  id: "mbti-official",
  category: "types",
  title: "MBTI 공식형 강제선택",
  description:
    "93문항 · A/B 강제선택(Form M) · 4축 분석. 16유형 상세 리포트 + 16×16 궁합 매트릭스.",
  version: 1,
  questionFormat: "binary",
  questions: MBTI_FORCED_QUESTIONS,
  results: buildMbtiResults(),
  scoring: {
    strategy: "mbti",
    axes: [],
  },
};
