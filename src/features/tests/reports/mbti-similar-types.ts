import { MBTI_TYPES } from "./mbti-compatibility";

/** MBTI 유사 유형 (글자 일치 + 경계 축 반영) */
export function getMbtiSimilarTypes(
  code: string,
  axes?: { winnerKey: string; poleA: { key: string; percent: number }; poleB: { key: string; percent: number } }[],
): { type: string; similarity: number; reason: string }[] {
  const upper = code.toUpperCase();
  const borderline = new Set<string>();
  if (axes) {
    for (const ax of axes) {
      const diff = Math.abs(ax.poleA.percent - ax.poleB.percent);
      if (diff < 12) {
        borderline.add(ax.poleA.key);
        borderline.add(ax.poleB.key);
      }
    }
  }

  return MBTI_TYPES.filter((t) => t !== upper)
    .map((t) => {
      let match = 0;
      for (let i = 0; i < 4; i++) {
        if (t[i] === upper[i]) match += 25;
      }
      let reason = `${match}% 글자 일치`;
      if (borderline.size && match >= 50) {
        const flipped = upper
          .split("")
          .map((c, i) => {
            const other = t[i];
            return other !== c && borderline.has(c) ? other : c;
          })
          .join("");
        if (flipped === t) reason = "경계 축에서 가까운 유형";
      }
      return { type: t, similarity: match, reason };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);
}
