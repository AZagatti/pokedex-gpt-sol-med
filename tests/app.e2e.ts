import { expect, test } from "@playwright/test";

test("opens detail, switches sprites, favorites, and persists theme", async ({
  page,
}) => {
  await page.goto("./");
  await page.getByRole("link", { name: /view bulbasaur/i }).click();
  await expect(
    page.getByRole("heading", { name: "Bulbasaur", level: 1 })
  ).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole("heading", { name: "Base stats" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Evolution chain" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Shiny" }).click();
  await expect(
    page.getByAltText(/bulbasaur shiny sprite official artwork/i)
  ).toBeVisible();
  await page
    .getByRole("button", { name: /add bulbasaur to favorites/i })
    .click();
  await expect(
    page.getByRole("button", { name: /remove bulbasaur from favorites/i })
  ).toBeVisible();
  await page.waitForTimeout(700);
  if (process.env.UPDATE_SCREENSHOTS) {
    await page.screenshot({ path: "docs/screenshots/pokemon-detail.png" });
  }

  await page.getByRole("button", { name: /switch to dark theme/i }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(
    page.getByRole("button", { name: /remove bulbasaur from favorites/i })
  ).toBeVisible();

  await page
    .getByRole("link", { name: /favorites/i })
    .first()
    .click();
  await expect(page.getByRole("heading", { name: "Bulbasaur" })).toBeVisible({
    timeout: 15_000,
  });
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(700);
  if (process.env.UPDATE_SCREENSHOTS) {
    await page.screenshot({ path: "docs/screenshots/favorites.png" });
  }
});

test("browses berry garden and berry details", async ({ page }) => {
  await page.goto("berries");
  await expect(
    page.getByRole("heading", { name: /small fruit.*big effects/i })
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Berry results" }).locator("article")
  ).toHaveCount(64);
  await page.waitForTimeout(700);
  if (process.env.UPDATE_SCREENSHOTS) {
    await page.screenshot({ path: "docs/screenshots/berries.png" });
  }
  await page.getByRole("searchbox", { name: "Search berries" }).fill("oran");
  await expect(page.getByRole("heading", { name: "Oran" })).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Berry results" }).locator("article")
  ).toHaveCount(1);
  await page.getByRole("heading", { name: "Oran" }).click();
  await expect(page.getByRole("heading", { name: /oran berry/i })).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByText("Growth time")).toBeVisible();
  await page.waitForTimeout(700);
  if (process.env.UPDATE_SCREENSHOTS) {
    await page.screenshot({ path: "docs/screenshots/berry-detail.png" });
  }
});

test("shows the custom not-found experience", async ({ page }) => {
  await page.goto("a-route-that-does-not-exist");
  await expect(
    page.getByRole("heading", { name: /wild page appeared/i })
  ).toBeVisible();
  await page.waitForTimeout(300);
  if (process.env.UPDATE_SCREENSHOTS) {
    await page.locator("main").screenshot({ path: "docs/screenshots/404.png" });
  }
});
