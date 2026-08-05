import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "node:path";
import { pathToFileURL } from "node:url";

const artifact = pathToFileURL(path.join(process.cwd(), "apps/integrated-suite-v0.6/dist/L2G_Integrated_Suite_Scope_v0.6.0.html")).href;

async function openScope(page) {
  await page.goto(artifact, { waitUntil: "commit", timeout: 30000 });
  const nav = page.locator('[data-workspace="scope"]');
  await expect(nav).toBeVisible({ timeout: 30000 });
  await nav.click();
  await expect(page.locator("#scope-title")).toBeVisible();
}
async function profile(page, value) {
  const select = page.locator("select").filter({ has: page.locator(`option[value="${value}"]`) }).first();
  await select.selectOption(value);
  await expect(page.locator("#scope-title")).toBeVisible();
}
async function axe(page) {
  const result = await new AxeBuilder({ page }).analyze();
  return result.violations.filter(item => ["serious", "critical"].includes(item.impact));
}
async function aria(page) {
  const body = page.locator("body");
  return typeof body.ariaSnapshot === "function" ? body.ariaSnapshot() : body.innerText();
}
async function staleAsset(page) {
  await page.evaluate(() => {
    const hooks = window.__L2G_TEST__;
    const scope = hooks.store.document.state.scope;
    const asset = scope.assets[0];
    asset.version++;
    asset.updated_at = new Date().toISOString();
    scope.revision++;
    window.L2G.refreshScopeCurrency(scope);
    window.L2G.v06Render(document.getElementById("workspace"), hooks.store);
  });
  await expect(page.locator("#scope-title")).toBeVisible();
}

test("governed six-view Scope workbench is accessible and offline", async ({ page }) => {
  const remote = [], errors = [];
  page.on("request", request => { if (/^https?:/i.test(request.url())) remote.push(request.url()); });
  page.on("pageerror", error => errors.push(error.message));
  await openScope(page);
  for (const label of ["Boundary", "Systems & Assets", "Providers & Services", "Data Flows", "Decisions", "Diagrams"]) await expect(page.getByRole("button", { name: label, exact: true })).toBeVisible();
  await expect(page.getByText(/do not establish readiness, compliance, risk, evidence sufficiency, implementation, certification, applicability, or Met\/Not Met/)).toBeVisible();
  expect(remote).toEqual([]);
  expect(errors).toEqual([]);
  expect(await axe(page)).toEqual([]);
});

test("rapid profile switching removes Advisor-only DOM and accessibility content", async ({ page }) => {
  await openScope(page);
  const secret = "Advisor-only disclosure sentinel 7F3A";
  await page.evaluate(label => window.__L2G_TEST__.store.execute("scope.test.secret", "scope_asset", "scope-test-secret", "Created Advisor-only test asset.", document => {
    const item = window.L2G.createScopeAsset(document.state.scope, { label, asset_kind: "server", visibility: "advisor-only", description: "Advisor-only provenance sentinel." }, document.state.profile);
    item.identifier_summary = "SECRET-ID-7F3A";
  }), secret);
  await page.getByRole("button", { name: "Systems & Assets", exact: true }).click();
  await page.getByRole("button", { name: new RegExp(secret) }).click();
  await profile(page, "client");
  await profile(page, "reviewer");
  await profile(page, "client");
  const text = await page.locator("body").innerText(), snapshot = await aria(page);
  for (const token of [secret, "SECRET-ID-7F3A"]) { expect(text).not.toContain(token); expect(snapshot).not.toContain(token); }
  await expect(page.locator("#scope-title")).toBeFocused();
});

test("Client diagrams are rebuilt from Client-visible records only", async ({ page }) => {
  await openScope(page);
  const secret = "Hidden diagram node sentinel 99B";
  await page.evaluate(label => window.__L2G_TEST__.store.execute("scope.test.client-diagram", "scope_diagram", "scope-test-client-diagram", "Added hidden diagram sentinel.", document => {
    const scope = document.state.scope;
    const asset = window.L2G.createScopeAsset(scope, { label, asset_kind: "server", visibility: "advisor-only", description: "Hidden from Client projection." }, document.state.profile);
    const diagram = scope.diagrams[0];
    diagram.visibility = "client-safe"; diagram.diagram_review_state = "reviewed"; diagram.review_state = "reviewed";
    diagram.included_record_refs.push({ id: asset.id, version: asset.version });
    diagram.node_records.push({ node_id: "secret-node", record_ref: { id: asset.id, version: asset.version }, proposal_label: "", x: 900, y: 500, width: 180, height: 72 });
    diagram.edge_records.push({ edge_id: "secret-edge", from_node_id: diagram.node_records[0].node_id, to_node_id: "secret-node", relationship_ref: null, proposal_label: "Hidden relationship sentinel" });
    diagram.text_alternative += ` ${label}. Hidden relationship sentinel.`; diagram.version++;
  }), secret);
  await profile(page, "client");
  await page.getByRole("button", { name: "Diagrams", exact: true }).click();
  const card = page.locator(".scope-diagram-card").first();
  await expect(card.getByText(/only records approved for this presentation profile/)).toBeVisible();
  const text = await card.innerText(), snapshot = await aria(page);
  for (const token of [secret, "Hidden relationship sentinel"]) { expect(text).not.toContain(token); expect(snapshot).not.toContain(token); }
  expect(await axe(page)).toEqual([]);
});

test("decision review presents atomic effects and accepts disposition without category", async ({ page }) => {
  await openScope(page);
  const index = await page.evaluate(() => window.__L2G_TEST__.store.document.state.scope.decisions[0].field_changes.findIndex(change => change.field === "asset_category"));
  await page.getByRole("button", { name: "Decisions", exact: true }).click();
  await page.getByRole("button", { name: "Review atomic effects" }).click();
  await expect(page.getByText(/Asset category and Scope disposition are separate dimensions/)).toBeVisible();
  await page.locator(`[data-v06-change-index="${index}"]`).uncheck();
  await page.getByRole("button", { name: "Modify and accept" }).click();
  await page.getByRole("button", { name: "Systems & Assets", exact: true }).click();
  const asset = page.getByRole("button", { name: /Application service/i }).first();
  await expect(asset).toContainText("Accepted In Scope");
  await expect(asset).toContainText("Unclassified");
});

test("stale decisions are rendered and gated before acceptance", async ({ page }) => {
  await openScope(page);
  await staleAsset(page);
  await page.getByRole("button", { name: "Decisions", exact: true }).click();
  await expect(page.getByRole("button", { name: "Review atomic effects" })).toBeDisabled();
  await expect(page.getByText(/Acceptance is unavailable because the proposal is stale/)).toBeVisible();
});

test("same-name imports require explicit identity treatment", async ({ page }) => {
  await openScope(page);
  const chooser = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Import Scoper package" }).click();
  (await chooser).setFiles({ name: "same-name.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify({ kind: "l2g_scope_return_package_v1", version: "1.0", producer: "Synthetic Scoper v3.12 browser fixture", assets: [{ id: "same-name-1", name: "Application service", type: "server" }, { id: "same-name-2", name: "Application service", type: "cloud-resource" }] })) });
  const rows = page.locator(".scope-import-records fieldset").filter({ hasText: "Application service" });
  await expect(rows).toHaveCount(2);
  await expect(page.getByRole("button", { name: "Apply reviewed subset atomically" })).toBeDisabled();
  for (let i = 0; i < 2; i++) await rows.nth(i).locator("select[data-v06-treatment]").selectOption("keep-separate");
  await page.getByRole("button", { name: "Apply reviewed subset atomically" }).click();
  const diagnostics = await page.evaluate(() => window.__L2G_TEST__.store.document.state.scope.import_receipts.at(-1).diagnostics);
  expect(diagnostics.filter(item => item.includes("keep-separate"))).toHaveLength(2);
});

test("diagram relationships are accessible and stale refresh preserves prior representation", async ({ page }) => {
  await openScope(page);
  await page.getByRole("button", { name: "Diagrams", exact: true }).click();
  let card = page.locator(".scope-diagram-card").filter({ hasText: "Synthetic boundary diagram" }).first();
  await expect(card.locator(".scope-diagram-edges line")).toHaveCount(1);
  await expect(card.getByRole("button", { name: "Fit" })).toBeVisible();
  await card.getByText("Nodes and relationships").click();
  await expect(card.getByRole("heading", { name: "Relationships" })).toBeVisible();
  await card.getByRole("button", { name: "Mark reviewed" }).click();
  await staleAsset(page);
  await page.getByRole("button", { name: "Diagrams", exact: true }).click();
  card = page.locator(".scope-diagram-card").filter({ hasText: "Synthetic boundary diagram" }).first();
  await expect(card.getByText("This representation is stale.")).toBeVisible();
  await card.getByRole("button", { name: "Create refreshed draft" }).click();
  const state = await page.evaluate(() => {
    const diagrams = window.__L2G_TEST__.store.document.state.scope.diagrams;
    const prior = diagrams.find(item => item.label === "Synthetic boundary diagram"), next = diagrams.find(item => item.supersedes_id === prior.id);
    return { count: diagrams.length, reciprocal: prior.superseded_by_id === next.id && next.supersedes_id === prior.id, nextReview: next.diagram_review_state };
  });
  expect(state).toEqual({ count: 2, reciprocal: true, nextReview: "draft" });
});

test("Unknown publication creates one draft question and no live agenda item", async ({ page }) => {
  await openScope(page);
  const before = await page.evaluate(() => ({ q: window.__L2G_TEST__.store.document.state.interviews.questions.length, items: window.__L2G_TEST__.store.document.state.interviews.plans.flatMap(plan => plan.items).length }));
  await page.getByRole("button", { name: /Confirm provider support access/i }).first().click();
  await page.getByRole("button", { name: "Publish question candidate" }).click();
  await page.getByRole("button", { name: "Create question candidate" }).click();
  const after = await page.evaluate(() => {
    const state = window.__L2G_TEST__.store.document.state, question = state.interviews.questions.at(-1);
    return { q: state.interviews.questions.length, items: state.interviews.plans.flatMap(plan => plan.items).length, lifecycle: question.lifecycle, source: question.provenance.source_id, questionId: question.question_id, unknownRef: state.scope.unknowns[0].session_question_candidate_ref };
  });
  expect(after.q).toBe(before.q + 1); expect(after.items).toBe(before.items); expect(after.lifecycle).toBe("draft"); expect(after.source).toContain("scope-unknown"); expect(after.questionId).toBe(after.unknownRef);
});

test("Reviewer Concur with changes does not directly mutate governed objects", async ({ page }) => {
  await openScope(page);
  const original = await page.evaluate(() => window.__L2G_TEST__.store.document.state.scope.assets[0].scope_disposition);
  const index = await page.evaluate(() => window.__L2G_TEST__.store.document.state.scope.decisions[0].field_changes.findIndex(change => change.field === "scope_disposition"));
  await profile(page, "reviewer");
  await page.getByRole("button", { name: "Decisions", exact: true }).click();
  await page.getByRole("button", { name: "Concur with changes" }).click();
  await page.locator(`[data-v06-review-change="${index}"]`).fill("accepted-out-of-scope");
  await page.locator("#v06-review-comment").fill("Concur with the modified disposition for Advisor acceptance.");
  await page.getByRole("button", { name: "Record Concur With Changes" }).click();
  const state = await page.evaluate(() => ({ disposition: window.__L2G_TEST__.store.document.state.scope.decisions[0].reviewer_disposition, object: window.__L2G_TEST__.store.document.state.scope.assets[0].scope_disposition }));
  expect(state.disposition).toBe("concur-with-changes"); expect(state.object).toBe(original);
});

test("empty migrated Scope remains no-inference with bounded starts", async ({ page }) => {
  await openScope(page);
  await page.evaluate(() => { const hooks = window.__L2G_TEST__, value = structuredClone(hooks.store.document); value.state.scope = window.L2G.emptyScopeDomain(); hooks.store.replace(value, true); });
  await expect(page.getByText("Nothing was inferred from the prior project.")).toBeVisible();
  await expect(page.locator("#v06-empty-import")).toBeVisible();
  await expect(page.getByRole("button", { name: "Review source candidates" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Add boundary proposal" })).toBeVisible();
});

test("keyboard search, inspection, Escape, and focus restoration work", async ({ page }) => {
  await openScope(page);
  await page.getByRole("button", { name: "Systems & Assets", exact: true }).click();
  await page.keyboard.press("/");
  await expect(page.locator("#v06-search")).toBeFocused();
  await page.locator("#v06-search").fill("Application service");
  const asset = page.getByRole("button", { name: /Application service/i }).first();
  await asset.focus(); await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Application service" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#scope-title")).toBeFocused();
});

test("responsive light/dark profile matrix passes axe and overflow checks", async ({ page }, info) => {
  test.setTimeout(240000);
  for (const view of [{ width: 1440, height: 900, name: "1440x900" }, { width: 1280, height: 720, name: "1280x720" }, { width: 1024, height: 768, name: "1024x768" }]) for (const theme of ["light", "dark"]) for (const role of ["advisor", "client", "reviewer"]) {
    await page.setViewportSize(view); await page.emulateMedia({ colorScheme: theme }); await openScope(page); if (role !== "advisor") await profile(page, role);
    await page.getByRole("button", { name: "Diagrams", exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${view.name} ${theme} ${role}`).toBe(true);
    await page.screenshot({ path: info.outputPath(`v061-${view.name}-${theme}-${role}.png`), fullPage: true });
    expect(await axe(page)).toEqual([]);
  }
});
