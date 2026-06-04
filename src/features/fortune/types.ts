import type { DetailedReport } from "@/lib/report-types";
import type { Element } from "./content/stems-branches";

export type Gender = "male" | "female";

export type CalendarType = "solar" | "lunar";

export type BirthInput = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender: Gender;
  calendar: CalendarType;
};

export type Pillar = {
  stem: string;
  branch: string;
  stemHanja: string;
  branchHanja: string;
  label: string;
  /** 천간 해석 (한자+뜻) */
  stemDesc?: string;
  /** 지지 해석 (한자+뜻) */
  branchDesc?: string;
  stemElement?: Element;
  branchElement?: Element;
};

export type SajuResult = {
  input: BirthInput;
  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar;
  };
  summary: string;
  note: string;
  report?: DetailedReport;
};

export type CompatibilityInput = {
  male: BirthInput;
  female: BirthInput;
};

export type CompatibilityResult = {
  male: SajuResult;
  female: SajuResult;
  score: number;
  grade: string;
  summary: string;
  report: DetailedReport;
};
