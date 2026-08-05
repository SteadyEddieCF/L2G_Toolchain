import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "node:path";
import { pathToFileURL } from "node:url";

const artifact = pathToFileURL(path.join(process.cwd(), "apps/integrated-suite-v0.6/dist/L2G_Integrated_Suite_Scope_v0.6.0.html")).href;

async function openScope(page) {
  await page.goto(artifact, { waitUntil: "commit", timeout: 30000 });
  const scope = page.locator('[data-workspace="scope"]');
  await expect(scope).toBeVisible({ timeout: 30000 });
  await scope.click();
  await expect(page.getByRole("heading", { name: "Scope", exact: true })).toBeVisible();
}

async function addAdvisorOnlyAsset(page, label) {
  const replies = [label, "server"];
  const handler = async dialog => dialog.accept(replies.shift() ?? "");
  page.on("dialog", handler);
  await page.getByRole("button", { name: "Add asset" }).click();
  page.off("dialog", handler);
  await page.getByRole("button", { name: "Systems & Assets", exact: true }).click();
  await expect(page.getByText(label, { exact: true })).toBeVisible();
}

async function switchProfile(page, profile) {
  await page.locator("#profile-select").selectOption(profile);
  await expect(page.getByRole("heading", { name: "Scope", exact: true })).toBeVisible();
}

test("v0.6.1 clears Advisor-only Scope selection and inspector before Client render", async ({ page }) => {
  const errors = [];
  page.on("pageerror", error => errors.push(String(error)));
  await openScope(page);
  const secret = "Advisor secret asset — must not survive Client switch";
  await addAdvisorOnlyAsset(page, secret);
  await page.getByRole("button", { name: new RegExp(secret) }).click();
  await expect(page.getByRole("heading", { name: secret, exact: true })).toBeVisible();
  await expect(page.locator(".scope-inspector")).toContainText("Advisor Only");
  await switchProfile(page, "client");
  await expect(page.getByText(secret, { exact: true })).toHaveCount(0);
  await expect(page.locator(".scope-inspector-heading")).toHaveCount(0);
  await expect(page.locator("body")).not.toContainText(secret);
  const focused = await page.evaluate(() => document.activeElement?.id ?? "");
  expect(["scope-title", "workspace", "profile-select"]).toContain(focused);
  expect(errors).toEqual([]);
});

test("v0.6.1 rebuilds Client diagram DOM and alternatives from visible projected records only", async ({ page }) => {
  const remote = [];
  const errors = [];
  page.on("request", request => { if (/^https?:/i.test(request.url())) remote.push(request.url()); });
  page.on("pageerror", error => errors.push(String(error)));
  await openScope(page);
  const secret = "Advisor-only diagram node — hidden from Client";
  await addAdvisorOnlyAsset(page, secret);
  await page.getByRole("button", { name: "Generate diagram" }).click();
  await page.getByRole("button", { name: "Diagrams", exact: true }).click();
  const generated = page.locator(".scope-diagram-card").filter({ hasText: "Scope diagram 2" }).first();
  await expect(generated).toBeVisible();
  await expect(generated).toContainText(secret);
  await generated.getByRole("button", { name: "Mark reviewed" }).click();
  await switchProfile(page, "client");
  await page.getByRole("button", { name: "Diagrams", exact: true }).click();
  const clientDiagram = page.locator(".scope-diagram-card").filter({ hasText: "Scope diagram 2" }).first();
  await expect(clientDiagram).toBeVisible();
  await expect(clientDiagram).not.toContainText(secret);
  await expect(clientDiagram.locator(".scope-diagram-canvas")).toHaveAttribute("role", "region");
  await expect(clientDiagram.locator(".scope-diagram-canvas")).not.toHaveAttribute("aria-label", new RegExp(secret));
  await clientDiagram.getByText("Accessible text alternative").click();
  await expect(clientDiagram.locator("details p")).not.toContainText(secret);
  await expect(clientDiagram.locator(".scope-client-diagram-qualification")).toContainText(/omitted internal records and relationships are not shown or counted/i);
  await expect(page.locator("body")).not.toContainText(secret);
  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations.filter(item => ["serious", "critical"].includes(item.impact))).toEqual([]);
  expect(remote).toEqual([]);
  expect(errors).toEqual([]);
});

test("v0.6.1 accepts disposition while asset category remains independently unresolved", async ({ page }) => {
  await openScope(page);
  await page.getByRole("button", { name: "Decisions", exact: true }).click();
  await page.getByRole("button", { name: "Accept exact decision" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Review Scope decision effects" })).toBeVisible();
  const categoryChange = dialog.locator("label").filter({ hasText: "asset category" });
  const dispositionChange = dialog.locator("label").filter({ hasText: "scope disposition" });
  await expect(categoryChange).toContainText("unclassified → cui-asset");
  await expect(dispositionChange).toContainText("proposed-in-scope → accepted-in-scope");
  await categoryChange.locator("input[type=checkbox]").uncheck();
  await dialog.getByRole("button", { name: "Accept selected Scope changes" }).click();
  await page.getByRole("button", { name: "Systems & Assets", exact: true }).click();
  const asset = page.getByRole("button", { name: /Application service/i }).first();
  await expect(asset).toContainText("Unclassified");
  await expect(asset).toContainText("Accepted In Scope");
});

test("v0.6.1 blocks stale Scope decision acceptance before mutation", async ({ page }) => {
  await openScope(page);
  await page.evaluate(() => {
    window.__L2G_TEST__.store.document.state.scope.decisions[0].currency_state = "stale";
  });
  await page.getByRole("button", { name: "Decisions", exact: true }).click();
  await page.getByRole("button", { name: "Accept exact decision" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText(/Acceptance is unavailable because an affected exact record version changed or the proposal is conflicted/i)).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Accept selected Scope changes" })).toBeDisabled();
});

test("v0.6.1 publishes one Scope unknown question candidate and no live agenda content", async ({ page }) => {
  await openScope(page);
  const interviewsBefore = await page.evaluate(() => JSON.stringify(window.__L2G_TEST__.store.document.state.interviews));
  await page.getByRole("button", { name: /Confirm provider support access/i }).first().click();
  await expect(page.getByRole("button", { name: "Publish question candidate" })).toBeVisible();
  await page.getByRole("button", { name: "Publish question candidate" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Publish Scope unknown to Session Planner" })).toBeVisible();
  await expect(dialog).toContainText(/does not add a live agenda item/i);
  await dialog.getByRole("button", { name: "Publish question candidate" }).click();
  await expect(dialog).toContainText(/has not been added to a live agenda or accepted as a client statement/i);
  const interviewsAfter = await page.evaluate(() => JSON.stringify(window.__L2G_TEST__.store.document.state.interviews));
  expect(interviewsAfter).toBe(interviewsBefore);
  await dialog.getByRole("button", { name: "Close action review" }).click();
  await page.getByRole("button", { name: "Decisions", exact: true }).click();
  await expect(page.getByText("Question: Confirm provider support access", { exact: true })).toBeVisible();
});

test("v0.6.1 Reviewer can concur with changes without directly mutating Scope objects", async ({ page }) => {
  await openScope(page);
  const objectBefore = await page.evaluate(() => JSON.stringify(window.__L2G_TEST__.store.document.state.scope.assets[0]));
  await switchProfile(page, "reviewer");
  await page.getByRole("button", { name: "Decisions", exact: true }).click();
  await expect(page.getByRole("button", { name: "Concur with changes" })).toBeVisible();
  await page.getByRole("button", { name: "Concur with changes" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: /Reviewer disposition — Concur with changes/i })).toBeVisible();
  await dialog.getByLabel("Reviewer comment").fill("Concur after the Advisor updates the independent category proposal.");
  await dialog.getByRole("button", { name: "Concur with changes" }).click();
  await expect(dialog).toHaveCount(0);
  const result = await page.evaluate(() => ({
    object: JSON.stringify(window.__L2G_TEST__.store.document.state.scope.assets[0]),
    disposition: window.__L2G_TEST__.store.document.state.scope.decisions[0].reviewer_disposition,
    reviewState: window.__L2G_TEST__.store.document.state.scope.decisions[0].review_state
  }));
  expect(result.object).toBe(objectBefore);
  expect(result.disposition).toBe("concur-with-changes");
  expect(result.reviewState).toBe("changes-requested");
});

test("v0.6.1 requires explicit treatments for exact and same-name Scoper records", async ({ page }) => {
  await openScope(page);
  const existing = await page.evaluate(() => ({
    id: window.__L2G_TEST__.store.document.state.scope.assets[0].id,
    label: window.__L2G_TEST__.store.document.state.scope.assets[0].label,
    before: JSON.stringify(window.__L2G_TEST__.store.document.state.scope.assets[0])
  }));
  const chooser = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Import Scoper package" }).click();
  const fileChooser = await chooser;
  await fileChooser.setFiles({
    name: "same-name-scope-return.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify({
      kind: "l2g_scope_return_package_v1",
      version: "1.0",
      producer: "Synthetic same-name identity fixture",
      assets: [
        { id: existing.id, name: existing.label, type: "cloud-resource", description: "Exact stable identity" },
        { id: "asset-distinct-same-name", name: existing.label, type: "server", description: "Distinct record sharing a presentation label" }
      ]
    }))
  });
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Review Scope package identity" })).toBeVisible();
  await expect(dialog).toContainText(/Similar names do not establish identity/i);
  const rows = dialog.locator("[data-v061-import-row]");
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(0)).toContainText(/Stable source identity matches one exact Scope record/i);
  await expect(rows.nth(1)).toContainText(/same label appears 2 times|Similar names do not establish identity/i);
  const apply = dialog.getByRole("button", { name: "Apply reviewed subset atomically" });
  await expect(apply).toBeDisabled();
  await rows.nth(0).locator("select[data-v061-treatment]").selectOption("link");
  await rows.nth(1).locator("select[data-v061-treatment]").selectOption("keep-separate");
  await expect(apply).toBeEnabled();
  await apply.click();
  await expect(dialog).toHaveCount(0);
  const result = await page.evaluate(() => ({
    after: JSON.stringify(window.__L2G_TEST__.store.document.state.scope.assets[0]),
    candidates: window.__L2G_TEST__.store.document.state.scope.candidates.filter(item => item.source_domain === "compatibility-import" && item.label === window.__L2G_TEST__.store.document.state.scope.assets[0].label).length,
    receipt: window.__L2G_TEST__.store.document.state.scope.import_receipts.at(-1)?.diagnostics ?? []
  }));
  expect(result.after).toBe(existing.before);
  expect(result.candidates).toBe(1);
  expect(result.receipt.some(item => item.includes("Treatment assets:"))).toBe(true);
});
