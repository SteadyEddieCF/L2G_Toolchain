import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  EXPECTED_RG4_PROFILE_SHA256,
  UNSUPPORTED_SYNTHETIC_HISTORY_PATH,
  captureIsolationState,
  createChangedSourceSnapshot,
  createSupportedCurrentPair,
  exportSspReturn,
  findForbiddenReturnLeakage,
  historyIdentity,
  installFixedClock,
  observeBrowser,
  openSspRuntime,
  previewWorkshopHandoff,
  readJson,
  recordSupportedCurrentEvidence,
  sha256Json,
  verifyStaticFixtureHashes,
} from './ssp-rg4-history-harness-fixture.mjs';

const FIXED_ACCEPTED_AT = '2026-07-31T18:45:00.000Z';

test.describe.configure({ mode: 'serial' });

test('unsupported synthetic RG-4 history seeds normalize away through direct hook, backup, and local-storage restore paths', async ({ page, browser }, testInfo) => {
  test.setTimeout(240000);
  const fixtureHashes = verifyStaticFixtureHashes();
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ssp-rg4-history-normalization-'));
  const pair = await createSupportedCurrentPair(browser, temp);
  const unsupported = readJson(UNSUPPORTED_SYNTHETIC_HISTORY_PATH);
  const observed = observeBrowser(page);
  await installFixedClock(page, FIXED_ACCEPTED_AT);
  await openSspRuntime(page, pair.sourceSnapshot);

  const direct = await page.evaluate((seed) => {
    const normalized = window.__sspRg4TestHooks.normalizeHistory([seed]);
    window.__sspRg4TestHooks.setHistory([seed]);
    return {
      normalizedCount: normalized.length,
      storedCount: window.__sspRg4TestHooks.getHistory().length,
      sourcePackageFingerprint: seed.packageFingerprint || seed.package_fingerprint || seed.sidecar?.package_fingerprint || '',
    };
  }, unsupported);
  expect(direct).toEqual({ normalizedCount: 0, storedCount: 0, sourcePackageFingerprint: '' });

  const backupPath = await page.evaluate((seed) => {
    const backup = window.__sspTestHooks.collectData(false);
    backup.wordQaSidecarEvidence = [seed];
    window.__sspTestHooks.applyData(backup);
    return {
      historyCount: window.__sspRg4TestHooks.getHistory().length,
      normalizedBackupCount: window.__sspTestHooks.collectData(false).wordQaSidecarEvidence.length,
    };
  }, unsupported);
  expect(backupPath).toEqual({ historyCount: 0, normalizedBackupCount: 0 });

  const storageResult = await page.evaluate((seed) => {
    const backup = window.__sspTestHooks.collectData(false);
    backup.wordQaSidecarEvidence = [seed];
    localStorage.setItem(window.__sspTestHooks.STORAGE_KEY, JSON.stringify(backup));
    return { storageKey: window.__sspTestHooks.STORAGE_KEY, injectedCount: backup.wordQaSidecarEvidence.length };
  }, unsupported);
  expect(storageResult.injectedCount).toBe(1);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(window.__sspRg4TestHooks));
  expect(await page.locator('.control-card').count()).toBe(110);
  expect(await page.evaluate(() => window.__sspRg4TestHooks.getHistory().length)).toBe(0);

  const evidence = {
    evidence_kind: 'ssp_rg4_unsupported_synthetic_history_normalization',
    fixture_hashes: fixtureHashes,
    unsupported_seed_canonical_json_sha256: sha256Json(unsupported),
    direct_hook: direct,
    backup_restore: backupPath,
    local_storage_restore: {
      storage_key: storageResult.storageKey,
      injected_count: storageResult.injectedCount,
      restored_history_count: 0,
    },
    normalization_rule: 'rg4NormalizeHistory maps through rg4NormalizeRecord, then filters records without a non-empty packageFingerprint and de-duplicates by packageFingerprint.',
    supported_workflow_defect_reproduced: false,
  };
  await testInfo.attach('RG4_UNSUPPORTED_SYNTHETIC_HISTORY_NORMALIZATION.json', {
    body: Buffer.from(JSON.stringify(evidence, null, 2)),
    contentType: 'application/json',
  });

  expect(observed.externalRequests).toEqual([]);
  expect(observed.pageErrors).toEqual([]);
  expect(observed.consoleErrors).toEqual([]);
  fs.rmSync(temp, { recursive: true, force: true });
});

test('supported populated RG-4 history survives Workshop Handoff preview, backup/restore, reload, and SSP Return isolation', async ({ page, browser }, testInfo) => {
  test.setTimeout(300000);
  const fixtureHashes = verifyStaticFixtureHashes();
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ssp-rg4-history-populated-'));
  const returnPath = path.join(temp, 'ssp-return.json');
  const pair = await createSupportedCurrentPair(browser, temp);
  const observed = observeBrowser(page);
  await installFixedClock(page, FIXED_ACCEPTED_AT);
  await openSspRuntime(page, pair.sourceSnapshot);

  const accepted = await recordSupportedCurrentEvidence(page, pair, {
    localId: 'rg4-history-harness-supported',
    displayName: 'RG-4 History Harness Supported Reviewer',
  });
  expect(accepted.record).toMatchObject({
    packageFingerprint: pair.sidecar.package_fingerprint,
    sidecarId: pair.sidecar.sidecar_id,
    producerQaState: 'qa_complete',
    currencyAtAcceptance: 'current',
    acceptanceKind: 'accepted-current',
    structuralValidity: 'valid',
    attemptNumber: 1,
  });
  expect(accepted.record.localAcceptance).toMatchObject({
    localId: 'rg4-history-harness-supported',
    displayName: 'RG-4 History Harness Supported Reviewer',
    locallyAsserted: true,
    authenticated: false,
    digitalSignature: false,
  });

  await page.waitForTimeout(1200);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(window.__sspRg4TestHooks));
  const reloadedHistory = await page.evaluate(() => window.__sspRg4TestHooks.getHistory());
  expect(reloadedHistory).toEqual([accepted.record]);

  const backup = await page.evaluate(() => window.__sspTestHooks.collectData(false));
  expect(backup.wordQaSidecarEvidence).toEqual([accepted.record]);
  await page.evaluate(() => window.__sspRg4TestHooks.setHistory([]));
  expect(await page.evaluate(() => window.__sspRg4TestHooks.getHistory().length)).toBe(0);
  await page.evaluate((data) => window.__sspTestHooks.applyData(data), backup);
  expect(await page.evaluate(() => window.__sspRg4TestHooks.getHistory())).toEqual([accepted.record]);

  const before = await captureIsolationState(page);
  expect(before.history).toEqual([accepted.record]);
  expect(before.rg4ProfileSha256).toBe(EXPECTED_RG4_PROFILE_SHA256);
  const route = await previewWorkshopHandoff(page);
  expect(route).toEqual({
    packageKind: 'l2g_ssp_handoff_v1',
    packageVersion: '1.0',
    controls: 110,
    rows: 1330,
    selectedRows: 0,
  });
  const after = await captureIsolationState(page);
  expect(after.authoredAndGoverned).toEqual(before.authoredAndGoverned);
  expect(after.history).toEqual(before.history);
  expect(after.rg2).toEqual(before.rg2);
  expect(after.rg3).toEqual(before.rg3);
  expect(after.reviewerStatuses).toEqual(before.reviewerStatuses);
  expect(after.signoffLikeStageRuns).toEqual(before.signoffLikeStageRuns);
  expect(after.rg4ProfileSha256).toBe(before.rg4ProfileSha256);

  const serializedHistory = JSON.stringify(after.history);
  expect(serializedHistory).not.toContain('l2g_ssp_handoff_v1');
  expect(serializedHistory).not.toContain('action-rg4-001');
  expect(serializedHistory).not.toContain('RG4 Synthetic Organization');

  const returnResult = await exportSspReturn(page, returnPath);
  expect(returnResult.package.package_kind).toBe('l2g_ssp_return_package_v1');
  expect(returnResult.package.package_version).toBe('1.0');
  expect(returnResult.package.controls).toHaveLength(110);
  const leakage = findForbiddenReturnLeakage(returnResult.package, [
    accepted.record.sidecarId,
    accepted.record.packageFingerprint,
    accepted.record.evidenceRecordId,
  ]);
  expect(leakage).toEqual([]);

  const identityBefore = historyIdentity(before.history[0]);
  const identityAfter = historyIdentity(after.history[0]);
  expect(identityAfter).toEqual(identityBefore);
  const evidence = {
    evidence_kind: 'ssp_rg4_populated_history_workshop_isolation',
    fixture_hashes: fixtureHashes,
    generated_pair: pair.identities,
    accepted_history_identity_before: identityBefore,
    accepted_history_identity_after: identityAfter,
    workshop_handoff: route,
    authored_and_governed_unchanged: true,
    rg2_unchanged: true,
    rg3_unchanged: true,
    review_profiles_unchanged: true,
    signoff_unchanged: true,
    workshop_owned_data_absorbed_into_rg4_history: false,
    reload_persistence: true,
    backup_restore_exact: true,
    ssp_return: {
      sha256: returnResult.sha256,
      size_bytes: returnResult.sizeBytes,
      controls: returnResult.package.controls.length,
      leakage_findings: leakage,
    },
    supported_workflow_defect_reproduced: false,
  };
  await testInfo.attach('RG4_POPULATED_HISTORY_ISOLATION_EVIDENCE.json', {
    body: Buffer.from(JSON.stringify(evidence, null, 2)),
    contentType: 'application/json',
  });
  await testInfo.attach('RG4_SSP_RETURN_NO_HISTORY_LEAKAGE.json', {
    body: Buffer.from(JSON.stringify({
      package_sha256: returnResult.sha256,
      package_size_bytes: returnResult.sizeBytes,
      package_kind: returnResult.package.package_kind,
      package_version: returnResult.package.package_version,
      control_count: returnResult.package.controls.length,
      forbidden_identity_values_checked: [
        accepted.record.sidecarId,
        accepted.record.packageFingerprint,
        accepted.record.evidenceRecordId,
      ],
      leakage_findings: leakage,
    }, null, 2)),
    contentType: 'application/json',
  });

  expect(observed.externalRequests).toEqual([]);
  expect(observed.pageErrors).toEqual([]);
  expect(observed.consoleErrors).toEqual([]);
  fs.rmSync(temp, { recursive: true, force: true });
});

test('legitimately empty RG-4 history remains empty through Workshop Handoff preview and SSP Return export', async ({ page, browser }, testInfo) => {
  test.setTimeout(240000);
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ssp-rg4-history-empty-'));
  const returnPath = path.join(temp, 'ssp-return-empty.json');
  const pair = await createSupportedCurrentPair(browser, temp);
  const observed = observeBrowser(page);
  await installFixedClock(page, '2026-07-31T18:50:00.000Z');
  await openSspRuntime(page, pair.sourceSnapshot);
  expect(await page.evaluate(() => window.__sspRg4TestHooks.getHistory())).toEqual([]);
  const before = await captureIsolationState(page);
  const route = await previewWorkshopHandoff(page);
  const after = await captureIsolationState(page);
  expect(route.controls).toBe(110);
  expect(route.rows).toBe(1330);
  expect(after.history).toEqual([]);
  expect(after.authoredAndGoverned).toEqual(before.authoredAndGoverned);
  expect(after.rg2).toEqual(before.rg2);
  expect(after.rg3).toEqual(before.rg3);
  expect(after.reviewerStatuses).toEqual(before.reviewerStatuses);
  expect(after.signoffLikeStageRuns).toEqual(before.signoffLikeStageRuns);
  expect(after.rg4ProfileSha256).toBe(before.rg4ProfileSha256);

  const returnResult = await exportSspReturn(page, returnPath);
  const leakage = findForbiddenReturnLeakage(returnResult.package);
  expect(leakage).toEqual([]);
  expect(returnResult.package.controls).toHaveLength(110);
  await testInfo.attach('RG4_EMPTY_HISTORY_ISOLATION_EVIDENCE.json', {
    body: Buffer.from(JSON.stringify({
      evidence_kind: 'ssp_rg4_empty_history_workshop_isolation',
      workshop_handoff_sha256: verifyStaticFixtureHashes().workshopHandoff,
      history_before: 0,
      history_after: 0,
      controls: route.controls,
      candidate_rows: route.rows,
      authored_and_governed_unchanged: true,
      rg2_unchanged: true,
      rg3_unchanged: true,
      review_profiles_unchanged: true,
      signoff_unchanged: true,
      ssp_return_sha256: returnResult.sha256,
      ssp_return_size_bytes: returnResult.sizeBytes,
      leakage_findings: leakage,
    }, null, 2)),
    contentType: 'application/json',
  });

  expect(observed.externalRequests).toEqual([]);
  expect(observed.pageErrors).toEqual([]);
  expect(observed.consoleErrors).toEqual([]);
  fs.rmSync(temp, { recursive: true, force: true });
});

test('stale exact pair requires explicit supported acknowledgement and remains separate from retry supersession', async ({ page, browser }, testInfo) => {
  test.setTimeout(300000);
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ssp-rg4-history-stale-'));
  const pair = await createSupportedCurrentPair(browser, temp);
  const changed = await createChangedSourceSnapshot(browser, temp);
  const observed = observeBrowser(page);
  await installFixedClock(page, '2026-07-31T18:55:00.000Z');
  await openSspRuntime(page, changed.sourceSnapshot);

  await page.evaluate(() => window.__sspRg4TestHooks.open('import'));
  await page.locator('#rg4SidecarFile').setInputFiles(pair.sidecarPath);
  await page.locator('#rg4DocxFile').setInputFiles(pair.docxPath);
  await page.locator('#rg4ValidateBtn').click();
  await page.waitForFunction(() => Boolean(window.__sspRg4TestHooks.getPreview()));
  const preview = await page.evaluate(() => window.__sspRg4TestHooks.getPreview());
  expect(preview).toMatchObject({ valid: true, duplicate: false, currency: 'stale' });
  await page.locator('#rg4LocalId').fill('rg4-stale-ack-reviewer');
  await page.locator('#rg4DisplayName').fill('RG-4 Stale Acknowledgement Reviewer');
  await page.locator('#rg4AcceptCheck').check();
  await page.locator('#rg4AcceptBtn').click();
  await page.waitForFunction(() => window.__sspRg4TestHooks.getHistory().length === 1);
  const history = await page.evaluate(() => window.__sspRg4TestHooks.getHistory());
  expect(history[0]).toMatchObject({
    acceptanceKind: 'acknowledged-stale',
    currencyAtAcceptance: 'stale',
    producerQaState: 'qa_complete',
    attemptNumber: 1,
  });
  expect(await page.evaluate(async () => window.__sspRg4TestHooks.recordCurrency(window.__sspRg4TestHooks.getHistory()[0])))
    .toBe('stale');
  await testInfo.attach('RG4_STALE_ACKNOWLEDGEMENT_EVIDENCE.json', {
    body: Buffer.from(JSON.stringify({
      evidence_kind: 'ssp_rg4_supported_stale_acknowledgement',
      preview_currency: preview.currency,
      accepted_record: historyIdentity(history[0]),
      derived_currency: 'stale',
      supersession_claimed: false,
    }, null, 2)),
    contentType: 'application/json',
  });

  expect(observed.externalRequests).toEqual([]);
  expect(observed.pageErrors).toEqual([]);
  expect(observed.consoleErrors).toEqual([]);
  fs.rmSync(temp, { recursive: true, force: true });
});
