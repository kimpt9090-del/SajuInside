import type { TestCategory } from "@/features/tests/types";

export function getCategoryBasePath(category: TestCategory): string {
  switch (category) {
    case "psychology":
      return "/psychology";
    case "types":
      return "/types";
    case "fortune":
      return "/fortune";
    default:
      return "/";
  }
}

export function testStartPath(category: TestCategory, testId: string) {
  return `${getCategoryBasePath(category)}/${testId}/start`;
}

export function testRunPath(category: TestCategory, testId: string) {
  return `${getCategoryBasePath(category)}/${testId}/run`;
}

export function testResultPath(category: TestCategory, testId: string) {
  return `${getCategoryBasePath(category)}/${testId}/result`;
}
