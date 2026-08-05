import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "node:path";
import { pathToFileURL } from "node:url";

const artifact = pathToFileURL(path.join(process.cwd(), "apps/integrated-suite-v0.6/dist/L2G_Integrated_Suite_Scope_v0.6.0.html")).href;

async function openScope(page) {
  await page.goto(artifact, { waitUntil: "commit", timeout: 30000 });
  await page.locator('[data-workspace="scope"]').click();
  await expect(page.locator("#scope-title")).toBeVisible({ timeout: 30000 });
}

async function profile(page, value) {
  const select = page.locator("select").filter({ has: page.locator(`option[value="${value}"]`) }).first();
  await select.selectOption(value);
  await expect(page.locator("#scope-title")).toBeVisible();
}

async function seriousAxe(page) {
  const result = await new AxeBuilder({ page }).analyze();
  return result.violations.filter(item => ["serious", "critical"].includes(item.impact));
}

test("tablet empty inspector is absent and selected drawer is dismissible with focus restoration", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await openScope(page);
  for (const tab of ["Boundary", "Systems & Assets", "Providers & Services", "Data Flows", "Decisions", "Diagrams"]) {
    await page.getByRole("button", { name: tab, exact: true }).click();
    await expect(page.locator(".empty-inspector")).toBeHidden();
  }
  await page.getByRole("button", { name: "Systems & Assets", exact: true }).click();
  const asset = page.getByRole("button", { name: /Application service/i }).first();
  await asset.click();
  const drawer = page.locator(".scope-inspector-drawer");
  await expect(drawer).toBeVisible();
  await expect(drawer).toHaveAttribute("role", "dialog");
  await expect(page.locator("#scope-inspector-title")).toBeFocused();
  await drawer.getByRole("button", { name: "Close Scope inspector" }).click();
  await expect(asset).toBeFocused();
  await asset.click();
  await page.keyboard.press("Escape");
  await expect(asset).toBeFocused();
  expect(await seriousAxe(page)).toEqual([]);
});

test("inventory search preserves focus and caret during real sequential typing", async ({ page }) => {
  for (const viewport of [{ width: 1280, height: 720 }, { width: 1024, height: 768 }]) {
    await page.setViewportSize(viewport);
    await openScope(page);
    await page.getByRole("button", { name: "Systems & Assets", exact: true }).click();
    await page.keyboard.press("/");
    const search = page.locator("#v06-search");
    await search.pressSequentially("Application service", { delay: 15 });
    await expect(search).toHaveValue("Application service");
    await expect(search).toBeFocused();
    await expect(page.getByRole("button", { name: /Application service/i }).first()).toBeVisible();
    const selection = await search.evaluate(node => ({ start: node.selectionStart, end: node.selectionEnd, length: node.value.length }));
    expect(selection.start).toBe(selection.length);
    expect(selection.end).toBe(selection.length);
    await page.getByRole("button", { name: "Clear search" }).click();
    await expect(search).toHaveValue("");
    await expect(search).toBeFocused();
  }
});

test("diagram relationship alternatives open governed records and Fit uses visible bounds", async ({ page }) => {
  await openScope(page);
  await page.getByRole("button", { name: "Diagrams", exact: true }).click();
  let card = page.locator(".scope-diagram-card").first();
  await card.getByText("Nodes and relationships").click();
  const relationship = card.locator("[data-v06-edge]").first();
  const flowId = await page.evaluate(() => window.__L2G_TEST__.store.document.state.scope.data_flows[0].id);
  await relationship.click();
  await expect(page.locator("#scope-inspector-title")).toBeVisible();
  expect(await page.evaluate(() => window.L2G.v06Selected)).toBe(flowId);
  await page.getByRole("button", { name: "Close Scope inspector" }).click();

  await page.evaluate(() => {
    const hooks = window.__L2G_TEST__;
    hooks.store.execute("scope.test.proposal-edge", "scope_diagram", "proposal-edge", "Added proposal-only diagram relationship.", document => {
      const diagram = document.state.scope.diagrams[0];
      diagram.edge_records.push({ edge_id: "proposal-edge", from_node_id: diagram.node_records[0].node_id, to_node_id: diagram.node_records[1].node_id, relationship_ref: null, proposal_label: "Proposed support path" });
      diagram.version++;
      document.state.scope.revision++;
    });
    window.L2G.v06Render(document.getElementById("workspace"), hooks.store);
  });
  card = page.locator(".scope-diagram-card").first();
  await card.getByText("Nodes and relationships").click();
  await card.locator('[data-v06-edge="proposal-edge"]').click();
  await expect(page.locator("#v061-edge-placeholder")).toContainText("non-authoritative proposal relationship");

  for (const viewport of [{ width: 1440, height: 900 }, { width: 1280, height: 720 }, { width: 1024, height: 768 }]) {
    await page.setViewportSize(viewport);
    await page.getByRole("button", { name: "Diagrams", exact: true }).click();
    card = page.locator(".scope-diagram-card").first();
    await card.getByRole("button", { name: "Fit" }).click();
    const fit = await card.evaluate(article => {
      const canvas = article.querySelector(".scope-diagram-canvas").getBoundingClientRect();
      const nodes = [...article.querySelectorAll(".scope-diagram-node")].map(node => node.getBoundingClientRect());
      return nodes.every(node => node.left >= canvas.left - 1 && node.top >= canvas.top - 1 && node.right <= canvas.right + 1 && node.bottom <= canvas.bottom + 1);
    });
    expect(fit, `${viewport.width}x${viewport.height}`).toBe(true);
  }
  expect(await seriousAxe(page)).toEqual([]);
});

test("stale decision comparison creates and accepts a linked superseding draft", async ({ page }) => {
  await openScope(page);
  await page.getByRole("button", { name: "Decisions", exact: true }).click();
  await page.getByRole("button", { name: "Review atomic effects" }).click();
  await page.getByRole("button", { name: "Accept exact decision" }).click();
  await page.evaluate(() => {
    const hooks = window.__L2G_TEST__;
    hooks.store.execute("scope.test.version-drift", "scope_asset", "scope-test-version-drift", "Changed a referenced asset after decision acceptance.", document => {
      const asset = document.state.scope.assets[0];
      asset.description = "Changed after acceptance for stale-decision recovery testing.";
      asset.version++;
      asset.updated_at = new Date().toISOString();
      document.state.scope.revision++;
      window.L2G.refreshScopeCurrency(document.state.scope);
    });
    window.L2G.v06Render(document.getElementById("workspace"), hooks.store);
  });
  await page.getByRole("button", { name: "Decisions", exact: true }).click();
  await page.getByRole("button", { name: "Compare versions" }).click();
  await expect(page.getByRole("heading", { name: "Compare stale decision versions" })).toBeVisible();
  await expect(page.getByRole("table")).toContainText("Changed");
  const before = await page.evaluate(() => ({
    disposition: window.__L2G_TEST__.store.document.state.scope.assets[0].scope_disposition,
    category: window.__L2G_TEST__.store.document.state.scope.assets[0].asset_category,
    decisions: window.__L2G_TEST__.store.document.state.scope.decisions.length
  }));
  await page.getByRole("button", { name: "Create superseding draft" }).click();
  await expect(page.getByRole("heading", { name: "Review atomic effects" })).toBeVisible();
  const linked = await page.evaluate(() => {
    const decisions = window.__L2G_TEST__.store.document.state.scope.decisions;
    const prior = decisions.find(item => item.decision_state === "accepted" && item.currency_state === "stale");
    const next = decisions.find(item => item.supersedes_decision_ref === prior.id);
    const asset = window.__L2G_TEST__.store.document.state.scope.assets[0];
    return { count: decisions.length, priorState: prior.decision_state, reciprocal: prior.superseded_by_decision_ref === next.id, nextState: next.decision_state, disposition: asset.scope_disposition, category: asset.asset_category };
  });
  expect(linked.count).toBe(before.decisions + 1);
  expect(linked.priorState).toBe("accepted");
  expect(linked.reciprocal).toBe(true);
  expect(linked.nextState).toBe("proposed");
  expect(linked.disposition).toBe(before.disposition);
  expect(linked.category).toBe(before.category);
  await page.getByRole("button", { name: "Accept exact decision" }).click();
  const final = await page.evaluate(() => {
    const decisions = window.__L2G_TEST__.store.document.state.scope.decisions;
    const prior = decisions.find(item => item.decision_state === "superseded");
    const next = decisions.find(item => item.supersedes_decision_ref === prior.id);
    return { priorState: prior.decision_state, priorCurrency: prior.currency_state, nextState: next.decision_state, nextCurrency: next.currency_state, reciprocal: prior.superseded_by_decision_ref === next.id };
  });
  expect(final).toEqual({ priorState: "superseded", priorCurrency: "superseded", nextState: "accepted", nextCurrency: "current", reciprocal: true });
});

test("Reviewer terminal decisions expose no actions and reject direct disposition commands", async ({ page }) => {
  await openScope(page);
  await page.evaluate(() => {
    const hooks = window.__L2G_TEST__;
    const decision = hooks.store.document.state.scope.decisions[0];
    decision.decision_state = "rejected";
    decision.review_state = "rejected";
    decision.version++;
    window.L2G.v06Render(document.getElementById("workspace"), hooks.store);
  });
  await profile(page, "reviewer");
  await page.getByRole("button", { name: "Decisions", exact: true }).click();
  await expect(page.locator("[data-v06-review]")).toHaveCount(0);
  const message = await page.evaluate(() => {
    const scope = window.__L2G_TEST__.store.document.state.scope;
    try {
      window.L2G.recordScopeReviewerDisposition(scope, scope.decisions[0].id, "concur", "", "reviewer");
      return "no error";
    } catch (error) {
      return error.message;
    }
  });
  expect(message).toMatch(/terminal or non-reviewable decision state/i);
});

test("Unknown publication review exposes exact Scope versions", async ({ page }) => {
  await openScope(page);
  const identities = await page.evaluate(() => {
    const scope = window.__L2G_TEST__.store.document.state.scope;
    const unknown = scope.unknowns[0];
    const map = window.L2G.scopeRecordMap(scope);
    return { unknown: `${unknown.id} · version ${unknown.version}`, affected: unknown.affected_refs.map(id => `${id} · version ${map.get(id).version}`) };
  });
  await page.getByRole("button", { name: /Confirm provider support access/i }).first().click();
  await page.getByRole("button", { name: "Publish question candidate" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText(identities.unknown);
  for (const identity of identities.affected) await expect(dialog).toContainText(identity);
  await expect(dialog).toContainText("bounded Scope source reference");
});

test("mixed exact, same-name, and new Scoper records require independent treatments", async ({ page }) => {
  await openScope(page);
  const fixture = await page.evaluate(() => {
    const asset = window.__L2G_TEST__.store.document.state.scope.assets[0];
    return {
      kind: "l2g_scope_return_package_v1",
      version: "1.0",
      producer: "Synthetic Scoper v3.12 mixed browser fixture",
      assets: [
        { id: asset.identifier_summary, name: "Exact application asset", type: "cloud-resource" },
        { id: "same-name-distinct", name: asset.client_label, type: "server" },
        { id: "genuinely-new", name: "New synthetic endpoint", type: "endpoint" }
      ]
    };
  });
  const chooser = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Import Scoper package" }).click();
  (await chooser).setFiles({ name: "mixed-identity.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(fixture)) });
  const rows = page.locator(".scope-import-records fieldset");
  await expect(rows).toHaveCount(3);
  const exact = rows.filter({ hasText: "Exact application asset" });
  const same = rows.filter({ hasText: "Application service" });
  const fresh = rows.filter({ hasText: "New synthetic endpoint" });
  await expect(exact.locator("select[data-v06-treatment]")).toHaveValue("link");
  await expect(exact.locator("select[data-v06-target]")).not.toHaveValue("");
  await expect(page.getByRole("button", { name: "Apply reviewed subset atomically" })).toBeDisabled();
  await same.locator("select[data-v06-treatment]").selectOption("keep-separate");
  await expect(fresh.locator("select[data-v06-treatment]")).toHaveValue("create");
  await page.getByRole("button", { name: "Apply reviewed subset atomically" }).click();
  const result = await page.evaluate(() => {
    const scope = window.__L2G_TEST__.store.document.state.scope;
    const receipt = scope.import_receipts.at(-1);
    const imported = scope.candidates.filter(item => [
      "assets:same-name-distinct",
      "assets:genuinely-new"
    ].includes(item.proposed_values.source_import_record_id));
    return { selected: receipt.selected_record_ids.length, candidateTreatments: imported.map(item => item.proposed_values.identity_treatment), acceptedFields: scope.assets[0].scope_disposition };
  });
  expect(result.selected).toBe(3);
  expect(result.candidateTreatments.sort()).toEqual(["create", "keep-separate"]);
  expect(result.acceptedFields).toBe("proposed-in-scope");
});
