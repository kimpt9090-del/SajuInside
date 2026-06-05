import { test, expect } from "@playwright/test";

test("홈 페이지가 로드된다", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("마이페이지에 로그인 섹션이 보인다", async ({ page }) => {
  await page.goto("/my");
  await expect(page.getByTestId("auth-sign-in")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId("auth-email")).toBeVisible();
});

test("만세력 날짜 검색 결과가 표시된다", async ({ page }) => {
  await page.goto("/fortune/manseryeok");
  const search = page.getByTestId("manseryeok-date-search");
  await expect(search).toBeVisible();
  await search.getByTestId("date-search-submit").click();
  await expect(search.getByTestId("date-search-result")).toBeVisible();
  await expect(search.getByTestId("date-search-result")).toContainText("년주");
});

test("궁합 파트너 초대 UI가 동작한다", async ({ page }) => {
  await page.goto("/fortune/compatibility");
  const maleStep = page.getByTestId("compat-male-step");
  await expect(maleStep).toBeVisible();

  await maleStep.getByLabel("연도").selectOption("1990");
  await maleStep.getByLabel("월").selectOption("5");
  await maleStep.getByLabel("일").selectOption("15");
  await maleStep.getByLabel("시").selectOption("10");
  await maleStep.getByRole("button", { name: "사주 보기" }).click();

  await expect(page.getByTestId("compat-female-step")).toBeVisible();
  await expect(page.getByTestId("compat-invite-box")).toBeVisible();
  await expect(page.getByTestId("compat-copy-invite")).toBeVisible();
});

test("여자 사주 초대 모드 전환", async ({ page }) => {
  await page.goto("/fortune/compatibility");
  await page.getByTestId("compat-mode-female-invite").click();
  await expect(page.getByTestId("compat-female-first")).toBeVisible();
});
