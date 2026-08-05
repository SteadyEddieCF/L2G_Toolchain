import { test, expect } from "@playwright/test";
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

async function acceptSyntheticDecision(page) {
  await page.getByRole("button", { name: "Decisions", exact: true }).click();
  await page.getByRole("button", { name: "Accept exact decision" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Review Scope decision effects" })).toBeVisible();
  await dialog.getByRole("button", { name: "Accept selected Scope changes" }).click();
}

test("v0.6.1 preserves reviewed diagram and creates reciprocal superseding draft", async ({ page }) => {
  await openScope(page);
  await page.getByRole("button", { name: "Diagrams", exact: true }).click();
  const priorCard = page.locator(".scope-diagram-card").filter({ hasText: "Synthetic boundary diagram" }).first();
  await priorCard.getByRole("button", { name: "Mark reviewed" }).click();
  const baseline = await page.evaluate(() => {
    const scope = window.__L2G_TEST__.store.document.state.scope;
    const prior = scope.diagrams.find(item => item.label === "Synthetic boundary diagram");
    return {
      id: prior.id,
      refs: JSON.stringify(prior.included_record_refs),
      object: JSON.stringify(scope.assets[0])
    };
  });

  await acceptSyntheticDecision(page);
  await page.getByRole("button", { name: "Diagrams", exact: true }).click();
  const staleCard = page.locator(".scope-diagram-card").filter({ hasText: "Synthetic boundary diagram" }).first();
  await expect(staleCard).toContainText("Stale");
  await staleCard.getByRole("button", { name: "Refresh exact versions" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Create refreshed diagram draft" })).toBeVisible();
  await expect(dialog).toContainText(/prior representation remains preserved/i);
  await dialog.getByRole("button", { name: "Preserve prior and create refreshed draft" }).click();
  await expect(dialog).toHaveCount(0);

  const oldCard = page.locator(".scope-diagram-card").filter({ hasText: "Synthetic boundary diagram" }).first();
  const newCard = page.locator(".scope-diagram-card").filter({ hasText: "Refreshed draft of Synthetic boundary diagram" }).first();
  await expect(oldCard).toContainText("Superseded");
  await expect(newCard).toContainText("Draft");
  const result = await page.evaluate(priorId => {
    const scope = window.__L2G_TEST__.store.document.state.scope;
    const prior = scope.diagrams.find(item => item.id === priorId);
    const next = scope.diagrams.find(item => item.id === prior.superseded_by_id);
    return {
      priorRefs: JSON.stringify(prior.included_record_refs),
      priorSupersededBy: prior.superseded_by_id,
      nextId: next.id,
      nextSupersedes: next.supersedes_id,
      nextState: next.diagram_review_state,
      nextCurrent: next.included_record_refs.every(ref => scopeRecordVersion(scope, ref.id) === ref.version),
      object: JSON.stringify(scope.assets[0])
    };

    function scopeRecordVersion(scope, id) {
      const collections = [scope.boundaries, scope.systems, scope.assets, scope.providers, scope.services, scope.locations, scope.enclaves, scope.data_flows, scope.unknowns, scope.decisions, scope.diagrams];
      for (const collection of collections) {
        const record = collection.find(item => item.id === id);
        if (record) return record.version;
      }
      return null;
    }
  }, baseline.id);
  expect(result.priorRefs).toBe(baseline.refs);
  expect(result.priorSupersededBy).toBe(result.nextId);
  expect(result.nextSupersedes).toBe(baseline.id);
  expect(result.nextState).toBe("draft");
  expect(result.nextCurrent).toBe(true);
  expect(result.object).not.toBe(baseline.object);
  const afterAcceptanceBeforeRefresh = await page.evaluate(() => JSON.stringify(window.__L2G_TEST__.store.document.state.scope.assets[0]));
  expect(result.object).toBe(afterAcceptanceBeforeRefresh);
});

test("v0.6.1 exposes diagram presentation controls and ordered node and relationship equivalents", async ({ page }) => {
  await openScope(page);
  await page.getByRole("button", { name: "Diagrams", exact: true }).click();
  const card = page.locator(".scope-diagram-card").filter({ hasText: "Synthetic boundary diagram" }).first();
  for (const control of ["Fit", "100%", "Zoom out", "Zoom in", "Center selection"]) {
    await expect(card.getByRole("button", { name: control, exact: true })).toBeVisible();
  }
  await card.getByText("Nodes and relationships").click();
  await expect(card.getByRole("heading", { name: "Nodes" })).toBeVisible();
  await expect(card.getByRole("heading", { name: "Relationships" })).toBeVisible();
  const nodeButtons = card.locator("[data-v061-node-ref]:not([disabled])");
  const edgeButtons = card.locator("[data-v061-edge-ref]:not([disabled])");
  await expect(nodeButtons.first()).toBeVisible();
  await expect(edgeButtons.first()).toBeVisible();
  await card.getByRole("button", { name: "Zoom in" }).click();
  await expect(card.locator("[data-v061-zoom-status]")).toHaveText("110%");
  await edgeButtons.first().click();
  await expect(page.getByRole("button", { name: "Data Flows", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".scope-inspector-heading")).toContainText("Synthetic client upload flow");
});
