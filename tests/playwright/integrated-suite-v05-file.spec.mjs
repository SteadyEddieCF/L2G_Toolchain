import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { openV05 } from "./integrated-suite-v05-helpers.mjs";

test("runs the v0.5 Pre-Engagement and Interview workflow from native file origin", async ({ page }) => {
  const requests = await openV05(page, true);
  await expect(page).toHaveTitle(/v0\.5\.0.*Pre-Engagement and Interview Sessions/);
  await page.getByRole("button", { name: /Pre-Engagement/ }).click();
  await expect(page.getByRole("heading", { name: "Pre-Engagement", exact: true })).toBeVisible();
  await expect(page.getByText("advisor-entered-on-behalf", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Practice Review/ }).click();
  await expect(page.getByRole("heading", { name: "Practice Review · Interview Sessions", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Start Interview Mode" }).click();
  await expect(page.getByRole("heading", { name: "Interview Mode", exact: true })).toBeVisible();
  await page.locator('[data-v05-form="statement"] textarea[name="text"]').fill("Synthetic Windows file-origin statement.");
  await page.locator('[data-v05-form="statement"]').getByRole("button", { name: "Record separate statement" }).click();
  await page.locator("#profile-select").selectOption("client");
  await expect(page.getByText("Synthetic Windows file-origin statement.", { exact: true })).toBeVisible();
  await expect(page.locator("body")).not.toContainText("Internal Advisor notes");
  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations.filter(item => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
  expect(requests).toEqual([]);
});
