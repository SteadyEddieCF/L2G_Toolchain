import { test, expect } from "@playwright/test";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { openV05, repoRoot, enterPassphrase } from "./integrated-suite-v05-helpers.mjs";

const legacyMigrationPassphrase = "Synthetic-V05-Legacy-Migration-Passphrase";
const v05AppRoot = path.join(repoRoot, "apps", "integrated-suite-v0.5");
const legacyFixture = path.join(
  v05AppRoot,
  "build",
  "fixtures",
  "synthetic-v03-encrypted-project.l2g"
);

test.beforeAll(() => {
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  execFileSync(npm, ["--prefix", v05AppRoot, "run", "fixture:migration"], {
    cwd: repoRoot,
    stdio: "inherit"
  });
});

test("opens an encrypted v0.3 project through the real UI and migrates empty v0.5 authorities", async ({ page }) => {
  await openV05(page);
  await page.locator("#project-open-input").setInputFiles(legacyFixture);
  await enterPassphrase(page, "Unlock project", legacyMigrationPassphrase);
  await expect(page.getByRole("heading", { name: "Engagement overview" })).toBeVisible();
  await expect(page.getByText("Project migrated to v0.5. Save a new encrypted file.", { exact: true })).toBeVisible();

  const state = await page.evaluate(() => ({
    version: window.__L2G_TEST__.store.document.manifest.application.version,
    evidence: window.__L2G_TEST__.store.document.state.evidence.sources.length,
    requests: window.__L2G_TEST__.store.document.state.pre_engagement.requests.length,
    instruments: window.__L2G_TEST__.store.document.state.pre_engagement.instruments.length,
    responses: window.__L2G_TEST__.store.document.state.pre_engagement.responses.length,
    questions: window.__L2G_TEST__.store.document.state.interviews.questions.length,
    sessions: window.__L2G_TEST__.store.document.state.interviews.sessions.length,
    statements: window.__L2G_TEST__.store.document.state.interviews.participant_statements.length,
    notes: window.__L2G_TEST__.store.document.state.interviews.advisor_notes.length,
    historyAction: window.__L2G_TEST__.store.document.history.at(-1)?.action,
    checkpoint: window.__L2G_TEST__.store.document.checkpoints.at(-1)?.name,
    migrationNotice: window.__L2G_TEST__.store.migrationNotice
  }));

  expect(state).toEqual({
    version: "0.5.0",
    evidence: 0,
    requests: 0,
    instruments: 0,
    responses: 0,
    questions: 0,
    sessions: 0,
    statements: 0,
    notes: 0,
    historyAction: "project.migrated-v05",
    checkpoint: "Migration to v0.5 Pre-Engagement and Interview Sessions",
    migrationNotice: "Legacy project migrated. Save a new encrypted v0.5 project before continuing consequential work."
  });

  await page.getByRole("button", { name: /Pre-Engagement/ }).click();
  await expect(page.getByRole("heading", { name: "Pre-Engagement", exact: true })).toBeVisible();
  await expect(page.getByText("No profile-visible intake requests are recorded.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Practice Review/ }).click();
  await expect(page.getByRole("heading", { name: "Practice Review · Interview Sessions", exact: true })).toBeVisible();
  await expect(page.getByText("No profile-visible Interview sessions are recorded.", { exact: true })).toBeVisible();
});
