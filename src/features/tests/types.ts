export type TestCategory = "psychology" | "fortune" | "types";

export type Likert5 = 1 | 2 | 3 | 4 | 5;

export type LikertChoice = {
  value: Likert5;
  label: string;
};

export type TestQuestion = {
  id: string;
  text: string;
  reverse?: boolean;
  weight?: number;
};

export type TestResultBucket = {
  id: string;
  title: string;
  summary: string;
  details: string[];
  /** 상세 다단락 리포트 (신한라이프 스타일) */
  sections?: import("@/lib/report-types").ReportSection[];
  color: "emerald" | "sky" | "amber" | "rose" | "zinc";
};

export type ScoreStrategy = "sum" | "pattern" | "mbti";

export type SumScoreConfig = {
  strategy: "sum";
  buckets: Array<{
    min: number;
    max: number;
    resultId: string;
  }>;
};

/** 단일 차원(안정/불안 등) — 가장 높은 비율의 resultId 선택 */
export type PatternDimensionConfig = {
  label: string;
  questionIds: string[];
  resultId: string;
  /** 문항별 가중치 (미지정 시 1) */
  questionWeights?: Record<string, number>;
};

export type PatternScoreConfig = {
  strategy: "pattern";
  dimensions: Record<string, PatternDimensionConfig>;
};

/** MBTI 4축 (E/I, S/N, T/F, J/P) — 축별 대립 극 점수 합산 */
export type MbtiQuestionWeight = {
  pole: string;
  weight?: number;
  reverse?: boolean;
};

export type MbtiAxisConfig = {
  id: string;
  poleA: { key: string; label: string };
  poleB: { key: string; label: string };
  questions: Record<string, MbtiQuestionWeight>;
};

export type MbtiScoreConfig = {
  strategy: "mbti";
  axes: MbtiAxisConfig[];
};

export type ScoringConfig =
  | SumScoreConfig
  | PatternScoreConfig
  | MbtiScoreConfig;

export type TestDefinition = {
  id: string;
  category: TestCategory;
  title: string;
  description: string;
  version: number;
  questions: TestQuestion[];
  results: Record<string, TestResultBucket>;
  scoring: ScoringConfig;
};
