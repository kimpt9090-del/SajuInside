/** 천간·지지 → 오행(목화토금수) */
const STEM_ELEMENT: Record<string, "목" | "화" | "토" | "금" | "수"> = {
  갑: "목",
  을: "목",
  병: "화",
  정: "화",
  무: "토",
  기: "토",
  경: "금",
  신: "금",
  임: "수",
  계: "수",
};

const BRANCH_ELEMENT: Record<string, "목" | "화" | "토" | "금" | "수"> = {
  자: "수",
  축: "토",
  인: "목",
  묘: "목",
  진: "토",
  사: "화",
  오: "화",
  미: "토",
  신: "금",
  유: "금",
  술: "토",
  해: "수",
};

export type ElementCounts = Record<"목" | "화" | "토" | "금" | "수", number>;

export function countElements(
  stems: string[],
  branches: string[],
): ElementCounts {
  const counts: ElementCounts = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  for (const s of stems) {
    const e = STEM_ELEMENT[s];
    if (e) counts[e]++;
  }
  for (const b of branches) {
    const e = BRANCH_ELEMENT[b];
    if (e) counts[e]++;
  }
  return counts;
}

export function getStemElement(stem: string): "목" | "화" | "토" | "금" | "수" | null {
  return STEM_ELEMENT[stem] ?? null;
}

export function describeElementBalance(counts: ElementCounts): string[] {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const entries = (Object.entries(counts) as [keyof ElementCounts, number][])
    .map(([k, v]) => ({ element: k, count: v, pct: Math.round((v / total) * 100) }))
    .sort((a, b) => b.count - a.count);

  const dominant = entries[0];
  const lacking = entries.filter((e) => e.count === 0).map((e) => e.element);

  const paragraphs: string[] = [
    `팔자 전체 오행 분포는 목 ${counts.목}·화 ${counts.화}·토 ${counts.토}·금 ${counts.금}·수 ${counts.수} (총 ${total}기)입니다. ${dominant.element}(${dominant.pct}%) 기운이 가장 두드러집니다.`,
  ];

  const elementDesc: Record<keyof ElementCounts, string> = {
    목: "목(木)은 성장·창의·인내를 상징합니다. 목 기운이 강하면 추진력과 새로운 시작에 유리합니다.",
    화: "화(火)는 열정·표현·명예를 상징합니다. 화 기운이 강하면 대외 활동·인지도 상승에 유리합니다.",
    토: "토(土)는 안정·신뢰·재물을 상징합니다. 토 기운이 강하면 중심을 잡고 재물을 모으는 데 유리합니다.",
    금: "금(金)은 결단·원칙·정리를 상징합니다. 금 기운이 강하면 실행·성과·정리에 유리합니다.",
    수: "수(水)는 지혜·유연·소통을 상징합니다. 수 기운이 강하면 전략·적응·학습에 유리합니다.",
  };

  paragraphs.push(elementDesc[dominant.element]);

  if (lacking.length > 0) {
    paragraphs.push(
      `${lacking.join("·")} 기운이 상대적으로 약합니다. 일상에서 해당 오행을 보완하면 균형이 좋아집니다. 예: 목 부족→산책·녹색, 화 부족→운동·햇빛, 토 부족→규칙적 식사, 금 부족→정리·계획, 수 부족→수분·휴식.`,
    );
  }

  return paragraphs;
}
