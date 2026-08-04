import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import path from "node:path";
import { openV04, repoRoot, syntheticPassphrase, enterPassphrase } from "./integrated-suite-v04-helpers.mjs";

async function openEvidence(page) {
  await page.getByRole("button", { name: /Evidence/ }).click();
  await expect(page.getByRole("heading", { name: "Evidence", exact: true })).toBeVisible();
}

async function addSyntheticSource(page, name, content, label = name.replace(/\.[^.]+$/, "")) {
  await page.locator("#evidence-add-input").setInputFiles({ name, mimeType: "text/plain", buffer: Buffer.from(content) });
  await expect(page.locator("[data-staged-card]")).toBeVisible({ timeout: 15000 });
  await page.locator('[data-staged-field="display_label"]').last().fill(label);
  await page.getByRole("button", { name: "Commit staged sources" }).click();
  await expect(page.getByText(label, { exact: true })).toBeVisible();
}

test("renders the eight-workspace Evidence shell with restrictive CSP and zero network", async ({ page }) => {
  const requests = await openV04(page);
  await expect(page).toHaveTitle(/Evidence Catalog Core/);
  await expect(page.locator('[data-workspace]')).toHaveCount(8);
  await expect(page.getByText("v0.4.0 · Evidence Catalog Core")).toBeVisible();
  const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute("content");
  expect(csp).toContain("default-src 'none'");
  expect(csp).toContain("connect-src 'none'");
  expect(csp).toContain("worker-src blob:");
  expect(requests).toEqual([]);
});

test("filters Client Evidence before render, search, counts, and inspector", async ({ page }) => {
  await openV04(page);
  await page.locator("#profile-select").selectOption("client");
  await openEvidence(page);
  const body = page.locator("body");
  await expect(body).not.toContainText("McFirecoal_Synthetic_Network_Diagram.pdf");
  await expect(body).not.toContainText("Synthetic intake copy of network diagram");
  await expect(body).not.toContainText("2f7e1f9bd2a87f2d478b5bb8feef5f3db8f6804f75b1f543cf49d15837f8e0a4");
  await expect(page.getByText("Current network diagram", { exact: true })).toBeVisible();
  await page.locator("#evidence-search").fill("McFirecoal");
  await expect(page.getByText("No approved evidence references match this search.")).toBeVisible();
  await page.locator("#evidence-search").fill("Current network diagram");
  await expect(page.getByRole("button", { name: /Source: Current network diagram/ })).toBeVisible();
  await page.getByRole("button", { name: /Source: Current network diagram/ }).click();
  await expect(page.getByRole("dialog")).toContainText("Approved presentation detail");
  await expect(page.getByRole("dialog")).not.toContainText("SHA-256");
});

test("hashes and atomically registers a source without persisting original bytes", async ({ page }) => {
  await openV04(page);
  await openEvidence(page);
  await page.locator("#evidence-add-input").setInputFiles({ name: "Synthetic_New_Evidence.txt", mimeType: "text/plain", buffer: Buffer.from("synthetic original bytes must remain external") });
  await expect(page.locator("[data-staged-card]")).toBeVisible({ timeout: 15000 });
  await expect(page.locator("[data-staged-card] .fingerprint")).toHaveText(/^[0-9a-f]{64}$/);
  await page.locator('[data-staged-field="display_label"]').fill("Synthetic New Evidence");
  await page.locator('[data-staged-field="client_label"]').fill("Approved synthetic evidence reference");
  await page.locator('[data-staged-field="visibility"]').selectOption("approved-for-client-presentation");
  await page.getByRole("button", { name: "Commit staged sources" }).click();
  await expect(page.getByText("Synthetic New Evidence", { exact: true })).toBeVisible();
  const serializedContainsBytes = await page.evaluate(async () => {
    const hooks = window.__L2G_TEST__;
    const bytes = await hooks.serializeInnerProject(hooks.store.document);
    return new TextDecoder().decode(bytes).includes("synthetic original bytes must remain external");
  });
  expect(serializedContainsBytes).toBe(false);
});

test("relinks exact bytes and creates a new revision for changed bytes", async ({ page }) => {
  await openV04(page);
  await openEvidence(page);
  await addSyntheticSource(page, "Synthetic_Relink.txt", "version one", "Synthetic Relink Source");
  let row = page.locator("tr", { hasText: "Synthetic Relink Source" });
  await row.getByRole("button", { name: "Relink" }).click();
  await page.locator("#evidence-relink-input").setInputFiles({ name: "Synthetic_Relink.txt", mimeType: "text/plain", buffer: Buffer.from("version one") });
  await expect(page.getByText("Exact byte match linked for this session.")).toBeVisible({ timeout: 15000 });
  row = page.locator("tr", { hasText: "Synthetic Relink Source" });
  await row.getByRole("button", { name: "Relink" }).click();
  await page.locator("#evidence-relink-input").setInputFiles({ name: "Synthetic_Relink.txt", mimeType: "text/plain", buffer: Buffer.from("version two changed") });
  const mismatch = page.getByRole("dialog").filter({ hasText: "Hash mismatch" });
  await expect(mismatch).toBeVisible({ timeout: 15000 });
  await mismatch.getByRole("button", { name: "Create new revision" }).click();
  const revision = page.getByRole("dialog").filter({ hasText: "Create source revision" });
  await expect(revision).toBeVisible();
  await revision.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("New source revision created; prior fingerprint preserved.")).toBeVisible();
  const state = await page.evaluate(() => {
    const evidence = window.__L2G_TEST__.store.document.state.evidence;
    const prior = evidence.sources.find(item => item.display_label === "Synthetic Relink Source");
    const next = evidence.sources.find(item => item.display_label === "Synthetic Relink Source revision");
    return { priorLifecycle: prior?.lifecycle, changed: prior?.fingerprint?.sha256 !== next?.fingerprint?.sha256, related: evidence.relationships.some(item => item.relationship_type === "revision-of" && item.from_ref === next?.evidence_id && item.to_ref === prior?.evidence_id) };
  });
  expect(state).toEqual({ priorLifecycle: "superseded", changed: true, related: true });
});

test("requires explicit duplicate disposition and target-owned candidate publication", async ({ page }) => {
  await openV04(page);
  await openEvidence(page);
  await page.getByRole("tab", { name: "Duplicates & Revisions" }).click();
  await expect(page.getByText("unresolved", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Resolve: first primary, others duplicate" }).click();
  await expect(page.getByText("resolved", { exact: true })).toBeVisible();
  await page.getByRole("tab", { name: "Candidate Mappings" }).click();
  const before = await page.evaluate(() => window.__L2G_TEST__.store.document.state.engagement.identity.delivery_context);
  await page.getByRole("button", { name: "Publish to Engagement candidate" }).click();
  await expect(page.getByText("Published to an Engagement-owned candidate. Accepted Engagement state remains unchanged.")).toBeVisible();
  const after = await page.evaluate(() => window.__L2G_TEST__.store.document.state.engagement.identity.delivery_context);
  expect(after).toBe(before);
  await page.getByRole("button", { name: /Reviews & Actions/ }).click();
  await expect(page.getByRole("heading", { name: "Engagement candidate" })).toHaveCount(2);
  const published = await page.evaluate(() => window.__L2G_TEST__.store.document.state.engagement.candidates.some(item => item.source_kind === "evidence-candidate-mapping" && item.state === "candidate"));
  expect(published).toBe(true);
});

test("previews and atomically applies a recognized synthetic package", async ({ page }) => {
  await openV04(page);
  await openEvidence(page);
  const digest = "6f5902ac237024bdd0c176cb93063dc4".padEnd(64, "0");
  const payload = {
    package_kind: "l2g_intake_package_v1", version: "1.0", producer_version: "7.9.5.1",
    source_documents: [{ source_document_id: "sd_browser_001", name: "Synthetic_Imported_Architecture.pdf", sha256: digest, size_bytes: 21 }],
    evidence_records: [{ record_id: "record_browser_001", source_document_id: "sd_browser_001", title: "Synthetic browser import", summary: "Bounded synthetic import summary.", source_location: { page: 2, label: "Page 2" }, target_domain: "engagement", target_type: "open-question", fields: { environment: "Synthetic" } }]
  };
  await page.locator("#package-import-input").setInputFiles({ name: "Synthetic_Intake.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(payload)) });
  await expect(page.getByRole("heading", { name: "l2g_intake_package_v1 1.0" })).toBeVisible();
  await expect(page.getByText("1", { exact: true })).toHaveCount(3);
  await page.getByRole("button", { name: "Apply reviewed valid set atomically" }).click();
  await expect(page.getByText("Reviewed valid package records applied atomically. Target authority remains unchanged.")).toBeVisible();
  await expect(page.getByText("Synthetic Imported Architecture", { exact: true })).toBeVisible();
});

test("creates encrypted save, locks, and restores encrypted recovery", async ({ page }) => {
  await openV04(page);
  await page.evaluate(() => Object.defineProperty(window, "showSaveFilePicker", { value: undefined, configurable: true }));
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Save encrypted" }).click();
  await enterPassphrase(page, "Protect project", syntheticPassphrase, true);
  const download = await downloadPromise;
  const saved = path.join(repoRoot, "test-results", "synthetic-v04-browser.l2g");
  fs.mkdirSync(path.dirname(saved), { recursive: true });
  await download.saveAs(saved);
  const savedBytes = fs.readFileSync(saved);
  expect(savedBytes.includes(Buffer.from("McFirecoal_Synthetic_Network_Diagram.pdf"))).toBe(false);
  await page.getByRole("button", { name: "Lock" }).click();
  await expect(page.getByRole("heading", { name: "L2G project locked" })).toBeVisible();
  await page.locator("#unlock-passphrase").fill(syntheticPassphrase);
  await page.getByRole("button", { name: "Unlock recovery" }).click();
  await expect(page.getByRole("heading", { name: "Engagement overview" })).toBeVisible();
  await expect(page.getByText("McFirecoal Synthetic CMMC Engagement", { exact: true })).toBeVisible();
});

test("passes accessibility in Advisor, Client, Reviewer, and narrow responsive views", async ({ page }) => {
  await openV04(page);
  await openEvidence(page);
  for (const profile of ["advisor", "client", "reviewer"]) {
    await page.locator("#profile-select").selectOption(profile);
    const result = await new AxeBuilder({ page }).analyze();
    expect(result.violations.filter(item => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
  }
  await page.setViewportSize({ width: 720, height: 900 });
  await page.locator("#profile-select").selectOption("advisor");
  await expect(page.locator(".table-wrap tr").first()).toBeVisible();
  const narrow = await new AxeBuilder({ page }).analyze();
  expect(narrow.violations.filter(item => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
});
