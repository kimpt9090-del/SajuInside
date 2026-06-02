import type { BirthInput, Pillar, SajuResult } from "./types";

/** 천간 10, 지지 12 (한글·한자) */
const STEMS = [
  { ko: "갑", hanja: "甲" },
  { ko: "을", hanja: "乙" },
  { ko: "병", hanja: "丙" },
  { ko: "정", hanja: "丁" },
  { ko: "무", hanja: "戊" },
  { ko: "기", hanja: "己" },
  { ko: "경", hanja: "庚" },
  { ko: "신", hanja: "辛" },
  { ko: "임", hanja: "壬" },
  { ko: "계", hanja: "癸" },
];

const BRANCHES = [
  { ko: "자", hanja: "子" },
  { ko: "축", hanja: "丑" },
  { ko: "인", hanja: "寅" },
  { ko: "묘", hanja: "卯" },
  { ko: "진", hanja: "辰" },
  { ko: "사", hanja: "巳" },
  { ko: "오", hanja: "午" },
  { ko: "미", hanja: "未" },
  { ko: "신", hanja: "申" },
  { ko: "유", hanja: "酉" },
  { ko: "술", hanja: "戌" },
  { ko: "해", hanja: "亥" },
];

/** 시지 매핑 (자시 23~01 등 단순 구간) */
const HOUR_BRANCH_INDEX = [
  { start: 23, end: 1, index: 0 },
  { start: 1, end: 3, index: 1 },
  { start: 3, end: 5, index: 2 },
  { start: 5, end: 7, index: 3 },
  { start: 7, end: 9, index: 4 },
  { start: 9, end: 11, index: 5 },
  { start: 11, end: 13, index: 6 },
  { start: 13, end: 15, index: 7 },
  { start: 15, end: 17, index: 8 },
  { start: 17, end: 19, index: 9 },
  { start: 19, end: 21, index: 10 },
  { start: 21, end: 23, index: 11 },
];

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function makePillar(stemIdx: number, branchIdx: number, label: string): Pillar {
  const stem = STEMS[mod(stemIdx, 10)];
  const branch = BRANCHES[mod(branchIdx, 12)];
  return {
    stem: stem.ko,
    branch: branch.ko,
    stemHanja: stem.hanja,
    branchHanja: branch.hanja,
    label,
  };
}

function hourBranchIndex(hour: number): number {
  for (const slot of HOUR_BRANCH_INDEX) {
    if (slot.start === 23) {
      if (hour >= 23 || hour < 1) return slot.index;
      continue;
    }
    if (hour >= slot.start && hour < slot.end) return slot.index;
  }
  return mod(Math.floor(hour / 2), 12);
}

/** 일주: 기준일(1900-01-01) 갑자일 기준 오프셋 (근사) */
function dayPillar(input: BirthInput): Pillar {
  const base = new Date(input.year, input.month - 1, input.day);
  const anchor = new Date(1900, 0, 1);
  const diff = Math.floor(
    (base.getTime() - anchor.getTime()) / (24 * 60 * 60 * 1000),
  );
  const stemIdx = mod(diff + 0, 10);
  const branchIdx = mod(diff + 0, 12);
  return makePillar(stemIdx, branchIdx, "일주");
}

/** 년주: 입춘 미반영 근사 (양력 연도) */
function yearPillar(year: number): Pillar {
  const stemIdx = mod(year - 4, 10);
  const branchIdx = mod(year - 4, 12);
  return makePillar(stemIdx, branchIdx, "년주");
}

/** 월주: 연간 천간 + 월지 근사 (절기 미반영) */
function monthPillar(year: number, month: number): Pillar {
  const yearStem = mod(year - 4, 10);
  const monthBranch = mod(month + 1, 12);
  const monthStem = mod(yearStem * 2 + month, 10);
  return makePillar(monthStem, monthBranch, "월주");
}

/** 시주: 일간 천간 기준 시간 천간 (오자둔갑) */
function hourPillar(dayStemIdx: number, hour: number): Pillar {
  const branchIdx = hourBranchIndex(hour);
  const hourStem = mod(dayStemIdx * 2 + branchIdx, 10);
  return makePillar(hourStem, branchIdx, "시주");
}

/**
 * 사주 팔자 계산 (교육·엔터테인먼트용 근사)
 *
 * 정밀 만세력은 음력/윤달·절입 시각·태양시 보정이 필요합니다.
 * 프로덕션에서는 `lunar-javascript`, `manseryeok` 등 검증 라이브러리 연동을 권장합니다.
 */
export function calculateSaju(input: BirthInput): SajuResult {
  const y = yearPillar(input.year);
  const m = monthPillar(input.year, input.month);
  const d = dayPillar(input);
  const dayStemIdx = STEMS.findIndex((s) => s.ko === d.stem);
  const h = hourPillar(dayStemIdx >= 0 ? dayStemIdx : 0, input.hour);

  const calLabel = input.calendar === "lunar" ? "음력(미변환)" : "양력";
  const genderLabel = input.gender === "male" ? "남" : "여";

  return {
    input,
    pillars: { year: y, month: m, day: d, hour: h },
    summary: `${input.year}년 ${input.month}월 ${input.day}일 ${input.hour}시 (${calLabel}, ${genderLabel})`,
    note:
      "본 결과는 절기·음력 변환 없이 계산한 근사값입니다. 정확한 만세력은 전문 만세력 API/라이브러리 연동을 권장합니다.",
  };
}
