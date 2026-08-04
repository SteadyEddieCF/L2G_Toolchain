import { test, expect } from "@playwright/test";
import crypto from "node:crypto";
import { openV05 } from "./integrated-suite-v05-helpers.mjs";

test("previews and atomically applies stable meeting context without creating testimony", async ({ page }) => {
  await openV05(page);
  await page.getByRole("button", { name: /Pre-Engagement/ }).click();
  await expect(page.getByRole("button", { name: "Import reviewed context" })).toBeVisible();

  const sourceBytes = Buffer.from("synthetic browser import source bytes");
  const sourceHash = crypto.createHash("sha256").update(sourceBytes).digest("hex");
  const payload = {
    package_kind: "l2g_meeting_context_v1",
    version: "1.0",
    producer_version: "synthetic-browser-test",
    source_documents: [{
      source_document_id: "source_browser_meeting",
      name: "Synthetic_Browser_Meeting.txt",
      sha256: sourceHash,
      size_bytes: sourceBytes.length,
      media_type: "text/plain"
    }],
    meeting_segments: [{
      record_id: "segment_browser_001",
      source_document_id: "source_browser_meeting",
      type: "meeting-segment",
      title: "Ask about synthetic access review cadence",
      summary: "Prior imported context mentioned a weekly review. It is not direct participant testimony.",
      source_location: { record_path: "meeting_segments[0]", label: "Synthetic meeting segment" }
    }]
  };
  const before = await page.evaluate(() => ({
    evidence: window.__L2G_TEST__.store.document.state.evidence.sources.length,
    questions: window.__L2G_TEST__.store.document.state.interviews.questions.length,
    statements: window.__L2G_TEST__.store.document.state.interviews.participant_statements.length,
    receipts: window.__L2G_TEST__.store.document.state.interviews.import_receipts.length
  }));

  await page.getByRole("button", { name: "Import reviewed context" }).click();
  await page.locator("#v05-package-import-input").setInputFiles({
    name: "synthetic-meeting-context-v1.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(payload))
  });
  const dialog = page.getByRole("dialog", { name: "Review compatibility import" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("l2g_meeting_context_v1 version 1.0", { exact: true })).toBeVisible();
  await expect(dialog).toContainText("No participant statement");
  await expect(dialog).toContainText("Preview only. No governed state has changed.");
  expect(await page.evaluate(() => ({
    evidence: window.__L2G_TEST__.store.document.state.evidence.sources.length,
    questions: window.__L2G_TEST__.store.document.state.interviews.questions.length,
    statements: window.__L2G_TEST__.store.document.state.interviews.participant_statements.length,
    receipts: window.__L2G_TEST__.store.document.state.interviews.import_receipts.length
  }))).toEqual(before);

  await dialog.getByRole("button", { name: "Apply reviewed records" }).click();
  await expect(page.getByText("Reviewed package records applied atomically; original package bytes were not retained.")).toBeVisible();
  const after = await page.evaluate(() => ({
    evidence: window.__L2G_TEST__.store.document.state.evidence.sources.length,
    questions: window.__L2G_TEST__.store.document.state.interviews.questions.length,
    statements: window.__L2G_TEST__.store.document.state.interviews.participant_statements.length,
    receipts: window.__L2G_TEST__.store.document.state.interviews.import_receipts.length,
    origin: window.__L2G_TEST__.store.document.state.interviews.questions.at(-1).origin,
    visibility: window.__L2G_TEST__.store.document.state.interviews.questions.at(-1).visibility
  }));
  expect(after).toEqual({
    evidence: before.evidence + 1,
    questions: before.questions + 1,
    statements: before.statements,
    receipts: before.receipts + 1,
    origin: "imported-context",
    visibility: "advisor-only"
  });

  await page.locator("#profile-select").selectOption("client");
  await page.getByRole("button", { name: /Practice Review/ }).click();
  await expect(page.locator("body")).not.toContainText("Ask about synthetic access review cadence");
});

test("rejects malformed package identity before governed mutation", async ({ page }) => {
  await openV05(page);
  await page.getByRole("button", { name: /Pre-Engagement/ }).click();
  const before = await page.evaluate(() => JSON.stringify(window.__L2G_TEST__.store.document.state));
  await page.getByRole("button", { name: "Import reviewed context" }).click();
  await page.locator("#v05-package-import-input").setInputFiles({
    name: "duplicate-key.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"package_kind":"l2g_intake_package_v1","package_kind":"x","version":"1.0"}')
  });
  await expect(page.getByText(/Import preview failed before mutation:.*Duplicate JSON key/i)).toBeVisible();
  const after = await page.evaluate(() => JSON.stringify(window.__L2G_TEST__.store.document.state));
  expect(after).toBe(before);
});
