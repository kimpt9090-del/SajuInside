export type TestCategory = "psychology" | "fortune" | "types";

export type Likert5 = 1 | 2 | 3 | 4 | 5;

/** 강제선택(A/B) 응답 */
export type BinaryChoice = "a" | "b";

export type TestAnswer = Likert5 | BinaryChoice;

export type LikertChoice = {
  value: Likert5;
  label: string;
};

export type TestQuestion = {
  id: string;
  text: string;
  reverse?: boolean;
  weight?: number;
  /** 강제선택 2지선다 (공식 MBTI Form M 스타일) */
  binary?: {
    optionA: string;
    optionB: string;
    poleA: string;
    poleB: string;
  };
};

export type TestResultBucket = {
  id: string;
  title: string;
  summary: string;
  details: string[];
  /** 상세 다단락 리포트 */
  sections?: import("@/lib/report-types").ReportSection[];
  /** 30초 요약 (바쁜 사용자용) */
  quickSummary?: {
    oneLiner: string;
    bullets: string[];
    actionTip: string;
  };
  color: "emerald" | "sky" | "amber" | "rose" | "zinc";
};

export type ScoreStrategy = "sum" | "pattern" | "mbti";

export type SumScoreConfig = {
  strategy: "sum";
  /** likert: 5점 합산 · gad: 전 문항 0~3 환산 · phq: PHQ-9 핵심 문항만 0~3 환산 */
  sumMode?: "likert" | "gad" | "phq";
  /** phq 모드일 때만 합산할 문항 id (미지정 시 q1~q9) */
  phqQuestionIds?: string[];
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
  /** 상위 2차원 점수 차이가 threshold 이하면 해당 resultId */
  balanced?: { threshold: number; resultId: string };
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
  /** likert: 5점 척도(기본) · binary: A/B 강제선택 */
  questionFormat?: "likert" | "binary";
  questions: TestQuestion[];
  results: Record<string, TestResultBucket>;
  scoring: ScoringConfig;
};
