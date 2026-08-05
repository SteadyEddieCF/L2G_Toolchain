import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "node:path";
import { pathToFileURL } from "node:url";

const repo = process.cwd();
const artifact = pathToFileURL(path.join(repo, "apps/integrated-suite-v0.6/dist/L2G_Integrated_Suite_Scope_v0.6.0.html")).href;

async function openScope(page) {
  await page.goto(artifact, { waitUntil: "commit", timeout: 30000 });
  const scopeWorkspace = page.locator('[data-workspace="scope"]');
  await expect(scopeWorkspace).toBeVisible({ timeout: 30000 });
  await scopeWorkspace.click();
  await expect(page.getByRole("heading", { name: "Scope", exact: true })).toBeVisible();
  await expect(page.getByText("Objects describe the environment; Scope-owned decisions establish accepted authority.")).toBeVisible();
}

async function switchProfile(page, value) {
  const select = page.locator('select').filter({ has: page.locator(`option[value="${value}"]`) }).first();
  await expect(select).toBeVisible();
  await select.selectOption(value);
  const scopeWorkspace = page.locator('[data-workspace="scope"]');
  await expect(scopeWorkspace).toBeVisible();
  await scopeWorkspace.click();
}

test("v0.6 Scope workbench exposes the governed six-view workflow", async ({ page }) => {
  const remote = [];
  page.on("request", request => { if (/^https?:/i.test(request.url())) remote.push(request.url()); });
  await openScope(page);
  for (const label of ["Boundary", "Systems & Assets", "Providers & Services", "Data Flows", "Decisions", "Diagrams"]) {
    await expect(page.getByRole("button", { name: label, exact: true })).toBeVisible();
  }
  await expect(page.getByText("Synthetic-only. Scope records and locally asserted data labels do not establish readiness, compliance, risk, evidence sufficiency, implementation, certification, or Met/Not Met.", { exact: true })).toBeVisible();
  await expect(page.locator(".scope-list-card").filter({ hasText: "Proposed service boundary" }).first()).toBeVisible();
  expect(remote).toEqual([]);
});

test("Scope decision acceptance changes only named Scope authority fields", async ({ page }) => {
  page.on("dialog", dialog => dialog.accept());
  await openScope(page);
  await page.getByRole("button", { name: "Decisions", exact: true }).click();
  await expect(page.getByText("Propose application service in scope")).toBeVisible();
  await page.getByRole("button", { name: "Accept exact decision" }).click();
  await page.getByRole("button", { name: "Systems & Assets", exact: true }).click();
  const asset = page.getByRole("button", { name: /Application service/i }).first();
  await expect(asset).toContainText("Cui Asset");
  await expect(asset).toContainText("Accepted In Scope");
});

test("Client Scope projection removes Advisor analysis, candidates, and hidden counts before render", async ({ page }) => {
  await openScope(page);
  await page.getByRole("button", { name: "Decisions", exact: true }).click();
  await expect(page.getByText("Source candidates")).toBeVisible();
  await switchProfile(page, "client");
  await page.getByRole("button", { name: "Decisions", exact: true }).click();
  await expect(page.getByText("Source candidates")).toHaveCount(0);
  await expect(page.getByText("Advisor-only synthetic analysis.")).toHaveCount(0);
  await expect(page.getByText("Presentation profiles are not access control or safe project distribution.")).toHaveCount(0);
  await expect(page.getByText(/not access control, an authenticated approval/i)).toBeVisible();
  const html = await page.locator("body").innerText();
  expect(html).not.toContain("Advisor-only synthetic analysis");
  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations.filter(item => ["serious", "critical"].includes(item.impact))).toEqual([]);
});

test("Scope diagrams are object-linked representations with accessible alternatives", async ({ page }) => {
  await openScope(page);
  await page.getByRole("button", { name: "Diagrams", exact: true }).click();
  const diagramCard = page.locator(".scope-diagram-card").filter({ hasText: "Synthetic boundary diagram" }).first();
  await expect(diagramCard).toBeVisible();
  await expect(diagramCard.getByText("Accessible text alternative")).toBeVisible();
  await diagramCard.getByText("Accessible text alternative").click();
  const diagramAlternative = diagramCard.locator("details p");
  await expect(diagramAlternative).toContainText("Synthetic boundary diagram.");
  await expect(diagramAlternative).toContainText("Includes");
  await expect(diagramAlternative).toContainText("recorded relationship");
  await diagramCard.getByRole("button", { name: "Mark reviewed" }).click();
  await expect(diagramCard).toContainText("Reviewed");
});

test("Scoper return preview is non-mutating until reviewed subset apply", async ({ page }) => {
  await openScope(page);
  const decisions = page.getByRole("button", { name: "Decisions", exact: true });
  await decisions.click();
  await expect(page.getByText("No Scope-owned candidate is waiting.")).toBeVisible();
  const chooser = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Import Scoper package" }).click();
  const fileChooser = await chooser;
  await fileChooser.setFiles({
    name: "synthetic-scope-return.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify({
      kind: "l2g_scope_return_package_v1",
      version: "1.0",
      producer: "Synthetic Scoper v3.12 browser fixture",
      assets: [{ id: "asset-browser-1", name: "Browser synthetic server", type: "server" }],
      providers: [{ id: "provider-browser-1", name: "Browser synthetic provider", type: "csp" }]
    }))
  });
  await expect(page.getByRole("heading", { name: "Review Scope package" })).toBeVisible();
  await expect(page.getByText("Browser synthetic server")).toBeVisible();
  await page.getByRole("button", { name: "Apply reviewed subset atomically" }).click();
  await page.getByRole("button", { name: "Decisions", exact: true }).click();
  await expect(page.getByText("Browser synthetic server")).toBeVisible();
  await expect(page.getByText("Browser synthetic provider")).toBeVisible();
});

test("Scope remains usable at the minimum desktop and tablet landscape targets", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await openScope(page);
  await expect(page.locator("body")).not.toHaveCSS("overflow-x", "scroll");
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.getByRole("button", { name: "Systems & Assets", exact: true }).click();
  await expect(page.getByText("Application service")).toBeVisible();
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth <= window.innerWidth + 1);
  expect(bodyWidth).toBe(true);
});
