import type { TestDefinition } from "./types";
import { anxietyTest } from "./tests/anxiety";
import { attachmentTest } from "./tests/attachment";
import { depressionTest } from "./tests/depression";
import { egenTetoTest } from "./tests/egen-teto";
import { mbtiFullTest } from "./tests/mbti-full";
import { mbtiOfficialTest } from "./tests/mbti-official";
import { mbtiTest } from "./tests/mbti";
import { psychopathTest } from "./tests/psychopath";
import { temperamentTest } from "./tests/temperament";

export const TESTS: Record<string, TestDefinition> = {
  [attachmentTest.id]: attachmentTest,
  [mbtiTest.id]: mbtiTest,
  [mbtiFullTest.id]: mbtiFullTest,
  [mbtiOfficialTest.id]: mbtiOfficialTest,
  [egenTetoTest.id]: egenTetoTest,
  [temperamentTest.id]: temperamentTest,
  [psychopathTest.id]: psychopathTest,
  [depressionTest.id]: depressionTest,
  [anxietyTest.id]: anxietyTest,
};

export function getTestsByCategory(category: TestDefinition["category"]): TestDefinition[] {
  return Object.values(TESTS).filter((t) => t.category === category);
}

export function getTest(testId: string): TestDefinition | undefined {
  return TESTS[testId];
}

/** MBTI 계열 테스트 id (복합 리포트·궁합 등) */
export const MBTI_TEST_IDS = ["mbti", "mbti-full", "mbti-official"] as const;

export function isMbtiTestId(testId: string): boolean {
  return (MBTI_TEST_IDS as readonly string[]).includes(testId);
}
