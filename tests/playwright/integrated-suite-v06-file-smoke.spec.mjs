import { test, expect } from "@playwright/test";
import path from "node:path";
import { pathToFileURL } from "node:url";

const artifact = pathToFileURL(path.join(process.cwd(), "apps/integrated-suite-v0.6/dist/L2G_Integrated_Suite_Scope_v0.6.0.html")).href;

test("v0.6 Scope primary workflow runs from a native file origin", async ({ page }) => {
  test.setTimeout(45000);
  const remote = [];
  const consoleMessages = [];
  const pageErrors = [];
  page.on("request", request => { if (/^https?:/i.test(request.url())) remote.push(request.url()); });
  page.on("console", message => consoleMessages.push(`${message.type()}: ${message.text()}`));
  page.on("pageerror", error => pageErrors.push(error.stack || error.message));
  await page.goto(artifact, { waitUntil: "commit", timeout: 30000 });
  await page.waitForTimeout(5000);
  const scopeWorkspace = page.locator('[data-workspace="scope"]');
  if (await scopeWorkspace.count() === 0) {
    const state = await page.evaluate(() => ({
      title: document.title,
      ready_state: document.readyState,
      app_html_length: document.getElementById("app")?.innerHTML.length ?? -1,
      app_text: document.getElementById("app")?.textContent?.slice(0, 500) ?? "",
      script_count: document.scripts.length,
      release_version: window.__L2G_RELEASE__?.version ?? null,
      l2g_namespace: typeof window.L2G,
      test_hooks: typeof window.__L2G_TEST__
    }));
    throw new Error(`v0.6 native-file bootstrap did not render Scope navigation. state=${JSON.stringify(state)} console=${JSON.stringify(consoleMessages)} pageErrors=${JSON.stringify(pageErrors)}`);
  }
  await expect(scopeWorkspace).toBeVisible();
  await scopeWorkspace.click();
  await expect(page.getByRole("heading", { name: "Scope", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Systems & Assets", exact: true }).click();
  await expect(page.getByText("Application service")).toBeVisible();
  await page.getByRole("button", { name: "Decisions", exact: true }).click();
  await expect(page.getByText("Propose application service in scope")).toBeVisible();
  await page.getByRole("button", { name: "Diagrams", exact: true }).click();
  const diagramCard = page.locator(".scope-diagram-card").filter({ hasText: "Synthetic boundary diagram" }).first();
  await expect(diagramCard).toBeVisible();
  expect(remote).toEqual([]);
  expect(pageErrors).toEqual([]);
});
