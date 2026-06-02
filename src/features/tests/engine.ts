import type {
  Likert5,
  MbtiScoreConfig,
  PatternScoreConfig,
  ScoringConfig,
  TestDefinition,
  TestQuestion,
} from "./types";

export type TestRun = {
  testId: string;
  version: number;
  answers: Record<string, Likert5>;
};

export type DimensionScore = {
  key: string;
  label: string;
  score: number;
  max: number;
  percent: number;
  resultId?: string;
};

export type AxisPairScore = {
  axisId: string;
  label: string;
  poleA: { key: string; label: string; percent: number; score: number };
  poleB: { key: string; label: string; percent: number; score: number };
  winnerKey: string;
};

export type ScoreReport = {
  rawSum: number;
  maxSum: number;
  byDimension?: DimensionScore[];
  byAxis?: AxisPairScore[];
  resultId: string;
  mbtiCode?: string;
};

function effectiveValue(q: TestQuestion, v: Likert5): number {
  const base = q.reverse ? 6 - v : v;
  return base * (q.weight ?? 1);
}

function scoreQuestions(
  questionById: Map<string, TestQuestion>,
  answers: Record<string, Likert5>,
  questionIds: string[],
  questionWeights?: Record<string, number>,
): { score: number; max: number } {
  let score = 0;
  let max = 0;
  for (const qid of questionIds) {
    const q = questionById.get(qid);
    if (!q) continue;
    const w = questionWeights?.[qid] ?? 1;
    const v = answers[qid] ?? 3;
    score += effectiveValue(q, v) * w;
    max += 5 * (q.weight ?? 1) * w;
  }
  return { score, max };
}

function computePattern(
  test: TestDefinition,
  scoring: PatternScoreConfig,
  questionById: Map<string, TestQuestion>,
  answers: Record<string, Likert5>,
  rawSum: number,
  maxSum: number,
): ScoreReport {
  const dims = Object.entries(scoring.dimensions).map(([key, d]) => {
    const { score, max } = scoreQuestions(
      questionById,
      answers,
      d.questionIds,
      d.questionWeights,
    );
    const percent = max > 0 ? Math.round((score / max) * 100) : 0;
    return {
      key,
      label: d.label,
      score,
      max,
      percent,
      resultId: d.resultId,
    };
  });

  dims.sort((a, b) => b.percent - a.percent);
  return {
    rawSum,
    maxSum,
    byDimension: dims,
    resultId: dims[0]?.resultId ?? Object.values(test.results)[0]?.id ?? "",
  };
}

function poleContribution(
  q: TestQuestion | undefined,
  v: Likert5,
  reverse?: boolean,
  weight = 1,
): number {
  if (!q) return 0;
  const base = reverse ? 6 - v : v;
  return base * (q.weight ?? 1) * weight;
}

function computeMbti(
  test: TestDefinition,
  scoring: MbtiScoreConfig,
  questionById: Map<string, TestQuestion>,
  answers: Record<string, Likert5>,
  rawSum: number,
  maxSum: number,
): ScoreReport {
  const winners: string[] = [];
  const byAxis: AxisPairScore[] = [];

  for (const axis of scoring.axes) {
    let scoreA = 0;
    let scoreB = 0;

    for (const [qid, cfg] of Object.entries(axis.questions)) {
      const q = questionById.get(qid);
      const v = answers[qid] ?? 3;
      const w = cfg.weight ?? 1;
      const contrib = poleContribution(q, v, cfg.reverse, w);

      if (cfg.pole === axis.poleA.key) {
        scoreA += contrib;
      } else if (cfg.pole === axis.poleB.key) {
        scoreB += contrib;
      }
    }

    const total = scoreA + scoreB || 1;
    const percentA = Math.round((scoreA / total) * 100);
    const percentB = 100 - percentA;
    const winnerKey = scoreA >= scoreB ? axis.poleA.key : axis.poleB.key;
    winners.push(winnerKey);

    byAxis.push({
      axisId: axis.id,
      label: `${axis.poleA.label} vs ${axis.poleB.label}`,
      poleA: {
        key: axis.poleA.key,
        label: axis.poleA.label,
        percent: percentA,
        score: scoreA,
      },
      poleB: {
        key: axis.poleB.key,
        label: axis.poleB.label,
        percent: percentB,
        score: scoreB,
      },
      winnerKey,
    });
  }

  const mbtiCode = winners.join("");
  const resultId =
    test.results[mbtiCode] ? mbtiCode : mbtiCode.toLowerCase();

  return {
    rawSum,
    maxSum,
    byAxis,
    mbtiCode,
    resultId: test.results[resultId] ? resultId : mbtiCode,
  };
}

export function computeScore(test: TestDefinition, run: TestRun): ScoreReport {
  const questionById = new Map(test.questions.map((q) => [q.id, q]));
  const values = test.questions.map((q) => {
    const v = run.answers[q.id] ?? 3;
    return effectiveValue(q, v);
  });
  const rawSum = values.reduce((a, b) => a + b, 0);
  const maxSum = test.questions.reduce(
    (acc, q) => acc + 5 * (q.weight ?? 1),
    0,
  );

  const scoring: ScoringConfig = test.scoring;

  if (scoring.strategy === "sum") {
    const bucket =
      scoring.buckets.find((b) => rawSum >= b.min && rawSum <= b.max) ??
      scoring.buckets[scoring.buckets.length - 1];
    return { rawSum, maxSum, resultId: bucket.resultId };
  }

  if (scoring.strategy === "mbti") {
    return computeMbti(test, scoring, questionById, run.answers, rawSum, maxSum);
  }

  return computePattern(
    test,
    scoring,
    questionById,
    run.answers,
    rawSum,
    maxSum,
  );
}
