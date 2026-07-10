import { expect, test } from "@playwright/test";

test("searches, filters, and renders the Pokédex", async ({ page }) => {
  await page.goto("./");
  await expect(
    page.getByRole("heading", { name: /discover your next favorite/i })
  ).toBeVisible();
  await expect(page.locator(".pokemon-card")).toHaveCount(30);
  await expect(page.locator(".pokemon-card img").first()).toBeVisible();
  await page.screenshot({ path: "docs/screenshots/home.png" });

  const search = page.getByRole("searchbox", {
    name: "Search Pokémon by name",
  });
  await search.fill("pikachu");
  await expect(page.getByText(/of \d+ matches/)).toBeVisible({
    timeout: 15_000,
  });
  await expect
    .poll(
      async () =>
        (await page.locator(".pokemon-card h2").allTextContents()).every(
          (name) => name.toLowerCase().includes("pikachu")
        ),
      { timeout: 15_000 }
    )
    .toBe(true);
  const names = await page.locator(".pokemon-card h2").allTextContents();
  expect(names.length).toBeGreaterThan(0);
  expect(names.length).toBeLessThan(30);
  expect(names.every((name) => name.toLowerCase().includes("pikachu"))).toBe(
    true
  );

  await search.fill("");
  await page.getByLabel("Filter by generation").selectOption("1");
  await expect(page.getByRole("heading", { name: "Bulbasaur" })).toBeVisible({
    timeout: 15_000,
  });
  await page.getByRole("button", { name: /types/i }).click();
  await page.getByRole("button", { name: "Fire", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Charmander" })).toBeVisible({
    timeout: 15_000,
  });
  await expect(
    page.getByRole("heading", { name: "Squirtle" })
  ).not.toBeVisible();
  await page.screenshot({ path: "docs/screenshots/home-filtered.png" });

  await page.getByRole("button", { name: /clear/i }).click();
  await expect(page.getByRole("heading", { name: "Bulbasaur" })).toBeVisible();
});
