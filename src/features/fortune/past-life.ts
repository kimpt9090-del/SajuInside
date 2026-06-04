import type { DetailedReport } from "@/lib/report-types";
import { calculateSaju } from "./calculator";
import {
  PAST_LIFE_BY_BRANCH,
  profileToSections,
} from "./content/past-life-profiles";
import type { BirthInput } from "./types";

export function interpretPastLife(input: BirthInput) {
  const saju = calculateSaju(input);
  const dayBranch = saju.pillars.day.branch;
  const profile =
    PAST_LIFE_BY_BRANCH[dayBranch] ?? PAST_LIFE_BY_BRANCH["자"]!;

  const sections = profileToSections(profile);

  const report: DetailedReport = {
    headline: `전생: ${profile.title}`,
    subheadline: `${input.year}년 ${input.month}월 ${input.day}일생 · ${profile.era}`,
    keywords: ["전생", profile.title, dayBranch, "카르마"],
    sections,
  };

  return {
    input,
    saju,
    profile,
    report,
    summary: `${profile.title} — ${profile.role}`,
  };
}
