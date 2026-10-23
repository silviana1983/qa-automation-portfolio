import { test, expect } from "@playwright/test";

async function login(page: import("@playwright/test").Page) {
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
}

test("successful login displays the products page", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/inventory.html/);
  await expect(page.getByText("Products", { exact: true })).toBeVisible();
});

test("locked out user cannot log in", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await page.getByPlaceholder("Username").fill("locked_out_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(
    page.getByText("Epic sadface: Sorry, this user has been locked out.", {
      exact: true,
    }),
  ).toBeVisible();

  await expect(page).toHaveURL("https://www.saucedemo.com/");
});

test("user can add a backpack to the cart", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await login(page);

  const backpack = page.locator(".inventory_item").filter({
    hasText: "Sauce Labs Backpack",
  });

  await backpack.getByRole("button", { name: "Add to cart" }).click();

  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
  await page.locator(".shopping_cart_link").click();

  await expect(
    page.getByText("Sauce Labs Backpack", { exact: true }),
  ).toBeVisible();
});
