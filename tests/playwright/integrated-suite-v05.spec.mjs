import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import path from "node:path";
import { openV05, repoRoot, syntheticPassphrase, enterPassphrase } from "./integrated-suite-v05-helpers.mjs";

async function openPreEngagement(page) {
  await page.getByRole("button", { name: /Pre-Engagement/ }).click();
  await expect(page.getByRole("heading", { name: "Pre-Engagement", exact: true })).toBeVisible();
}

async function openInterviewSessions(page) {
  await page.getByRole("button", { name: /Practice Review/ }).click();
  await expect(page.getByRole("heading", { name: /Practice Review · Interview Sessions|Interview Mode/ })).toBeVisible();
}

test("builds the v0.5 portable shell with restrictive CSP and zero network", async ({ page }) => {
  const requests = await openV05(page);
  await expect(page).toHaveTitle(/v0\.5\.0.*Pre-Engagement and Interview Sessions/);
  await expect(page.locator('[data-workspace]')).toHaveCount(8);
  await expect(page.getByText("v0.5.0 · Pre-Engagement & Interviews", { exact: true })).toBeVisible();
  const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute("content");
  expect(csp).toContain("default-src 'none'");
  expect(csp).toContain("connect-src 'none'");
  expect(csp).toContain("worker-src blob:");
  expect(requests).toEqual([]);
});

test("reviews Pre-Engagement responses without changing origin or accepted target state", async ({ page }) => {
  await openV05(page);
  await openPreEngagement(page);
  await expect(page.getByText("advisor-entered-on-behalf", { exact: true })).toBeVisible();
  await expect(page.getByText(/assignments received/)).toBeVisible();
  const before = await page.evaluate(() => window.__L2G_TEST__.store.document.state.engagement.open_questions.length);
  await page.getByRole("button", { name: "Approve response" }).click();
  await expect(page.getByText("Response approved; its source origin was preserved.")).toBeVisible();
  await expect(page.getByText("advisor-entered-on-behalf", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Create proposal" }).click();
  await expect(page.getByText("Proposal queued without changing accepted Engagement records.")).toBeVisible();
  const state = await page.evaluate(() => ({
    openQuestions: window.__L2G_TEST__.store.document.state.engagement.open_questions.length,
    candidates: window.__L2G_TEST__.store.document.state.pre_engagement.candidates.length,
    origin: window.__L2G_TEST__.store.document.state.pre_engagement.responses[0].origin,
    review: window.__L2G_TEST__.store.document.state.pre_engagement.responses[0].review_state
  }));
  expect(state).toEqual({ openQuestions: before, candidates: 1, origin: "advisor-entered-on-behalf", review: "reviewed" });
});

test("facilitates a session with separate statements, Advisor notes, Client projection, confirmation, and recovery state", async ({ page }) => {
  await openV05(page);
  await openInterviewSessions(page);
  await page.getByRole("button", { name: "Start Interview Mode" }).click();
  await expect(page.getByRole("heading", { name: "Interview Mode", exact: true })).toBeVisible();
  await expect(page.getByText("1 of 1 planned questions", { exact: true })).toBeVisible();

  await page.locator('[data-v05-form="statement"] textarea[name="text"]').fill("The synthetic system owner reviews privileged access changes each week.");
  await page.locator('[data-v05-form="statement"]').getByRole("button", { name: "Record separate statement" }).click();
  await expect(page.getByText("Participant statement recorded as a separate locally asserted record.")).toBeVisible();

  await page.locator('[data-v05-form="note"] input[name="title"]').fill("Internal access concern");
  await page.locator('[data-v05-form="note"] textarea[name="text"]').fill("Advisor-only detail must never appear in Client Presentation Mode.");
  await page.locator('[data-v05-form="note"]').getByRole("button", { name: "Save Advisor-only note" }).click();
  await expect(page.getByText("Advisor-only note saved and excluded from Client projection.")).toBeVisible();
  await expect(page.getByText("Internal access concern", { exact: true })).toBeVisible();

  await page.locator("#profile-select").selectOption("client");
  await expect(page.getByRole("heading", { name: "Interview Mode", exact: true })).toBeVisible();
  await expect(page.locator("body")).not.toContainText("Internal access concern");
  await expect(page.locator("body")).not.toContainText("Advisor-only detail must never appear in Client Presentation Mode.");
  await expect(page.getByText("The synthetic system owner reviews privileged access changes each week.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Record read-back confirmation" }).click();
  await expect(page.getByText("Locally asserted confirmation recorded for the exact statement version.")).toBeVisible();
  await expect(page.getByText("Locally confirmed", { exact: true })).toBeVisible();

  await page.locator("#profile-select").selectOption("advisor");
  await page.getByRole("button", { name: "Pause and checkpoint" }).click();
  await expect(page.getByRole("button", { name: "Resume at recorded question" })).toBeVisible();
  let state = await page.evaluate(() => ({
    lifecycle: window.__L2G_TEST__.store.document.state.interviews.sessions[0].lifecycle,
    checkpoint: window.__L2G_TEST__.store.document.checkpoints.at(-1)?.name,
    noteVisibility: window.__L2G_TEST__.store.document.state.interviews.advisor_notes[0]?.visibility,
    confirmation: window.__L2G_TEST__.store.document.state.interviews.confirmations[0]?.state
  }));
  expect(state).toEqual({ lifecycle: "paused", checkpoint: "Interview session paused", noteVisibility: "advisor-only", confirmation: "confirmed" });

  await page.getByRole("button", { name: "Resume at recorded question" }).click();
  await page.getByRole("button", { name: "End session" }).click();
  await expect(page.getByText("Session completed; post-session review is pending.")).toBeVisible();
  await page.getByRole("button", { name: "Mark post-session review complete" }).click();
  await expect(page.getByText("Post-session review marked complete; proposals remain target-owned.")).toBeVisible();
  state = await page.evaluate(() => ({
    lifecycle: window.__L2G_TEST__.store.document.state.interviews.sessions[0].lifecycle,
    review: window.__L2G_TEST__.store.document.state.interviews.sessions[0].post_session_review_state,
    statements: window.__L2G_TEST__.store.document.state.interviews.participant_statements.length,
    notes: window.__L2G_TEST__.store.document.state.interviews.advisor_notes.length,
    confirmations: window.__L2G_TEST__.store.document.state.interviews.confirmations.length
  }));
  expect(state).toEqual({ lifecycle: "completed", review: "reviewed", statements: 1, notes: 1, confirmations: 1 });
});

test("saves an encrypted v0.5 project and restores encrypted recovery", async ({ page }) => {
  await openV05(page);
  await page.evaluate(() => Object.defineProperty(window, "showSaveFilePicker", { value: undefined, configurable: true }));
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Save encrypted" }).click();
  await enterPassphrase(page, "Protect project", syntheticPassphrase, true);
  const download = await downloadPromise;
  const saved = path.join(repoRoot, "test-results", "synthetic-v05-browser.l2g");
  fs.mkdirSync(path.dirname(saved), { recursive: true });
  await download.saveAs(saved);
  const savedBytes = fs.readFileSync(saved);
  expect(savedBytes.includes(Buffer.from("Synthetic foundational questionnaire"))).toBe(false);
  expect(savedBytes.includes(Buffer.from("Describe how the synthetic team reviews changes to privileged access"))).toBe(false);
  await page.getByRole("button", { name: "Lock" }).click();
  await expect(page.getByRole("heading", { name: "L2G project locked" })).toBeVisible();
  await page.locator("#unlock-passphrase").fill(syntheticPassphrase);
  await page.getByRole("button", { name: "Unlock recovery" }).click();
  await expect(page.getByRole("heading", { name: "Engagement overview" })).toBeVisible();
});

test("passes accessibility and responsive checks for Pre-Engagement and Interview profiles", async ({ page }) => {
  await openV05(page);
  for (const profile of ["advisor", "client", "reviewer"]) {
    await page.locator("#profile-select").selectOption(profile);
    await openPreEngagement(page);
    let result = await new AxeBuilder({ page }).analyze();
    expect(result.violations.filter(item => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
    await openInterviewSessions(page);
    result = await new AxeBuilder({ page }).analyze();
    expect(result.violations.filter(item => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
  }
  await page.setViewportSize({ width: 720, height: 900 });
  await page.locator("#profile-select").selectOption("advisor");
  await openPreEngagement(page);
  await expect(page.getByRole("heading", { name: "Pre-Engagement", exact: true })).toBeVisible();
  const narrow = await new AxeBuilder({ page }).analyze();
  expect(narrow.violations.filter(item => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
});
