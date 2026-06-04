import type {
  BinaryChoice,
  Likert5,
  MbtiScoreConfig,
  PatternScoreConfig,
  ScoringConfig,
  TestAnswer,
  TestDefinition,
  TestQuestion,
} from "./types";

export type TestRun = {
  testId: string;
  version: number;
  answers: Record<string, TestAnswer>;
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

const POLE_LABELS: Record<string, string> = {
  E: "외향(E)",
  I: "내향(I)",
  S: "감각(S)",
  N: "직관(N)",
  T: "사고(T)",
  F: "감정(F)",
  J: "판단(J)",
  P: "인식(P)",
};

const AXIS_BY_POLE: Record<string, string> = {
  E: "ei",
  I: "ei",
  S: "sn",
  N: "sn",
  T: "tf",
  F: "tf",
  J: "jp",
  P: "jp",
};

function isBinaryTest(test: TestDefinition): boolean {
  return (
    test.questionFormat === "binary" ||
    test.questions.some((q) => q.binary != null)
  );
}

function effectiveValue(q: TestQuestion, v: Likert5): number {
  const base = q.reverse ? 6 - v : v;
  return base * (q.weight ?? 1);
}

/** GAD-7/PHQ 스타일: 5점 척도 → 0~3점 환산 */
function gadItemScore(q: TestQuestion, v: Likert5): number {
  const adjusted = q.reverse ? 6 - v : v;
  return Math.min(3, Math.max(0, adjusted - 1));
}

function scoreSumLikert(
  test: TestDefinition,
  questionById: Map<string, TestQuestion>,
  answers: Record<string, TestAnswer>,
): { rawSum: number; maxSum: number } {
  const values = test.questions.map((q) => {
    const raw = answers[q.id];
    const v = typeof raw === "number" ? raw : 3;
    return effectiveValue(q, v);
  });
  const rawSum = values.reduce((a, b) => a + b, 0);
  const maxSum = test.questions.reduce(
    (acc, q) => acc + 5 * (q.weight ?? 1),
    0,
  );
  return { rawSum, maxSum };
}

function scoreSumGad(
  test: TestDefinition,
  answers: Record<string, TestAnswer>,
): { rawSum: number; maxSum: number } {
  let rawSum = 0;
  for (const q of test.questions) {
    const raw = answers[q.id];
    const v = typeof raw === "number" ? raw : 3;
    rawSum += gadItemScore(q, v);
  }
  const maxSum = test.questions.length * 3;
  return { rawSum, maxSum };
}

const DEFAULT_PHQ_IDS = [
  "q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9",
];

function scoreSumPhq(
  test: TestDefinition,
  answers: Record<string, TestAnswer>,
  questionIds: string[],
): { rawSum: number; maxSum: number } {
  const questionById = new Map(test.questions.map((q) => [q.id, q]));
  let rawSum = 0;
  for (const qid of questionIds) {
    const q = questionById.get(qid);
    if (!q) continue;
    const raw = answers[qid];
    const v = typeof raw === "number" ? raw : 3;
    rawSum += gadItemScore(q, v);
  }
  return { rawSum, maxSum: questionIds.length * 3 };
}

function scoreQuestions(
  questionById: Map<string, TestQuestion>,
  answers: Record<string, TestAnswer>,
  questionIds: string[],
  questionWeights?: Record<string, number>,
): { score: number; max: number } {
  let score = 0;
  let max = 0;
  for (const qid of questionIds) {
    const q = questionById.get(qid);
    if (!q) continue;
    const w = questionWeights?.[qid] ?? 1;
    const raw = answers[qid];
    const v = typeof raw === "number" ? raw : 3;
    score += effectiveValue(q, v as Likert5) * w;
    max += 5 * (q.weight ?? 1) * w;
  }
  return { score, max };
}

function computePattern(
  test: TestDefinition,
  scoring: PatternScoreConfig,
  questionById: Map<string, TestQuestion>,
  answers: Record<string, TestAnswer>,
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

  let resultId = dims[0]?.resultId ?? Object.values(test.results)[0]?.id ?? "";
  if (
    scoring.balanced &&
    dims.length >= 2 &&
    Math.abs(dims[0].percent - dims[1].percent) <= scoring.balanced.threshold
  ) {
    resultId = scoring.balanced.resultId;
  }

  return {
    rawSum,
    maxSum,
    byDimension: dims,
    resultId,
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

function computeMbtiLikert(
  test: TestDefinition,
  scoring: MbtiScoreConfig,
  questionById: Map<string, TestQuestion>,
  answers: Record<string, TestAnswer>,
  rawSum: number,
  maxSum: number,
): ScoreReport {
  const likertAnswers = answers as Record<string, Likert5>;
  const winners: string[] = [];
  const byAxis: AxisPairScore[] = [];

  for (const axis of scoring.axes) {
    let scoreA = 0;
    let scoreB = 0;

    for (const [qid, cfg] of Object.entries(axis.questions)) {
      const q = questionById.get(qid);
      const raw = likertAnswers[qid];
      const v = typeof raw === "number" ? raw : 3;
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

function computeMbtiBinary(
  test: TestDefinition,
  answers: Record<string, TestAnswer>,
  rawSum: number,
  maxSum: number,
): ScoreReport {
  const tallies = new Map<
    string,
    { poleA: string; poleB: string; scoreA: number; scoreB: number }
  >();

  for (const q of test.questions) {
    if (!q.binary) continue;
    const axisId = AXIS_BY_POLE[q.binary.poleA];
    if (!axisId) continue;

    let row = tallies.get(axisId);
    if (!row) {
      row = {
        poleA: q.binary.poleA,
        poleB: q.binary.poleB,
        scoreA: 0,
        scoreB: 0,
      };
      tallies.set(axisId, row);
    }

    const ans = answers[q.id] as BinaryChoice | undefined;
    if (ans === "a") row.scoreA += 1;
    else if (ans === "b") row.scoreB += 1;
  }

  const axisOrder = ["ei", "sn", "tf", "jp"];
  const winners: string[] = [];
  const byAxis: AxisPairScore[] = [];

  for (const axisId of axisOrder) {
    const row = tallies.get(axisId);
    if (!row) continue;

    const total = row.scoreA + row.scoreB || 1;
    const percentA = Math.round((row.scoreA / total) * 100);
    const percentB = 100 - percentA;
    const winnerKey = row.scoreA >= row.scoreB ? row.poleA : row.poleB;
    winners.push(winnerKey);

    byAxis.push({
      axisId,
      label: `${POLE_LABELS[row.poleA]} vs ${POLE_LABELS[row.poleB]}`,
      poleA: {
        key: row.poleA,
        label: POLE_LABELS[row.poleA],
        percent: percentA,
        score: row.scoreA,
      },
      poleB: {
        key: row.poleB,
        label: POLE_LABELS[row.poleB],
        percent: percentB,
        score: row.scoreB,
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
  const binary = isBinaryTest(test);

  let rawSum = 0;
  let maxSum = 0;

  if (binary) {
    for (const q of test.questions) {
      const ans = run.answers[q.id];
      if (ans === "a" || ans === "b") rawSum += 1;
      maxSum += 1;
    }
  } else {
    const scoring = test.scoring;
    if (scoring.strategy === "sum" && scoring.sumMode === "gad") {
      ({ rawSum, maxSum } = scoreSumGad(test, run.answers));
    } else if (scoring.strategy === "sum" && scoring.sumMode === "phq") {
      const ids = scoring.phqQuestionIds ?? DEFAULT_PHQ_IDS;
      ({ rawSum, maxSum } = scoreSumPhq(test, run.answers, ids));
    } else {
      ({ rawSum, maxSum } = scoreSumLikert(test, questionById, run.answers));
    }
  }

  const scoring: ScoringConfig = test.scoring;

  if (scoring.strategy === "sum") {
    const bucket =
      scoring.buckets.find((b) => rawSum >= b.min && rawSum <= b.max) ??
      scoring.buckets[scoring.buckets.length - 1];
    return { rawSum, maxSum, resultId: bucket.resultId };
  }

  if (scoring.strategy === "mbti") {
    if (binary) {
      return computeMbtiBinary(test, run.answers, rawSum, maxSum);
    }
    return computeMbtiLikert(
      test,
      scoring,
      questionById,
      run.answers,
      rawSum,
      maxSum,
    );
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
