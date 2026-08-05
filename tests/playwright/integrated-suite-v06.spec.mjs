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
  await expect(page.getByText(/Objects describe the environment; Scope-owned decisions establish accepted authority/)).toBeVisible();
}

async function switchProfile(page, value) {
  const select = page.locator("select").filter({ has: page.locator(`option[value="${value}"]`) }).first();
  await expect(select).toBeVisible();
  await select.selectOption(value);
  await expect(page.getByRole("heading", { name: "Scope", exact: true })).toBeVisible();
}

async function seriousAxeViolations(page) {
  const results = await new AxeBuilder({ page }).analyze();
  return results.violations.filter(item => ["serious", "critical"].includes(item.impact));
}

async function bodyAria(page) {
  const body = page.locator("body");
  if (typeof body.ariaSnapshot === "function") return body.ariaSnapshot();
  return body.innerText();
}

test("v0.6 Scope workbench preserves the governed six-view workflow and zero network", async ({ page }) => {
  const remote = [];
  const pageErrors = [];
  page.on("request", request => { if (/^https?:/i.test(request.url())) remote.push(request.url()); });
  page.on("pageerror", error => pageErrors.push(error.stack || error.message));
  await openScope(page);
  for (const label of ["Boundary", "Systems & Assets", "Providers & Services", "Data Flows", "Decisions", "Diagrams"]) {
    await expect(page.getByRole("button", { name: label, exact: true })).toBeVisible();
  }
  await expect(page.getByText(/do not establish readiness, compliance, risk, evidence sufficiency, implementation, certification, applicability, or Met\/Not Met/)).toBeVisible();
  await expect(page.locator(".scope-list-card").filter({ hasText: "Proposed service boundary" }).first()).toBeVisible();
  expect(remote).toEqual([]);
  expect(pageErrors).toEqual([]);
  expect(await seriousAxeViolations(page)).toEqual([]);
});

test("rapid profile switching clears Advisor-only selection, inspector, labels, live text, and accessibility text", async ({ page }) => {
  await openScope(page);
  const secret = "Advisor-only disclosure sentinel 7F3A";
  await page.evaluate(secretLabel => {
    const hooks = window.__L2G_TEST__;
    hooks.store.execute("scope.test.secret", "scope_asset", "scope-test-secret", "Created Advisor-only test asset.", document => {
      const item = window.L2G.createScopeAsset(document.state.scope, { label: secretLabel, asset_kind: "server", visibility: "advisor-only", description: "Advisor-only provenance sentinel." }, document.state.profile);
      item.identifier_summary = "SECRET-ID-7F3A";
    });
  }, secret);
  await page.getByRole("button", { name: "Systems & Assets", exact: true }).click();
  await page.getByRole("button", { name: new RegExp(secret) }).click();
  await expect(page.getByRole("heading", { name: secret })).toBeVisible();
  await switchProfile(page, "client");
  await switchProfile(page, "reviewer");
  await switchProfile(page, "client");
  const bodyText = await page.locator("body").innerText();
  const aria = await bodyAria(page);
  expect(bodyText).not.toContain(secret);
  expect(bodyText).not.toContain("SECRET-ID-7F3A");
  expect(aria).not.toContain(secret);
  expect(aria).not.toContain("SECRET-ID-7F3A");
  await expect(page.locator("#scope-title")).toBeFocused();
  expect(await seriousAxeViolations(page)).toEqual([]);
});

test("Client diagrams rebuild nodes, edges, counts, and alternatives from the Client projection", async ({ page }) => {
  await openScope(page);
  const secret = "Hidden diagram node sentinel 99B";
  await page.evaluate(secretLabel => {
    const hooks = window.__L2G_TEST__;
    hooks.store.execute("scope.test.client-diagram", "scope_diagram", "scope-test-client-diagram", "Added hidden diagram sentinel.", document => {
      const scope = document.state.scope;
      const asset = window.L2G.createScopeAsset(scope, { label: secretLabel, asset_kind: "server", visibility: "advisor-only", description: "Hidden from Client projection." }, document.state.profile);
      const diagram = scope.diagrams[0];
      diagram.visibility = "client-safe";
      diagram.diagram_review_state = "reviewed";
      diagram.review_state = "reviewed";
      diagram.included_record_refs.push({ id: asset.id, version: asset.version });
      diagram.node_records.push({ node_id: "secret-node", record_ref: { id: asset.id, version: asset.version }, proposal_label: "", x: 900, y: 500, width: 180, height: 72 });
      diagram.edge_records.push({ edge_id: "secret-edge", from_node_id: diagram.node_records[0].node_id, to_node_id: "secret-node", relationship_ref: null, proposal_label: "Hidden relationship sentinel" });
      diagram.text_alternative += ` ${secretLabel}. Hidden relationship sentinel.`;
      diagram.version++;
    });
  }, secret);
  await switchProfile(page, "client");
  await page.getByRole("button", { name: "Diagrams", exact: true }).click();
  const card = page.locator(".scope-diagram-card").first();
  await expect(card).toBeVisible();
  await expect(card.getByText(/only records approved for this presentation profile/)).toBeVisible();
  const text = await card.innerText();
  const aria = await bodyAria(page);
  expect(text).not.toContain(secret);
  expect(text).not.toContain("Hidden relationship sentinel");
  expect(aria).not.toContain(secret);
  expect(aria).not.toContain("Hidden relationship sentinel");
  expect(await seriousAxeViolations(page)).toEqual([]);
});

test("decision review shows exact atomic effects and permits disposition without category", async ({ page }) => {
  await openScope(page);
  await page.getByRole("button", { name: "Decisions", exact: true }).click();
  await page.getByRole("button", { name: "Review atomic effects" }).click();
  await expect(page.getByRole("heading", { name: "Review atomic effects" })).toBeVisible();
  await expect(page.getByText(/Asset category and Scope disposition are separate dimensions/)).toBeVisible();
  await expect(page.getByText(/changes only the listed Scope-owned fields/)).toBeVisible();
  const categoryRow = page.locator(".scope-change-row").filter({ hasText: "Asset Category" });
  await categoryRow.locator('input[type="checkbox"]').uncheck();
  await page.getByRole("button", { name: "Modify and accept" }).click();
  await page.getByRole("button", { name: "Systems & Assets", exact: true }).click();
  const asset = page.getByRole("button", { name: /Application service/i }).first();
  await expect(asset).toContainText("Accepted In Scope");
  await expect(asset).toContainText("Unclassified");
  await expect(asset).not.toContainText("Cui Asset");
});

test("stale decisions are visibly gated before acceptance", async ({ page }) => {
  await openScope(page);
  await page.evaluate(() => {
    const hooks = window.__L2G_TEST__;
    hooks.store.execute("scope.test.stale-decision", "scope_asset", "scope-test-stale", "Changed exact asset version.", document => {
      const asset = document.state.scope.assets[0];
      asset.version++;
      asset.updated_at = new Date().toISOString();
      document.state.scope.revision++;
    });
  });
  await page.getByRole("button", { name: "Decisions", exact: true }).click();
  const review = page.getByRole("button", { name: "Review atomic effects" });
  await expect(review).toBeDisabled();
  await expect(page.getByText(/Acceptance is unavailable because the proposal is stale/)).toBeVisible();
});

test("same-name Scoper records require explicit identity treatment and never auto-merge", async ({ page }) => {
  await openScope(page);
  const chooser = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Import Scoper package" }).click();
  const fileChooser = await chooser;
  await fileChooser.setFiles({
    name: "same-name-scope-return.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify({
      kind: "l2g_scope_return_package_v1",
      version: "1.0",
      producer: "Synthetic Scoper v3.12 browser fixture",
      assets: [
        { id: "same-name-1", name: "Application service", type: "server" },
        { id: "same-name-2", name: "Application service", type: "cloud-resource" }
      ]
    }))
  });
  await expect(page.getByRole("heading", { name: "Review Scope package" })).toBeVisible();
  const rows = page.locator(".scope-import-records fieldset").filter({ hasText: "Application service" });
  await expect(rows).toHaveCount(2);
  await expect(page.getByRole("button", { name: "Apply reviewed subset atomically" })).toBeDisabled();
  for (let index = 0; index < 2; index++) await rows.nth(index).locator("select[data-v06-treatment]").selectOption("keep-separate");
  await expect(page.getByRole("button", { name: "Apply reviewed subset atomically" })).toBeEnabled();
  await page.getByRole("button", { name: "Apply reviewed subset atomically" }).click();
  await page.getByRole("button", { name: "Decisions", exact: true }).click();
  await expect(page.locator(".scope-candidate-card").filter({ hasText: "Application service" })).toHaveCount(2);
  const outcomes = await page.evaluate(() => window.__L2G_TEST__.store.document.state.scope.import_receipts.at(-1).diagnostics);
  expect(outcomes.filter(item => item.includes("keep-separate"))).toHaveLength(2);
});

test("diagram edges, keyboard alternative, controls, stale diagnostics, and superseding refresh remain non-destructive", async ({ page }) => {
  await openScope(page);
  await page.getByRole("button", { name: "Diagrams", exact: true }).click();
  const original = page.locator(".scope-diagram-card").filter({ hasText: "Synthetic boundary diagram" }).first();
  await expect(original.locator(".scope-diagram-edges line")).toHaveCount(1);
  await expect(original.getByRole("button", { name: "Fit" })).toBeVisible();
  await original.getByText("Nodes and relationships").click();
  await expect(original.getByRole("heading", { name: "Relationships" })).toBeVisible();
  await original.getByRole("button", { name: "Mark reviewed" }).click();
  await page.evaluate(() => {
    const hooks = window.__L2G_TEST__;
    hooks.store.execute("scope.test.stale-diagram", "scope_asset", "scope-test-stale-diagram", "Changed exact asset version.", document => {
      const asset = document.state.scope.assets[0];
      asset.version++;
      asset.updated_at = new Date().toISOString();
      document.state.scope.revision++;
    });
  });
  await page.getByRole("button", { name: "Diagrams", exact: true }).click();
  const stale = page.locator(".scope-diagram-card").filter({ hasText: "Synthetic boundary diagram" }).first();
  await expect(stale.getByText("This representation is stale.")).toBeVisible();
  await stale.getByRole("button", { name: "Create refreshed draft" }).click();
  await expect(page.locator(".scope-diagram-card").filter({ hasText: "Synthetic boundary diagram — refreshed" })).toBeVisible();
  await expect(page.locator(".scope-diagram-card").filter({ hasText: "Synthetic boundary diagram" }).first()).toContainText("Superseded");
  const state = await page.evaluate(() => {
    const diagrams = window.__L2G_TEST__.store.document.state.scope.diagrams;
    const prior = diagrams.find(item => item.label === "Synthetic boundary diagram");
    const next = diagrams.find(item => item.supersedes_id === prior.id);
    return { count: diagrams.length, priorId: prior.id, priorNext: prior.superseded_by_id, nextId: next.id, nextPrior: next.supersedes_id, nextReview: next.diagram_review_state };
  });
  expect(state.count).toBe(2);
  expect(state.priorNext).toBe(state.nextId);
  expect(state.nextPrior).toBe(state.priorId);
  expect(state.nextReview).toBe("draft");
});

test("Unknown publication creates one draft Session Planner question and zero live agenda additions", async ({ page }) => {
  await openScope(page);
  const before = await page.evaluate(() => ({ questions: window.__L2G_TEST__.store.document.state.interviews.questions.length, planItems: window.__L2G_TEST__.store.document.state.interviews.plans.flatMap(plan => plan.items).length }));
  await page.getByRole("button", { name: /Confirm provider support access/i }).first().click();
  await page.getByRole("button", { name: "Publish question candidate" }).click();
  await expect(page.getByRole("heading", { name: "Publish question candidate" })).toBeVisible();
  await page.getByRole("button", { name: "Create question candidate" }).click();
  const after = await page.evaluate(() => ({ questions: window.__L2G_TEST__.store.document.state.interviews.questions.length, planItems: window.__L2G_TEST__.store.document.state.interviews.plans.flatMap(plan => plan.items).length, question: window.__L2G_TEST__.store.document.state.interviews.questions.at(-1), unknownRef: window.__L2G_TEST__.store.document.state.scope.unknowns[0].session_question_candidate_ref }));
  expect(after.questions).toBe(before.questions + 1);
  expect(after.planItems).toBe(before.planItems);
  expect(after.question.lifecycle).toBe("draft");
  expect(after.question.question_id).toBe(after.unknownRef);
  await expect(page.getByText(/not added to a live agenda or accepted as a client statement/)).toBeVisible();
});

test("Reviewer supports Concur with changes without direct object mutation", async ({ page }) => {
  await openScope(page);
  const original = await page.evaluate(() => window.__L2G_TEST__.store.document.state.scope.assets[0].scope_disposition);
  await switchProfile(page, "reviewer");
  await page.getByRole("button", { name: "Decisions", exact: true }).click();
  await page.getByRole("button", { name: "Concur with changes" }).click();
  const dispositionRow = page.locator(".scope-change-row").filter({ hasText: "Scope Disposition" });
  await dispositionRow.locator("input[data-v06-review-change]").fill("accepted-out-of-scope");
  await page.locator("#v06-review-comment").fill("Concur with the modified disposition for Advisor acceptance.");
  await page.getByRole("button", { name: "Record Concur With Changes" }).click();
  const state = await page.evaluate(() => ({ disposition: window.__L2G_TEST__.store.document.state.scope.decisions[0].reviewer_disposition, proposed: window.__L2G_TEST__.store.document.state.scope.decisions[0].field_changes.find(change => change.field === "scope_disposition").new_value, object: window.__L2G_TEST__.store.document.state.scope.assets[0].scope_disposition }));
  expect(state.disposition).toBe("concur-with-changes");
  expect(state.proposed).toBe("accepted-out-of-scope");
  expect(state.object).toBe(original);
});

test("migrated empty Scope remains no-inference and exposes bounded start actions", async ({ page }) => {
  await openScope(page);
  await page.evaluate(() => {
    const hooks = window.__L2G_TEST__;
    const document = structuredClone(hooks.store.document);
    document.state.scope = window.L2G.emptyScopeDomain();
    hooks.store.replace(document, true);
  });
  await expect(page.getByText("Nothing was inferred from the prior project.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Import Scoper package" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Review source candidates" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Add boundary proposal" })).toBeVisible();
  const counts = await page.evaluate(() => { const scope = window.__L2G_TEST__.store.document.state.scope; return Object.fromEntries(["boundaries", "systems", "assets", "providers", "services", "data_flows", "decisions", "diagrams"].map(key => [key, scope[key].length])); });
  expect(Object.values(counts).every(value => value === 0)).toBe(true);
});

test("keyboard search, list navigation, Escape, and focus restoration work without pointer-only actions", async ({ page }) => {
  await openScope(page);
  await page.getByRole("button", { name: "Systems & Assets", exact: true }).click();
  await page.keyboard.press("/");
  await expect(page.locator("#v06-search")).toBeFocused();
  await page.locator("#v06-search").fill("Application service");
  const asset = page.getByRole("button", { name: /Application service/i }).first();
  await asset.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Application service" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#scope-title")).toBeFocused();
});

test("responsive light/dark Advisor, Client, and Reviewer matrix remains usable and non-disclosing", async ({ page }, testInfo) => {
  test.setTimeout(240000);
  const viewports = [{ width: 1440, height: 900, name: "1440x900" }, { width: 1280, height: 720, name: "1280x720" }, { width: 1024, height: 768, name: "1024x768" }];
  for (const viewport of viewports) {
    for (const theme of ["light", "dark"]) {
      for (const profile of ["advisor", "client", "reviewer"]) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.emulateMedia({ colorScheme: theme });
        await openScope(page);
        if (profile !== "advisor") await switchProfile(page, profile);
        await page.getByRole("button", { name: "Diagrams", exact: true }).click();
        const noOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
        expect(noOverflow, `${viewport.name} ${theme} ${profile} horizontal overflow`).toBe(true);
        await page.screenshot({ path: testInfo.outputPath(`v061-${viewport.name}-${theme}-${profile}.png`), fullPage: true });
        expect(await seriousAxeViolations(page), `${viewport.name} ${theme} ${profile} axe`).toEqual([]);
      }
    }
  }
});
