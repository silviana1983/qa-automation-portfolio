import { test, expect } from "@playwright/test";

test("homepage displays title and navigates to getting started", async ({
  page,
}) => {
  await page.goto("https://playwright.dev/");
  await expect(page).toHaveTitle(/Playwright/);
  await expect(page.getByRole("link", { name: "Get started" })).toBeVisible();

  await page.getByRole("link", { name: "Get started" }).click();
  await expect(page).toHaveURL(/.*intro/);
});
