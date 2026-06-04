import type { BirthInput, SajuResult } from "./types";
import { interpretFortune } from "./interpreter";
import { calculatePillars } from "./pillar-calc";

export { todayDayPillar } from "./pillar-calc";

export function calculateSaju(input: BirthInput): SajuResult {
  const pillars = calculatePillars(input);
  const calLabel = input.calendar === "lunar" ? "음력(미변환)" : "양력";
  const genderLabel = input.gender === "male" ? "남" : "여";

  return {
    input,
    pillars,
    summary: `${input.year}년 ${input.month}월 ${input.day}일 ${input.hour}시 (${calLabel}, ${genderLabel})`,
    note:
      "본 결과는 절기·음력 변환 없이 계산한 근사값입니다. 정확한 만세력은 전문 만세력 API/라이브러리 연동을 권장합니다.",
  };
}

export function calculateSajuWithReport(input: BirthInput): SajuResult {
  const base = calculateSaju(input);
  return { ...base, report: interpretFortune(base) };
}
