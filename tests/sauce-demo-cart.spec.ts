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

  await page.getByRole("button", { name: "Remove" }).click();

  await expect(
    page.getByText("Sauce Labs Backpack", { exact: true }),
  ).toHaveCount(0);

  await expect(page.locator(".shopping_cart_badge")).toHaveCount(0);
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
  await expect(
    page.getByText("Sauce Labs Backpack", { exact: true }),
  ).toBeVisible();

  await expect(
    page.getByText("Sauce Labs Bike Light", { exact: true }),
  ).toBeVisible();

  const backpackInCart = page.locator(".cart_item").filter({
    hasText: "Sauce Labs Backpack",
  });

  await backpackInCart.getByRole("button", { name: "Remove" }).click();

  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");

  await expect(
    page.getByText("Sauce Labs Backpack", { exact: true }),
  ).toHaveCount(0);

  await expect(
    page.getByText("Sauce Labs Bike Light", { exact: true }),
  ).toBeVisible();
});

test("cart count remains correct after returning to products", async ({
  page,
}) => {
  await page.goto("https://www.saucedemo.com/");
  await login(page, "standard_user", "secret_sauce");
  const backpack = page.locator(".inventory_item").filter({
    hasText: "Sauce Labs Backpack",
  });

  await backpack.getByRole("button", { name: "Add to cart" }).click();
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
  await page.locator(".shopping_cart_link").click();
  await expect(
    page.getByText("Sauce Labs Backpack", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Continue Shopping" }).click();
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
  await expect(backpack.getByRole("button", { name: "Remove" })).toBeVisible();
});

test("user completes the checkout successfully", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await login(page, "standard_user", "secret_sauce");

  const backpack = page.locator(".inventory_item").filter({
    hasText: "Sauce Labs Backpack",
  });

  await backpack.getByRole("button", { name: "Add to cart" }).click();

  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");

  await page.locator(".shopping_cart_link").click();

  await expect(
    page.getByText("Sauce Labs Backpack", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Checkout" }).click();
  await page.getByPlaceholder("First Name").fill("Silvia");
  await page.getByPlaceholder("Last Name").fill("Flores");
  await page.getByPlaceholder("Zip/Postal Code").fill("680001");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page).toHaveURL(/checkout-step-two\.html/);

  await expect(page.getByText("Payment Information")).toBeVisible();

  await expect(page.getByRole("button", { name: "Finish" })).toBeVisible();

  await page.getByRole("button", { name: "Finish" }).click();

  await expect(
    page.getByText("Thank you for your order!", { exact: true }),
  ).toBeVisible();
});

test("checkout shows an error when first name is missing", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await login(page, "standard_user", "secret_sauce");

  const backpack = page.locator(".inventory_item").filter({
    hasText: "Sauce Labs Backpack",
  });

  await backpack.getByRole("button", { name: "Add to cart" }).click();

  await page.locator(".shopping_cart_link").click();

  await page.getByRole("button", { name: "Checkout" }).click();

  await page.getByPlaceholder("Last Name").fill("Flores");
  await page.getByPlaceholder("Zip/Postal Code").fill("680001");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByText("Error: First Name is required", { exact: true }),
  ).toBeVisible();
});

test("cart displays the product that was added", async ({ page }) => {
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
});

test("cart is empty after removing the product", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await login(page, "standard_user", "secret_sauce");

  const backpack = page.locator(".inventory_item").filter({
    hasText: "Sauce Labs Backpack",
  });

  await backpack.getByRole("button", { name: "Add to cart" }).click();

  await page.locator(".shopping_cart_link").click();

  await page.getByRole("button", { name: "Remove" }).click();

  await expect(page.locator(".cart_item")).toHaveCount(0);
});
