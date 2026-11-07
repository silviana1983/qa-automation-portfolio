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

test("user can view product descriptions and prices", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await login(page, "standard_user", "secret_sauce");
  const productDescriptions = page.locator(".inventory_item_desc");

  await expect(productDescriptions.first()).toBeVisible();

  const displayedDescriptions = await productDescriptions.allTextContents();
  expect(displayedDescriptions.length).toBeGreaterThan(0);
  expect(
    displayedDescriptions.every((description) => description.trim().length > 0),
  ).toBe(true);
  const productPrices = page.locator(".inventory_item_price");
  const displayedPrices = await productPrices.allTextContents();
  expect(displayedPrices.length).toBeGreaterThan(0);
  expect(
    displayedPrices.every((price) => /^\$\d+\.\d{2}$/.test(price.trim())),
  ).toBe(true);
});

test("each inventory product displays complete product information", async ({
  page,
}) => {
  await page.goto("https://www.saucedemo.com/");
  await login(page, "standard_user", "secret_sauce");
  const productCards = page.locator(".inventory_item");
  await expect(productCards.first()).toBeVisible();
  const productCount = await productCards.count();
  expect(productCount).toBeGreaterThan(0);
  const productNames = productCards.locator(".inventory_item_name");
  const displayedNames = await productNames.allTextContents();
  expect(displayedNames.length).toBe(productCount);
  expect(displayedNames.every((name) => name.trim().length > 0)).toBe(true);
  const productDescriptions = productCards.locator(".inventory_item_desc");
  const displayedDescriptions = await productDescriptions.allTextContents();
  expect(displayedDescriptions.length).toBe(productCount);
  expect(
    displayedDescriptions.every((description) => description.trim().length > 0),
  ).toBe(true);
  const productPrices = productCards.locator(".inventory_item_price");
  const displayedPrices = await productPrices.allTextContents();
  expect(displayedPrices.length).toBe(productCount);
  expect(
    displayedPrices.every((price) => /^\$\d+\.\d{2}$/.test(price.trim())),
  ).toBe(true);
  const productButtons = productCards.locator("button");
  expect(await productButtons.count()).toBe(productCount);
  const buttonLabels = await productButtons.allTextContents();
  expect(buttonLabels.length).toBe(productCount);
  expect(buttonLabels.every((label) => label.trim().length > 0)).toBe(true);
});

test("each inventory product displays a visible product image", async ({
  page,
}) => {
  await page.goto("https://www.saucedemo.com/");
  await login(page, "standard_user", "secret_sauce");
  const productCards = page.locator(".inventory_item");
  await expect(productCards.first()).toBeVisible();
  const productImages = productCards.locator(".inventory_item_img img");
  const imageCount = await productImages.count();
  expect(imageCount).toBe(await productCards.count());
  await expect(productImages.first()).toBeVisible();
  const imageSources = await productImages.evaluateAll((images) =>
    images.map((image) => image.getAttribute("src")),
  );
  expect(
    imageSources.every((source) => source !== null && source.trim().length > 0),
  ).toBe(true);
  await expect
    .poll(async () =>
      productImages.evaluateAll((images) =>
        images.every((image) => (image as HTMLImageElement).complete),
      ),
    )
    .toBe(true);

  const loadedImages = await productImages.evaluateAll((images) =>
    images.map((image) => (image as HTMLImageElement).naturalWidth > 0),
  );
  expect(loadedImages.every((isLoaded) => isLoaded)).toBe(true);
});

test("user can open a product detail page", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await login(page, "standard_user", "secret_sauce");
  const productNames = page.locator(".inventory_item_name");
  const firstProduct = productNames.first();
  await expect(firstProduct).toBeVisible();
  await firstProduct.click();
  await expect(page).toHaveURL(/inventory-item\.html/);
  const productDetailName = page.locator(".inventory_details_name");
  await expect(productDetailName).toBeVisible();
  const productDetailDescription = page.locator(".inventory_details_desc");
  await expect(productDetailDescription).toBeVisible();
  const productDetailPrice = page.locator(".inventory_details_price");
  await expect(productDetailPrice).toBeVisible();
  const backButton = page.locator(".inventory_details_back_button");
  await expect(backButton).toBeVisible();
  await backButton.click();
  await expect(page).toHaveURL(/inventory\.html/);
});

test("product detail information matches the selected inventory item", async ({
  page,
}) => {
  await page.goto("https://www.saucedemo.com/");
  await login(page, "standard_user", "secret_sauce");
  const firstProductCard = page.locator(".inventory_item").first();
  await expect(firstProductCard).toBeVisible();
  const inventoryProductName = firstProductCard.locator(".inventory_item_name");
  const inventoryName = (await inventoryProductName.textContent())?.trim();
  const inventoryProductDescription = firstProductCard.locator(
    ".inventory_item_desc",
  );
  const inventoryDescription = (
    await inventoryProductDescription.textContent()
  )?.trim();
  const inventoryProductPrice = firstProductCard.locator(
    ".inventory_item_price",
  );
  const inventoryPrice = (await inventoryProductPrice.textContent())?.trim();
  await inventoryProductName.click();
  await expect(page).toHaveURL(/inventory-item\.html/);
  const productDetailName = page.locator(".inventory_details_name");
  await expect(productDetailName).toHaveText(inventoryName!);
  const productDetailDescription = page.locator(".inventory_details_desc");
  await expect(productDetailDescription).toHaveText(inventoryDescription!);
  const productDetailPrice = page.locator(".inventory_details_price");
  await expect(productDetailPrice).toHaveText(inventoryPrice!);
});

test("product detail image matches the selected inventory item", async ({
  page,
}) => {
  await page.goto("https://www.saucedemo.com/");
  await login(page, "standard_user", "secret_sauce");
  const firstProductCard = page.locator(".inventory_item").first();
  await expect(firstProductCard).toBeVisible();
  const inventoryProductImage = firstProductCard.locator(
    ".inventory_item_img img",
  );
  await expect(inventoryProductImage).toBeVisible();
  const inventoryImageSource = await inventoryProductImage.getAttribute("src");
  expect(inventoryImageSource).toBeTruthy();
  const inventoryProductName = firstProductCard.locator(".inventory_item_name");
  await inventoryProductName.click();
  await expect(page).toHaveURL(/inventory-item\.html/);
  const productDetailImage = page.locator(".inventory_details_img");
  await expect(productDetailImage).toBeVisible();
  const productDetailImageSource = await productDetailImage.getAttribute("src");
  expect(productDetailImageSource).toBeTruthy();
  expect(productDetailImageSource).toBe(inventoryImageSource);
});

test("user can add a product to the cart from its detail page", async ({
  page,
}) => {
  await page.goto("https://www.saucedemo.com/");
  await login(page, "standard_user", "secret_sauce");
  const firstProductCard = page.locator(".inventory_item").first();
  await expect(firstProductCard).toBeVisible();
  const inventoryProductName = firstProductCard.locator(".inventory_item_name");
  const selectedProductName = (
    await inventoryProductName.textContent()
  )?.trim();
  await inventoryProductName.click();
  await expect(page).toHaveURL(/inventory-item\.html/);
  const addToCartButton = page.locator(".inventory_details .btn_inventory");
  await expect(addToCartButton).toBeVisible();
  await expect(addToCartButton).toHaveText("Add to cart");
  await addToCartButton.click();
  await expect(addToCartButton).toHaveText("Remove");
  const cartBadge = page.locator(".shopping_cart_badge");
  await expect(cartBadge).toBeVisible();
  await expect(cartBadge).toHaveText("1");
  await page.locator(".shopping_cart_link").click();
  await expect(page).toHaveURL(/cart\.html/);
  const cartProductName = page.locator(".inventory_item_name");
  await expect(cartProductName).toBeVisible();
  await expect(cartProductName).toHaveText(selectedProductName!);
});
