import { test, expect } from "@playwright/test";
import path from "node:path";
import { pathToFileURL } from "node:url";

const artifact = pathToFileURL(path.join(process.cwd(), "apps/integrated-suite-v0.6/dist/L2G_Integrated_Suite_Scope_v0.6.0.html")).href;

async function profileSelect(page, value) {
  const select = page.locator("select").filter({ has: page.locator(`option[value="${value}"]`) }).first();
  await select.selectOption(value);
}

test("v0.6 Scope correction workflows run from a native Windows file origin", async ({ page }) => {
  test.setTimeout(90000);
  const remote = [];
  const consoleMessages = [];
  const pageErrors = [];
  page.on("request", request => { if (/^https?:/i.test(request.url())) remote.push(request.url()); });
  page.on("console", message => consoleMessages.push(`${message.type()}: ${message.text()}`));
  page.on("pageerror", error => pageErrors.push(error.stack || error.message));
  await page.goto(artifact, { waitUntil: "commit", timeout: 30000 });
  await page.waitForTimeout(1500);
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
  await scopeWorkspace.click();
  await expect(page.getByRole("heading", { name: "Scope", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Decisions", exact: true }).click();
  await page.getByRole("button", { name: "Review atomic effects" }).click();
  await expect(page.getByText(/changes only the listed Scope-owned fields/)).toBeVisible();
  await page.getByRole("button", { name: "Cancel" }).click();

  await page.getByRole("button", { name: "Diagrams", exact: true }).click();
  const diagramCard = page.locator(".scope-diagram-card").first();
  await expect(diagramCard.locator(".scope-diagram-edges line")).toHaveCount(1);
  await expect(diagramCard.getByRole("button", { name: "Fit" })).toBeVisible();
  await diagramCard.getByText("Nodes and relationships").click();
  await expect(diagramCard.getByRole("heading", { name: "Relationships" })).toBeVisible();

  await profileSelect(page, "client");
  await expect(page.getByText(/not access control, an authenticated approval/)).toBeVisible();
  await profileSelect(page, "reviewer");
  await page.getByRole("button", { name: "Decisions", exact: true }).click();
  await expect(page.getByRole("button", { name: "Concur with changes" })).toBeVisible();

  const persistence = await page.evaluate(async () => {
    const hooks = window.__L2G_TEST__;
    const before = hooks.store.document.state.scope.scope_id;
    const bytes = await window.L2G.serializeInnerProject(hooks.store.document);
    const reopened = await window.L2G.deserializeInnerProject(bytes, false);
    return { before, after: reopened.document.state.scope.scope_id, bytes: bytes.length };
  });
  expect(persistence.bytes).toBeGreaterThan(0);
  expect(persistence.after).toBe(persistence.before);
  expect(remote).toEqual([]);
  expect(pageErrors).toEqual([]);
});
