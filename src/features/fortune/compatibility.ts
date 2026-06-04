import type { DetailedReport } from "@/lib/report-types";
import { calculateSaju } from "./calculator";
import { analyzeCompatibility } from "./content/compatibility";
import type { CompatibilityInput, CompatibilityResult } from "./types";

export function calculateCompatibility(input: CompatibilityInput): CompatibilityResult {
  const maleInput = { ...input.male, gender: "male" as const };
  const femaleInput = { ...input.female, gender: "female" as const };
  const male = calculateSaju(maleInput);
  const female = calculateSaju(femaleInput);
  const analysis = analyzeCompatibility(male, female);

  const report: DetailedReport = {
    headline: `궁합 ${analysis.score}점 — ${analysis.grade}`,
    subheadline: analysis.summary,
    keywords: ["궁합", "남녀사주", "연애", "결혼"],
    sections: [
      ...analysis.sections,
      {
        id: "compat-disclaimer",
        title: "안내",
        paragraphs: [
          male.note,
          "궁합은 일주·오행 기반 참고용 콘텐츠이며, 실제 관계는 서로의 노력과 소통이 가장 중요합니다.",
        ],
        tags: ["#안내"],
      },
    ],
  };

  return {
    male,
    female,
    score: analysis.score,
    grade: analysis.grade,
    summary: analysis.summary,
    report,
  };
}
