import {
  STEMS,
  BRANCHES,
  formatStemLabel,
  formatBranchLabel,
} from "./content/stems-branches";
import type { BirthInput, Pillar } from "./types";

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

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

export function makePillar(stemIdx: number, branchIdx: number, label: string): Pillar {
  const stem = STEMS[mod(stemIdx, 10)]!;
  const branch = BRANCHES[mod(branchIdx, 12)]!;
  return {
    stem: stem.ko,
    branch: branch.ko,
    stemHanja: stem.hanja,
    branchHanja: branch.hanja,
    label,
    stemDesc: formatStemLabel(stem.ko, stem.hanja),
    branchDesc: formatBranchLabel(branch.ko, branch.hanja),
    stemElement: stem.element,
    branchElement: branch.element,
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

export function dayPillar(input: BirthInput): Pillar {
  const base = new Date(input.year, input.month - 1, input.day);
  const anchor = new Date(1900, 0, 1);
  const diff = Math.floor(
    (base.getTime() - anchor.getTime()) / (24 * 60 * 60 * 1000),
  );
  return makePillar(diff, diff, "일주");
}

export function yearPillar(year: number): Pillar {
  return makePillar(year - 4, year - 4, "년주");
}

export function monthPillar(year: number, month: number): Pillar {
  const yearStem = mod(year - 4, 10);
  const monthBranch = mod(month + 1, 12);
  const monthStem = mod(yearStem * 2 + month, 10);
  return makePillar(monthStem, monthBranch, "월주");
}

export function hourPillar(dayStemIdx: number, hour: number): Pillar {
  const branchIdx = hourBranchIndex(hour);
  const hourStem = mod(dayStemIdx * 2 + branchIdx, 10);
  return makePillar(hourStem, branchIdx, "시주");
}

export function todayDayPillar(date = new Date()): Pillar {
  return dayPillar({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: 12,
    minute: 0,
    gender: "male",
    calendar: "solar",
  });
}

export function calculatePillars(input: BirthInput) {
  const y = yearPillar(input.year);
  const m = monthPillar(input.year, input.month);
  const d = dayPillar(input);
  const dayStemIdx = STEMS.findIndex((s) => s.ko === d.stem);
  const h = hourPillar(dayStemIdx >= 0 ? dayStemIdx : 0, input.hour);
  return { year: y, month: m, day: d, hour: h };
}

export function lookupDatePillars(
  year: number,
  month: number,
  day: number,
  hour = 12,
) {
  return calculatePillars({
    year,
    month,
    day,
    hour,
    minute: 0,
    gender: "male",
    calendar: "solar",
  });
}
