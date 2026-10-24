import { test, expect } from "@playwright/test";
import { login } from "./login-helper";

test("user can remove a backpack from the cart", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await login(page, "standard_user", "secret_sauce");

  const backpack = page.locator(".inventory_item").filter({
    hasText: "Sauce Labs Backpack",
  });

  await backpack.getByRole("button", { name: "Add to cart" }).click();

  await page.locator(".shopping_cart_link").click();
  await expect(
    page.getByText("Sauce Labs Backpack", { exact: true }),
  ).toBeVisible();

  await expect(
    page.getByText("Sauce Labs Bike Light", { exact: true }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Remove" }).click();

  await expect(
    page.getByText("Sauce Labs Backpack", { exact: true }),
  ).toHaveCount(0);
});

test("user can sort products by price from low to high", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await login(page, "standard_user", "secret_sauce");

  await page.getByRole("combobox").selectOption("lohi");

  const prices = await page.locator(".inventory_item_price").allTextContents();

  const numericPrices = prices.map((price) => Number(price.replace("$", "")));

  const sortedPrices = [...numericPrices].sort((a, b) => a - b);

  expect(numericPrices).toEqual(sortedPrices);

  expect(numericPrices[0]).toBe(Math.min(...numericPrices));
  expect(numericPrices[numericPrices.length - 1]).toBe(
    Math.max(...numericPrices),
  );
});
test("cart badge displays the correct count for two products", async ({
  page,
}) => {
  await page.goto("https://www.saucedemo.com/");

  await login(page, "standard_user", "secret_sauce");

  const backpack = page.locator(".inventory_item").filter({
    hasText: "Sauce Labs Backpack",
  });

  const bikeLight = page.locator(".inventory_item").filter({
    hasText: "Sauce Labs Bike Light",
  });

  await backpack.getByRole("button", { name: "Add to cart" }).click();
  await bikeLight.getByRole("button", { name: "Add to cart" }).click();

  await expect(page.locator(".shopping_cart_badge")).toHaveText("2");

  await page.locator(".shopping_cart_link").click();
});
