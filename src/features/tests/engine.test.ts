import { describe, expect, it } from "vitest";

import { computeScore } from "./engine";
import { anxietyTest } from "./tests/anxiety";
import { depressionTest } from "./tests/depression";

describe("computeScore clinical modes", () => {
  it("PHQ-9: all minimum answers → 0 (minimal)", () => {
    const answers = Object.fromEntries(
      depressionTest.questions.map((q) => [q.id, 1 as const]),
    );
    const report = computeScore(depressionTest, {
      testId: "depression",
      version: depressionTest.version,
      answers,
    });
    expect(report.rawSum).toBe(0);
    expect(report.resultId).toBe("minimal");
  });

  it("PHQ-9: all maximum answers on q1–q9 → 27 (severe)", () => {
    const answers = Object.fromEntries(
      depressionTest.questions.map((q) => [q.id, 5 as const]),
    );
    const report = computeScore(depressionTest, {
      testId: "depression",
      version: depressionTest.version,
      answers,
    });
    expect(report.rawSum).toBe(27);
    expect(report.resultId).toBe("severe");
  });

  it("GAD-7: low-mid answers → mild band", () => {
    const answers = Object.fromEntries(
      anxietyTest.questions.map((q) => [q.id, 2 as const]),
    );
    const report = computeScore(anxietyTest, {
      testId: "anxiety",
      version: anxietyTest.version,
      answers,
    });
    expect(report.rawSum).toBeGreaterThanOrEqual(11);
    expect(report.rawSum).toBeLessThanOrEqual(18);
    expect(report.resultId).toBe("mild");
  });
});
