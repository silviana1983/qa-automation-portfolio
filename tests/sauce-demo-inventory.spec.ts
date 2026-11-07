import { test, expect } from "@playwright/test";
import { login } from "./login-helper";

test("user can sort products by price from low to high", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await login(page, "standard_user", "secret_sauce");
  const prices = page.locator(".inventory_item_price");
  await page.locator(".product_sort_container").selectOption("lohi");
  const displayedPrices = await prices.allTextContents();
  const numericPrices = displayedPrices.map((price) =>
    Number(price.replace("$", "")),
  );
  expect(numericPrices.length).toBeGreaterThan(0);
  expect(numericPrices).toEqual([...numericPrices].sort((a, b) => a - b));
});

test("user can sort products by price from high to low", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await login(page, "standard_user", "secret_sauce");
  const prices = page.locator(".inventory_item_price");
  await page.locator(".product_sort_container").selectOption("hilo");
  const displayedPrices = await prices.allTextContents();
  const numericPrices = displayedPrices.map((price) =>
    Number(price.replace("$", "")),
  );
  expect(numericPrices.length).toBeGreaterThan(0);
  expect(numericPrices).toEqual([...numericPrices].sort((a, b) => b - a));
});

test("user can sort products by name from A to Z", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await login(page, "standard_user", "secret_sauce");
  const productNames = page.locator(".inventory_item_name");
  await page.locator(".product_sort_container").selectOption("az");
  const displayedNames = await productNames.allTextContents();
  expect(displayedNames.length).toBeGreaterThan(0);
  expect(displayedNames).toEqual(
    [...displayedNames].sort((a, b) => a.localeCompare(b)),
  );
});

test("user can sort products by name from Z to A", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await login(page, "standard_user", "secret_sauce");
  const productNames = page.locator(".inventory_item_name");
  await page.locator(".product_sort_container").selectOption("za");
  const displayedNames = await productNames.allTextContents();
  expect(displayedNames.length).toBeGreaterThan(0);
  expect(displayedNames).toEqual(
    [...displayedNames].sort((a, b) => b.localeCompare(a)),
  );
});
