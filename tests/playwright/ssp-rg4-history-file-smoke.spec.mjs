import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  SSP_RUNTIME_RELATIVE,
  captureIsolationState,
  createSupportedCurrentPair,
  exportSspReturn,
  findForbiddenReturnLeakage,
  historyIdentity,
  installFixedClock,
  observeBrowser,
  openSspRuntime,
  previewWorkshopHandoff,
  recordSupportedCurrentEvidence,
  verifyStaticFixtureHashes,
} from './ssp-rg4-history-harness-fixture.mjs';

test('ssp-v1.9.17: Windows file-origin supported RG-4 history remains isolated from Workshop Handoff and SSP Return', async ({ page, browser }, testInfo) => {
  test.setTimeout(300000);
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ssp-rg4-history-file-'));
  const returnPath = path.join(temp, 'ssp-return-file-origin.json');
  const pair = await createSupportedCurrentPair(browser, temp);
  const observed = observeBrowser(page, { allowLocalHttp: false });
  await installFixedClock(page, '2026-07-31T19:00:00.000Z');
  const fileUrl = pathToFileURL(path.resolve(process.cwd(), SSP_RUNTIME_RELATIVE)).href;
  await openSspRuntime(page, pair.sourceSnapshot, fileUrl);

  const accepted = await recordSupportedCurrentEvidence(page, pair, {
    localId: 'rg4-windows-file-reviewer',
    displayName: 'RG-4 Windows File-Origin Reviewer',
  });
  await page.waitForTimeout(1200);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(window.__sspRg4TestHooks));
  expect(await page.evaluate(() => window.__sspRg4TestHooks.getHistory())).toEqual([accepted.record]);

  const before = await captureIsolationState(page);
  const route = await previewWorkshopHandoff(page);
  const after = await captureIsolationState(page);
  expect(route).toMatchObject({ controls: 110, rows: 1330 });
  expect(after.history).toEqual(before.history);
  expect(historyIdentity(after.history[0])).toEqual(historyIdentity(before.history[0]));
  expect(after.authoredAndGoverned).toEqual(before.authoredAndGoverned);
  expect(after.rg2).toEqual(before.rg2);
  expect(after.rg3).toEqual(before.rg3);
  expect(after.reviewerStatuses).toEqual(before.reviewerStatuses);
  expect(after.signoffLikeStageRuns).toEqual(before.signoffLikeStageRuns);
  expect(after.rg4ProfileSha256).toBe(before.rg4ProfileSha256);

  const returned = await exportSspReturn(page, returnPath);
  const leakage = findForbiddenReturnLeakage(returned.package, [
    accepted.record.sidecarId,
    accepted.record.packageFingerprint,
    accepted.record.evidenceRecordId,
  ]);
  expect(returned.package.package_kind).toBe('l2g_ssp_return_package_v1');
  expect(returned.package.package_version).toBe('1.0');
  expect(returned.package.controls).toHaveLength(110);
  expect(leakage).toEqual([]);

  await testInfo.attach('RG4_WINDOWS_FILE_ORIGIN_HISTORY_ISOLATION.json', {
    body: Buffer.from(JSON.stringify({
      evidence_kind: 'ssp_rg4_windows_file_origin_history_isolation',
      fixture_hashes: verifyStaticFixtureHashes(),
      runtime_url_scheme: 'file',
      accepted_record: historyIdentity(accepted.record),
      workshop_handoff: route,
      history_unchanged: true,
      authored_and_governed_unchanged: true,
      rg2_unchanged: true,
      rg3_unchanged: true,
      review_profiles_unchanged: true,
      signoff_unchanged: true,
      ssp_return_sha256: returned.sha256,
      ssp_return_size_bytes: returned.sizeBytes,
      ssp_return_leakage_findings: leakage,
      external_requests: observed.externalRequests,
      page_errors: observed.pageErrors,
      unexpected_console_errors: observed.consoleErrors,
    }, null, 2)),
    contentType: 'application/json',
  });

  expect(observed.externalRequests).toEqual([]);
  expect(observed.pageErrors).toEqual([]);
  expect(observed.consoleErrors).toEqual([]);
  fs.rmSync(temp, { recursive: true, force: true });
});
