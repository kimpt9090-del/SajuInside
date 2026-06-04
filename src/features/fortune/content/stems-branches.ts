export type Element = "목" | "화" | "토" | "금" | "수";

export type StemMeta = {
  ko: string;
  hanja: string;
  reading: string;
  element: Element;
  yinYang: "양" | "음";
  meaning: string;
};

export type BranchMeta = {
  ko: string;
  hanja: string;
  reading: string;
  element: Element;
  animal: string;
  meaning: string;
};

export const STEMS: StemMeta[] = [
  { ko: "갑", hanja: "甲", reading: "갑", element: "목", yinYang: "양", meaning: "큰 나무·새싹 — 시작·성장·리더십" },
  { ko: "을", hanja: "乙", reading: "을", element: "목", yinYang: "음", meaning: "풀·덩굴 — 유연·적응·섬세함" },
  { ko: "병", hanja: "丙", reading: "병", element: "화", yinYang: "양", meaning: "태양 — 열정·밝음·대외 활동" },
  { ko: "정", hanja: "丁", reading: "정", element: "화", yinYang: "음", meaning: "촛불·등불 — 따뜻함·집중·섬세한 열정" },
  { ko: "무", hanja: "戊", reading: "무", element: "토", yinYang: "양", meaning: "큰 산·땅 — 안정·신뢰·중심" },
  { ko: "기", hanja: "己", reading: "기", element: "토", yinYang: "음", meaning: "밭·흙 — 돌봄·실무·양육" },
  { ko: "경", hanja: "庚", reading: "경", element: "금", yinYang: "양", meaning: "쇠·칼 — 결단·실행·개혁" },
  { ko: "신", hanja: "辛", reading: "신", element: "금", yinYang: "음", meaning: "보석·바늘 — 정밀·품격·예리함" },
  { ko: "임", hanja: "壬", reading: "임", element: "수", yinYang: "양", meaning: "큰 물·바다 — 지혜·유연·확장" },
  { ko: "계", hanja: "癸", reading: "계", element: "수", yinYang: "음", meaning: "이슬·비 — 직관·감수성·내면" },
];

export const BRANCHES: BranchMeta[] = [
  { ko: "자", hanja: "子", reading: "자", element: "수", animal: "쥐", meaning: "자정·겨울 시작 — 지혜·잠재력·새 출발" },
  { ko: "축", hanja: "丑", reading: "축", element: "토", animal: "소", meaning: "한겨울·축적 — 인내·저장·꾸준함" },
  { ko: "인", hanja: "寅", reading: "인", element: "목", animal: "호랑이", meaning: "봄 시작·새벽 — 용기·추진·개척" },
  { ko: "묘", hanja: "卯", reading: "묘", element: "목", animal: "토끼", meaning: "봄·성장 — 온화·예술·관계" },
  { ko: "진", hanja: "辰", reading: "진", element: "토", animal: "용", meaning: "봄→여름 — 변화·재정비·잠재력" },
  { ko: "사", hanja: "巳", reading: "사", element: "화", animal: "뱀", meaning: "초여름 — 열정·지혜·표현" },
  { ko: "오", hanja: "午", reading: "오", element: "화", animal: "말", meaning: "한여름·정오 — 활동·명예·에너지" },
  { ko: "미", hanja: "未", reading: "미", element: "토", animal: "양", meaning: "늦여름 — 돌봄·실무·가정" },
  { ko: "신", hanja: "申", reading: "신", element: "금", animal: "원숭이", meaning: "가을 시작 — 기민·결단·변화" },
  { ko: "유", hanja: "酉", reading: "유", element: "금", animal: "닭", meaning: "가을·수확 — 정밀·완성·품격" },
  { ko: "술", hanja: "戌", reading: "술", element: "토", animal: "개", meaning: "늦가을 — 충성·수호·마무리" },
  { ko: "해", hanja: "亥", reading: "해", element: "수", animal: "돼지", meaning: "겨울 전·저녁 — 직관·여유·마무리" },
];

const stemMap = new Map(STEMS.map((s) => [s.ko, s]));
const branchMap = new Map(BRANCHES.map((b) => [b.ko, b]));

export function getStemMeta(ko: string): StemMeta | undefined {
  return stemMap.get(ko);
}

export function getBranchMeta(ko: string): BranchMeta | undefined {
  return branchMap.get(ko);
}

export function formatStemLabel(ko: string, hanja: string): string {
  const m = getStemMeta(ko);
  if (!m) return `${ko}(${hanja})`;
  return `${ko}(${hanja}) · ${m.element}(${m.yinYang}) — ${m.meaning}`;
}

export function formatBranchLabel(ko: string, hanja: string): string {
  const m = getBranchMeta(ko);
  if (!m) return `${ko}(${hanja})`;
  return `${ko}(${hanja}) · ${m.animal}띠 · ${m.element} — ${m.meaning}`;
}

/** 지지 충(冲) — 서로 마주보는 지지 */
export const BRANCH_CLASH: Record<string, string> = {
  자: "오", 오: "자",
  축: "미", 미: "축",
  인: "신", 신: "인",
  묘: "유", 유: "묘",
  진: "술", 술: "진",
  사: "해", 해: "사",
};

/** 지지 합(合) — 육합 */
export const BRANCH_HARMONY: Record<string, string> = {
  자: "축", 축: "자",
  인: "해", 해: "인",
  묘: "술", 술: "묘",
  진: "유", 유: "진",
  사: "신", 신: "사",
  오: "미", 미: "오",
};

/** 오행 상생: A가 B를 생함 */
export const ELEMENT_GENERATES: Record<Element, Element> = {
  목: "화", 화: "토", 토: "금", 금: "수", 수: "목",
};

/** 오행 상극 */
export const ELEMENT_CONTROLS: Record<Element, Element> = {
  목: "토", 토: "수", 수: "화", 화: "금", 금: "목",
};
