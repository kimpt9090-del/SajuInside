import type { ReportSection } from "@/lib/report-types";
import {
  BRANCH_CLASH,
  BRANCH_HARMONY,
  ELEMENT_CONTROLS,
  ELEMENT_GENERATES,
  formatBranchLabel,
  formatStemLabel,
  getBranchMeta,
  getStemMeta,
  type Element,
} from "./stems-branches";
import type { SajuResult } from "../types";
import { countElements } from "./elements";

function elementRelation(a: Element, b: Element): string {
  if (a === b) return "같은 오행 — 서로 이해가 빠르지만, 부족한 기운이 함께 부족할 수 있습니다.";
  if (ELEMENT_GENERATES[a] === b) return `${a}→${b} 상생(生) — 한쪽이 다른 쪽을 키워주는 조화로운 관계입니다.`;
  if (ELEMENT_GENERATES[b] === a) return `${b}→${a} 상생(生) — 서로 보완하며 성장하는 관계입니다.`;
  if (ELEMENT_CONTROLS[a] === b) return `${a}→${b} 상극(剋) — 긴장·충돌이 있을 수 있으나, 서로를 단련시키기도 합니다.`;
  if (ELEMENT_CONTROLS[b] === a) return `${b}→${a} 상극(剋) — 갈등·조율이 필요하지만, 균형을 맞추면 시너지가 납니다.`;
  return "오행 관계가 중립적입니다. 소통과 존중이 핵심입니다.";
}

function branchRelation(a: string, b: string): string {
  if (BRANCH_CLASH[a] === b) {
    return `${a}(${getBranchMeta(a)?.hanja})↔${b}(${getBranchMeta(b)?.hanja}) 충(冲) — 에너지가 강하게 부딪칩니다. 갈등 시 '시간 두기'가 중요합니다.`;
  }
  if (BRANCH_HARMONY[a] === b) {
    return `${a}↔${b} 합(合) — 자연스럽게 끌리는 육합 관계입니다.`;
  }
  return "지지 충·합이 뚜렷하지 않아, 성격·가치관 조율이 관계의 핵심입니다.";
}

function scoreCompatibility(male: SajuResult, female: SajuResult): number {
  let score = 70;
  const mDay = male.pillars.day;
  const fDay = female.pillars.day;
  const mEl = getStemMeta(mDay.stem)?.element ?? "토";
  const fEl = getStemMeta(fDay.stem)?.element ?? "토";

  if (ELEMENT_GENERATES[mEl] === fEl || ELEMENT_GENERATES[fEl] === mEl) score += 12;
  if (mEl === fEl) score += 5;
  if (ELEMENT_CONTROLS[mEl] === fEl || ELEMENT_CONTROLS[fEl] === mEl) score -= 8;

  if (BRANCH_HARMONY[mDay.branch] === fDay.branch) score += 10;
  if (BRANCH_CLASH[mDay.branch] === fDay.branch) score -= 12;

  const mCounts = countElements(
    [male.pillars.year.stem, male.pillars.month.stem, male.pillars.day.stem, male.pillars.hour.stem],
    [male.pillars.year.branch, male.pillars.month.branch, male.pillars.day.branch, male.pillars.hour.branch],
  );
  const fCounts = countElements(
    [female.pillars.year.stem, female.pillars.month.stem, female.pillars.day.stem, female.pillars.hour.stem],
    [female.pillars.year.branch, female.pillars.month.branch, female.pillars.day.branch, female.pillars.hour.branch],
  );
  const elements: Element[] = ["목", "화", "토", "금", "수"];
  for (const e of elements) {
    if (mCounts[e] === 0 && fCounts[e] >= 2) score += 2;
    if (fCounts[e] === 0 && mCounts[e] >= 2) score += 2;
  }

  return Math.min(98, Math.max(42, score));
}

function gradeFromScore(score: number): string {
  if (score >= 90) return "천생연분";
  if (score >= 80) return "좋은 궁합";
  if (score >= 70) return "보통 이상";
  if (score >= 60) return "노력형 궁합";
  return "주의·소통 필수";
}

export function buildCompatibilitySections(
  male: SajuResult,
  female: SajuResult,
  score: number,
): ReportSection[] {
  const mDay = male.pillars.day;
  const fDay = female.pillars.day;
  const mEl = getStemMeta(mDay.stem)?.element ?? "토";
  const fEl = getStemMeta(fDay.stem)?.element ?? "토";
  const grade = gradeFromScore(score);

  return [
    {
      id: "compat-overview",
      title: "궁합 종합",
      subtitle: `남 ${mDay.stemHanja}${mDay.branchHanja} × 여 ${fDay.stemHanja}${fDay.branchHanja}`,
      highlight: `궁합 점수 ${score}점 · ${grade}`,
      paragraphs: [
        "남녀 일주(日柱)를 중심으로 오행·지지 관계를 분석한 결과입니다.",
        elementRelation(mEl, fEl),
        branchRelation(mDay.branch, fDay.branch),
      ],
      tags: ["#궁합", "#종합"],
    },
    {
      id: "compat-male",
      title: "남자 사주",
      subtitle: male.summary,
      paragraphs: [
        `일간: ${formatStemLabel(mDay.stem, mDay.stemHanja)}`,
        `일지: ${formatBranchLabel(mDay.branch, mDay.branchHanja)}`,
      ],
      tags: ["#남자사주"],
    },
    {
      id: "compat-female",
      title: "여자 사주",
      subtitle: female.summary,
      paragraphs: [
        `일간: ${formatStemLabel(fDay.stem, fDay.stemHanja)}`,
        `일지: ${formatBranchLabel(fDay.branch, fDay.branchHanja)}`,
      ],
      tags: ["#여자사주"],
    },
    {
      id: "compat-love",
      title: "연애·결혼 궁합",
      bullets: [
        score >= 80
          ? "서로의 기운이 잘 맞아, 자연스럽게 끌리는 편입니다."
          : "성격·가치관 차이가 있을 수 있으나, 존중하면 깊은 관계가 가능합니다.",
        BRANCH_CLASH[mDay.branch] === fDay.branch
          ? "감정 충돌 시 즉각 대응보다 하루 쉬었다 대화하세요."
          : "갈등이 생겨도 대화로 풀 수 있는 여지가 있습니다.",
        "결혼: 재물·가족·양가 부모 이슈는 미리 합의하는 것이 좋습니다.",
        "친밀감: 상대의 '사랑 표현 방식'을 이해하려는 노력이 필요합니다.",
      ],
      tags: ["#연애", "#결혼"],
    },
    {
      id: "compat-life",
      title: "생활·가정 조언",
      bullets: [
        `${mEl}·${fEl} 조합 — 집안 역할·재정·육아 분담을 명확히 하세요.`,
        "부족한 오행(목·화·토·금·수)은 함께 여행·취미·색·음식으로 보완할 수 있습니다.",
        "명절·양가 방문·돈 문제는 '규칙'을 미리 정하면 갈등이 줄어듭니다.",
        "궁합은 가능성일 뿐, 매일의 대화와 배려가 관계를 만듭니다.",
      ],
      tags: ["#가정", "#조언"],
    },
  ];
}

export function analyzeCompatibility(
  male: SajuResult,
  female: SajuResult,
): { score: number; grade: string; summary: string; sections: ReportSection[] } {
  const score = scoreCompatibility(male, female);
  const grade = gradeFromScore(score);
  const m = male.pillars.day;
  const f = female.pillars.day;
  const summary = `남 ${m.stem}${m.branch} · 여 ${f.stem}${f.branch} — ${score}점 (${grade})`;

  return {
    score,
    grade,
    summary,
    sections: buildCompatibilitySections(male, female, score),
  };
}
