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
};
