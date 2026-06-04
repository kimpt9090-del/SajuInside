/** MBTI 16유형 궁합 매트릭스 — 점수·등급·한 줄 팁 */

export const MBTI_TYPES = [
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

export type MbtiType = (typeof MBTI_TYPES)[number];

export type CompatibilityTier =
  | "excellent"
  | "good"
  | "average"
  | "challenging";

export type CompatibilityResult = {
  score: number;
  tier: CompatibilityTier;
  label: string;
  tip: string;
};

export const TIER_LABELS: Record<CompatibilityTier, string> = {
  excellent: "천생연분",
  good: "좋은 궁합",
  average: "노력형",
  challenging: "주의 필요",
};

/** 유명한 골든 페어 보너스 (양방향) */
const GOLDEN_BONUS: Record<string, number> = {
  "INTJ-ENFP": 12,
  "INTP-ENTJ": 10,
  "ENTJ-INTP": 10,
  "ENTP-INFJ": 12,
  "INFJ-ENTP": 12,
  "INFP-ENFJ": 10,
  "ENFJ-INFP": 10,
  "ENFP-INTJ": 12,
  "ISTJ-ESFP": 8,
  "ISFJ-ESTP": 8,
  "ESTJ-ISFP": 8,
  "ESFJ-ISTP": 8,
  "ISTP-ESFJ": 8,
  "ISFP-ESTJ": 8,
  "ESTP-ISFJ": 8,
  "ESFP-ISTJ": 8,
};

const TIER_TIPS: Record<CompatibilityTier, string> = {
  excellent:
    "서로의 강점을 자연스럽게 보완합니다. 차이를 '번역'하면 시너지가 큽니다.",
  good: "공통점과 차이가 균형 잡혀 있습니다. 소통 방식만 맞추면 안정적입니다.",
  average:
    "충분히 좋은 관계가 가능합니다. E/I·J/P 차이를 미리 합의하세요.",
  challenging:
    "갈등 포인트가 분명할 수 있습니다. 상대 축(E/I·S/N·T/F·J/P)을 이해하는 것이 핵심입니다.",
};

function pairKey(a: string, b: string): string {
  return `${a}-${b}`;
}

function scoreToTier(score: number): CompatibilityTier {
  if (score >= 88) return "excellent";
  if (score >= 75) return "good";
  if (score >= 60) return "average";
  return "challenging";
}

/** 두 유형 간 궁합 점수 (35–98) */
export function getMbtiCompatibility(
  typeA: string,
  typeB: string,
): CompatibilityResult {
  if (typeA === typeB) {
    return {
      score: 82,
      tier: "good",
      label: TIER_LABELS.good,
      tip: "같은 유형은 공감대가 크지만, 약점도 겹칠 수 있어요. 서로 다른 강점을 의식하세요.",
    };
  }

  let score = 48;
  for (let i = 0; i < 4; i++) {
    if (typeA[i] === typeB[i]) {
      score += 9;
    } else {
      // 보완 축 보너스 (E/I·T/F·J/P 보완이 관계에서 자주 시너지)
      if (i === 0) score += 7;
      if (i === 1) score += 4;
      if (i === 2) score += 8;
      if (i === 3) score += 10;
    }
  }

  const bonus =
    GOLDEN_BONUS[pairKey(typeA, typeB)] ??
    GOLDEN_BONUS[pairKey(typeB, typeA)] ??
    0;
  score = Math.min(98, Math.max(35, score + bonus));

  const tier = scoreToTier(score);
  return {
    score,
    tier,
    label: TIER_LABELS[tier],
    tip: TIER_TIPS[tier],
  };
}

/** 16×16 매트릭스 (대칭) */
export function buildCompatibilityMatrix(): Record<
  string,
  Record<string, CompatibilityResult>
> {
  const matrix: Record<string, Record<string, CompatibilityResult>> = {};
  for (const a of MBTI_TYPES) {
    matrix[a] = {};
    for (const b of MBTI_TYPES) {
      matrix[a][b] = getMbtiCompatibility(a, b);
    }
  }
  return matrix;
}

/** 내 유형 기준 궁합 순위 */
export function getCompatibilityRanking(myType: string) {
  return MBTI_TYPES.map((other) => ({
    type: other,
    ...getMbtiCompatibility(myType, other),
  })).sort((a, b) => b.score - a.score);
}

export function tierColorClass(tier: CompatibilityTier): string {
  switch (tier) {
    case "excellent":
      return "bg-emerald-500";
    case "good":
      return "bg-sky-400";
    case "average":
      return "bg-amber-400";
    case "challenging":
      return "bg-rose-400";
  }
}

export function tierBgClass(tier: CompatibilityTier): string {
  switch (tier) {
    case "excellent":
      return "bg-emerald-50 text-emerald-900 border-emerald-200";
    case "good":
      return "bg-sky-50 text-sky-900 border-sky-200";
    case "average":
      return "bg-amber-50 text-amber-900 border-amber-200";
    case "challenging":
      return "bg-rose-50 text-rose-900 border-rose-200";
  }
}
