import { test, expect } from '@playwright/test';
import { stabilizePage } from './module-catalog.mjs';

test('workshop-v79: full McFirecoal route evidence and 320th objective mapping remain deterministic', async ({ page }, testInfo) => {
  const pageErrors = [];
  const consoleErrors = [];
  const externalRequests = [];
  page.on('pageerror', (error) => pageErrors.push(String(error)));
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('request', (request) => {
    const url = request.url();
    if (/^https?:/i.test(url) && !url.startsWith('http://127.0.0.1:4173/')) externalRequests.push(url);
  });

  await page.goto('/modules/workshop/releases/v79/cmmc_l2_gap_workshop_tool_v79.html', { waitUntil: 'domcontentloaded' });
  await stabilizePage(page);
  await page.evaluate(() => {
    document.querySelectorAll('.tab').forEach((tab) => tab.classList.remove('active'));
    document.getElementById('evidence')?.classList.add('active');
  });
  await expect(page.locator('#v79RegressionWorkspace')).toBeVisible();

  const result = await page.evaluate(() => {
    const mergePackage = {
      package_kind: 'l2g_workbook_merge_v1',
      package_version: '1.0',
      schema_trusted: true,
      generated_by: 'L2G Builder/Merger v3.8',
      objective_results: [{ Practice_ID: 'CM.L2-3.4.4', Objective_ID: 'CM.L2-3.4.4[a]' }]
    };
    const preview = v57PreviewMergeText(JSON.stringify(mergePackage), 'v79 focused regression');
    const allChecks = v60RuntimeChecks();
    const scopedChecks = allChecks.checks.filter((check) => check.id === 'version' || check.id.startsWith('v79-'));
    return {
      summary: V79_REGRESSION_EVIDENCE.summary,
      fixtureParts: V79_REGRESSION_EVIDENCE.fixture.parts,
      evidenceFingerprint: V79_REGRESSION_EVIDENCE.evidence_fingerprint,
      suiteSnapshotEligible: V79_REGRESSION_EVIDENCE.suite_snapshot_eligible,
      authorityBoundary: V79_REGRESSION_EVIDENCE.authority_boundary,
      canonicalObjectiveId: v57ObjectiveId('CM.L2-3.4.4[a]', 'CM.L2-3.4.4'),
      previewObjectives: preview.objective_results.length,
      unmatchedObjectives: preview.unmatched_objectives,
      previewBlocking: preview.blocking,
      scopedChecks,
      scopedFailures: scopedChecks.filter((check) => !check.pass).map((check) => check.id),
      evidenceJson: JSON.stringify(V79_REGRESSION_EVIDENCE)
    };
  });

  expect(result.summary).toEqual({ required_routes: 10, passed: 10, failed: 0, all_required_routes_passed: true });
  expect(result.fixtureParts).toHaveLength(3);
  expect(result.fixtureParts.every((part) => part.passed && part.crc_error === null)).toBe(true);
  expect(result.evidenceFingerprint).toBe('sha256-472d09a4a2bafba8026ef806557be53991d6b23121ba9732affdec9d9d2c586c');
  expect(result.suiteSnapshotEligible).toBe(true);
  expect(result.authorityBoundary.technical_route_results_only).toBe(true);
  expect(result.authorityBoundary.no_assessment_conclusion).toBe(true);
  expect(result.canonicalObjectiveId).toBe('CM.L2-3.4.4 [a]');
  expect(result.previewObjectives).toBe(1);
  expect(result.unmatchedObjectives).toEqual([]);
  expect(result.previewBlocking).toBe(false);
  expect(result.scopedChecks.length).toBeGreaterThanOrEqual(5);
  expect(result.scopedFailures).toEqual([]);
  expect(result.evidenceJson).not.toMatch(/ssp_review_delivery_profile|password|api[_ -]?key/i);
  expect(result.evidenceJson).not.toMatch(/(?:[A-Za-z]:\\|\/Users\/|\/home\/|\/mnt\/|\/tmp\/)/);

  await testInfo.attach('workshop-v79-regression.json', {
    body: Buffer.from(JSON.stringify({ ...result, evidenceJson: undefined }, null, 2)),
    contentType: 'application/json'
  });
  expect(externalRequests, `Unexpected network requests: ${externalRequests.join(', ')}`).toEqual([]);
  expect(pageErrors, `Unhandled page errors: ${pageErrors.join('\n')}`).toEqual([]);
  expect(consoleErrors, `Console errors: ${consoleErrors.join('\n')}`).toEqual([]);
});
