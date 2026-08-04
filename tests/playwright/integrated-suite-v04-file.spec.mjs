import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { openV04 } from "./integrated-suite-v04-helpers.mjs";

test("runs the v0.4 Evidence Catalog from native file origin with no network", async ({ page }) => {
  const requests = await openV04(page, true);
  expect(new URL(page.url()).protocol).toBe("file:");
  await expect(page.getByText("v0.4.0 · Evidence Catalog Core")).toBeVisible();
  await expect(page.locator('[data-workspace]')).toHaveCount(8);
  await page.getByRole("button", { name: /Evidence/ }).click();
  await expect(page.getByRole("heading", { name: "Evidence", exact: true })).toBeVisible();
  expect(requests).toEqual([]);
});

test("hashes and registers a synthetic source under native file origin", async ({ page }) => {
  await openV04(page, true);
  await page.getByRole("button", { name: /Evidence/ }).click();
  await page.locator("#evidence-add-input").setInputFiles({
    name: "Synthetic_File_Origin_Evidence.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("synthetic file-origin evidence bytes")
  });
  await expect(page.locator("[data-staged-card]")).toBeVisible({ timeout: 15000 });
  await expect(page.locator("[data-staged-card] .fingerprint")).toHaveText(/^[0-9a-f]{64}$/);
  await page.locator('[data-staged-field="display_label"]').fill("Synthetic File Origin Evidence");
  await page.getByRole("button", { name: "Commit staged sources" }).click();
  await expect(page.getByText("Synthetic File Origin Evidence", { exact: true })).toBeVisible();
  const result = await page.evaluate(() => {
    const hooks = window.__L2G_TEST__;
    const source = hooks.store.document.state.evidence.sources.find(item => item.display_label === "Synthetic File Origin Evidence");
    return { found: Boolean(source), fingerprint: source?.fingerprint?.sha256 ?? "", link: source ? hooks.sessionLinks.getState(source.evidence_id) : "missing" };
  });
  expect(result.found).toBe(true);
  expect(result.fingerprint).toMatch(/^[0-9a-f]{64}$/);
  expect(result.link).toBe("linked-exact");
});

test("passes native file-origin accessibility smoke", async ({ page }) => {
  await openV04(page, true);
  await page.getByRole("button", { name: /Evidence/ }).click();
  const result = await new AxeBuilder({ page }).analyze();
  expect(result.violations.filter(item => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
});
