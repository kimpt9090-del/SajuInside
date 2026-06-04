import type { ReportSection } from "@/lib/report-types";
import type { Element } from "./stems-branches";
import { getStemMeta } from "./stems-branches";
import type { SajuResult } from "../types";

type FortuneCategory = "caution" | "love" | "career" | "money";

const CAUTION: Record<Element, string[]> = {
  목: ["성급한 결정·과한 확장", "갈등을 키우는 말", "과로·눈·간 건강"],
  화: ["충동·감정 폭발", "과열·소화기·혈압", "서류·계약 꼼꼼히"],
  토: ["우유부단·미루기", "소화·비만·무기력", "남의 일까지 떠안기"],
  금: ["날카로운 말·비판", "호흡기·피부·스트레스", "무리한 투자·손실"],
  수: ["불안·우울·과몰입", "수분·신장·순환", "감정적 소비·도박"],
};

const LOVE: Record<Element, string[]> = {
  목: ["새로운 만남·연락운", "성장을 함께하는 관계", "고집·주도권 다툼 주의"],
  화: ["적극적 표현·로맨스", "외모·매력·인기", "질투·과열 감정 조절"],
  토: ["안정·신뢰·가정운", "장기 관계 발전", "답답함·표현 부족 보완"],
  금: ["쿨한 매력·결단", "정리·결별·새 시작", "냉정함·체면 다툼"],
  수: ["깊은 대화·공감", "직감·운명적 만남", "거리감·오해 풀기"],
};

const CAREER: Record<Element, string[]> = {
  목: ["기획·창업·새 프로젝트", "학습·자격·성장", "경쟁·이기기보다 협력"],
  화: ["발표·홍보·대외 활동", "승진·인지도 상승", "과로·번아웃"],
  토: ["실무·관리·부동산", "안정·승진·조직 내 신뢰", "변화 거부·정체"],
  금: ["결단·정리·M&A·법무", "성과·실력 인정", "갈등·압박·스트레스"],
  수: ["연구·기획·유통·해외", "아이디어·전략", "방향성·우유부단"],
};

const MONEY: Record<Element, string[]> = {
  목: ["성장 투자·교육비", "지출 > 수입 주의", "장기 자산 설계"],
  화: ["수입 증가·보너스", "충동 소비·사치", "투자 과열"],
  토: ["저축·부동산·안정", "빚·보증·연대", "재물 축적"],
  금: ["정리·환금·수익 실현", "손실·손절", "세금·서류"],
  수: ["유동성·현금", "감정 소비·사기", "숨은 기회"],
};

function seedFrom(input: SajuResult, date: Date, salt: string): number {
  const dayStem = input.pillars.day.stem;
  const n =
    date.getFullYear() * 10000 +
    (date.getMonth() + 1) * 100 +
    date.getDate() +
    dayStem.charCodeAt(0) +
    salt.charCodeAt(0) * 7;
  return Math.abs(n);
}

function pick<T>(arr: T[], seed: number, count: number): T[] {
  const out: T[] = [];
  for (let i = 0; i < count && i < arr.length; i++) {
    out.push(arr[(seed + i * 3) % arr.length]!);
  }
  return out;
}

function categoryBullets(
  element: Element,
  category: FortuneCategory,
  seed: number,
): string[] {
  const map = { caution: CAUTION, love: LOVE, career: CAREER, money: MONEY };
  return pick(map[category][element], seed, 3);
}

function buildPeriodSection(
  id: string,
  title: string,
  subtitle: string,
  result: SajuResult,
  date: Date,
  salt: string,
  tags: string[],
): ReportSection {
  const dayStem = result.pillars.day.stem;
  const meta = getStemMeta(dayStem);
  const element = meta?.element ?? "토";
  const seed = seedFrom(result, date, salt);

  return {
    id,
    title,
    subtitle,
    highlight: `${dayStem}(${meta?.hanja ?? ""}) 일간 · ${element} 기운 기준`,
    bullets: [
      `⚠️ 조심: ${categoryBullets(element, "caution", seed).join(" · ")}`,
      `💕 이성: ${categoryBullets(element, "love", seed + 1).join(" · ")}`,
      `💼 진로: ${categoryBullets(element, "career", seed + 2).join(" · ")}`,
      `💰 금전: ${categoryBullets(element, "money", seed + 3).join(" · ")}`,
    ],
    tags,
  };
}

export function buildPeriodFortuneSections(
  result: SajuResult,
  now = new Date(),
): ReportSection[] {
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const weekStart = new Date(now);
  weekStart.setDate(d - now.getDay());

  return [
    buildPeriodSection(
      "daily-fortune",
      "오늘의 운세",
      `${y}년 ${m}월 ${d}일`,
      result,
      now,
      "daily",
      ["#오늘", "#일운", "#연애", "#진로", "#금전"],
    ),
    buildPeriodSection(
      "weekly-fortune",
      "이번 주 운세 (7일)",
      `${weekStart.getMonth() + 1}/${weekStart.getDate()} ~ 7일간`,
      result,
      weekStart,
      "weekly",
      ["#주간", "#연애", "#진로", "#금전"],
    ),
    buildPeriodSection(
      "monthly-fortune",
      "이번 달 운세",
      `${y}년 ${m}월`,
      result,
      new Date(y, m - 1, 1),
      "monthly",
      ["#월간", "#연애", "#진로", "#금전"],
    ),
  ];
}
