import { test, expect } from "@playwright/test";
import { login } from "./login-helper";

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

  await login(page, "locked_out_user", "secret_sauce");

  await expect(
    page.getByText("Epic sadface: Sorry, this user has been locked out.", {
      exact: true,
    }),
  ).toBeVisible();

  await expect(page).toHaveURL("https://www.saucedemo.com/");
});

test("user can add a backpack to the cart", async ({ page }) => {
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
});

test("user cannot log in with an incorrect password", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await login(page, "standard_user", "wrong_password");

  await expect(
    page.getByText(
      "Epic sadface: Username and password do not match any user in this service",
      { exact: true },
    ),
  ).toBeVisible();

  await expect(page).toHaveURL("https://www.saucedemo.com/");
});
