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

  await page.getByRole("button", { name: "Remove" }).click();

  await expect(
    page.getByText("Sauce Labs Backpack", { exact: true }),
  ).toHaveCount(0);
});
