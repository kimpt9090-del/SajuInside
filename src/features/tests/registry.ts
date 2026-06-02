import type { TestDefinition, TestCategory } from "./types";
import { attachmentTest } from "./tests/attachment";
import { mbtiTest } from "./tests/mbti";
import { temperamentTest } from "./tests/temperament";

export const TESTS: Record<string, TestDefinition> = {
  [attachmentTest.id]: attachmentTest,
  [mbtiTest.id]: mbtiTest,
  [temperamentTest.id]: temperamentTest,
};

export function getTestsByCategory(category: TestCategory): TestDefinition[] {
  return Object.values(TESTS).filter((t) => t.category === category);
}

export function getTest(testId: string): TestDefinition | undefined {
  return TESTS[testId];
}
