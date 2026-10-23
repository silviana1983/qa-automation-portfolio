import { test, expect } from "@playwright/test";

test("user can remove a backpack from the cart", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();

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
