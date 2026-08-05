import { test, expect } from "@playwright/test";
import path from "node:path";
import { pathToFileURL } from "node:url";

const artifact = pathToFileURL(path.join(process.cwd(), "apps/integrated-suite-v0.6/dist/L2G_Integrated_Suite_Scope_v0.6.0.html")).href;

async function openScope(page, viewport = { width: 1440, height: 900 }) {
  await page.setViewportSize(viewport);
  await page.goto(artifact, { waitUntil: "commit", timeout: 30000 });
  const scope = page.locator('[data-workspace="scope"]');
  await expect(scope).toBeVisible({ timeout: 30000 });
  await scope.click();
  await expect(page.getByRole("heading", { name: "Scope", exact: true })).toBeVisible();
}

test("v0.6.1 Boundary opens with selected purpose, grouped records, unknowns, and representation context", async ({ page }) => {
  await openScope(page);
  const detail = page.locator(".v061-boundary-detail");
  await expect(detail.getByRole("heading", { name: "Proposed service boundary" })).toBeVisible();
  await expect(detail).toContainText(/fictional McFirecoal service boundary/i);
  for (const heading of ["Included records", "Excluded records", "Entry and exit context", "Locations and enclaves", "Blocking unknowns", "Related representations"]) {
    await expect(detail.getByRole("heading", { name: heading })).toBeVisible();
  }
  await expect(detail).toContainText("Confirm provider support access");
  await expect(detail).toContainText("Synthetic boundary diagram");
  await expect(page.locator(".scope-priority").first()).not.toContainText(/Priority\s+\d+/i);
  await expect(page.locator(".scope-priority").first()).toContainText(/Blocking|Do next|Follow up|Informational/);
});

test("v0.6.1 Systems and Assets offers profile-safe search and separate dimension filters", async ({ page }) => {
  await openScope(page);
  await page.getByRole("button", { name: "Systems & Assets", exact: true }).click();
  const filters = page.locator(".v061-object-filters");
  await filters.getByLabel("Search systems and assets").fill("Azure application");
  await expect(filters.locator("[data-v061-filter-status]")).toContainText("1 visible record");
  await expect(page.locator(".scope-object-row:not([hidden])")).toHaveCount(1);
  await filters.getByLabel("Search systems and assets").fill("");
  await filters.getByLabel("Category").selectOption({ label: "Unclassified" });
  await expect(filters.locator("[data-v061-filter-status]")).toContainText(/visible record/);
  await filters.getByLabel("Disposition").selectOption({ label: "Proposed In Scope" });
  await expect(page.locator(".scope-object-row:not([hidden])").first()).toContainText("Proposed In Scope");
  await expect(filters).toContainText(/Similar names do not establish identity/i);
});

test("v0.6.1 Provider and flow inspectors expose responsibility, support-access, crossing, and transport context", async ({ page }) => {
  await openScope(page);
  await page.getByRole("button", { name: "Providers & Services", exact: true }).click();
  await page.locator(".scope-object-list .scope-object-row").filter({ hasText: "Cloud provider" }).first().click();
  const providerInspector = page.locator(".scope-inspector");
  await expect(providerInspector.getByRole("heading", { name: "Provider and responsibility context" })).toBeVisible();
  await expect(providerInspector).toContainText(/provider-managed/i);
  await expect(providerInspector).toContainText(/shared/i);
  await expect(providerInspector).toContainText("Confirm provider support access");

  await page.getByRole("button", { name: "Data Flows", exact: true }).click();
  await page.locator(".scope-flow-list .scope-flow-card").filter({ hasText: "Client upload path" }).first().click();
  const flowInspector = page.locator(".scope-inspector");
  await expect(flowInspector.getByRole("heading", { name: "Flow crossing and transport context" })).toBeVisible();
  await expect(flowInspector).toContainText("HTTPS upload");
  await expect(flowInspector).toContainText(/one-way · event-driven/i);
  await expect(flowInspector).toContainText("Proposed service boundary");
  await expect(flowInspector).toContainText(/TLS-protected web transfer asserted for discussion/i);
});

test("v0.6.1 compacts minimum-height metrics and provides accessible tablet inspector close semantics", async ({ page }) => {
  await openScope(page, { width: 1280, height: 720 });
  await expect(page.locator(".scope-metrics")).toHaveCSS("display", "flex");
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.getByRole("button", { name: "Systems & Assets", exact: true }).click();
  const row = page.locator(".scope-object-list .scope-object-row").filter({ hasText: "Application service" }).first();
  await row.focus();
  await row.click();
  const inspector = page.locator(".scope-inspector");
  await expect(inspector).toHaveAttribute("role", "dialog");
  await expect(inspector).toHaveAttribute("aria-modal", "false");
  await page.keyboard.press("Escape");
  await expect(page.locator(".scope-inspector-heading")).toHaveCount(0);
  await expect(row).toBeFocused();
  const fits = await page.evaluate(() => document.body.scrollWidth <= window.innerWidth + 1);
  expect(fits).toBe(true);
});

test("v0.6.1 intentionally empty Scope states show no-inference start actions", async ({ page }) => {
  await openScope(page);
  await page.evaluate(() => {
    const store = window.__L2G_TEST__.store;
    store.execute("test.scope.empty", "scope", "test-empty", "Created an intentionally empty synthetic Scope for UI acceptance.", document => {
      const scope = document.state.scope;
      for (const key of ["boundaries", "systems", "assets", "providers", "services", "locations", "enclaves", "data_flows", "assumptions", "unknowns", "dependencies", "diagrams", "decisions", "candidates", "import_receipts"]) scope[key] = [];
      scope.revision += 1;
      scope.updated_at = new Date().toISOString();
    });
  });
  await page.locator('[data-workspace="scope"]').click();
  const empty = page.locator(".v061-boundary-detail");
  await expect(empty.getByRole("heading", { name: "Start an intentionally empty Scope" })).toBeVisible();
  await expect(empty).toContainText(/Nothing was inferred from the earlier project/i);
  await expect(empty.getByRole("button", { name: "Import Scoper package" })).toBeVisible();
  await expect(empty.getByRole("button", { name: "Review source candidates" })).toBeVisible();
  await expect(empty.getByRole("button", { name: "Add boundary proposal" })).toBeDisabled();
});
