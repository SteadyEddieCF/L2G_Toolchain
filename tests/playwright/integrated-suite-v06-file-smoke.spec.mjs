import { test, expect } from "@playwright/test";
import path from "node:path";
import { pathToFileURL } from "node:url";

const artifact = pathToFileURL(path.join(process.cwd(), "apps/integrated-suite-v0.6/dist/L2G_Integrated_Suite_Scope_v0.6.0.html")).href;

test("v0.6 Scope primary workflow runs from a native file origin", async ({ page }) => {
  const remote = [];
  page.on("request", request => { if (/^https?:/i.test(request.url())) remote.push(request.url()); });
  await page.goto(artifact, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.locator('[data-workspace="scope"]').click();
  await expect(page.getByRole("heading", { name: "Scope", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Systems & Assets", exact: true }).click();
  await expect(page.getByText("Application service")).toBeVisible();
  await page.getByRole("button", { name: "Decisions", exact: true }).click();
  await expect(page.getByText("Propose application service in scope")).toBeVisible();
  await page.getByRole("button", { name: "Diagrams", exact: true }).click();
  await expect(page.getByText("Synthetic boundary diagram")).toBeVisible();
  expect(remote).toEqual([]);
});
