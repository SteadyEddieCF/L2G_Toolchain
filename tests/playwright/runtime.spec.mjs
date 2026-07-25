import { test, expect } from '@playwright/test';
import { modules, stabilizePage } from './module-catalog.mjs';

for (const module of modules) {
  test(`${module.slug}: loads, stays offline, and exposes an interactive UI`, async ({ page }, testInfo) => {
    const pageErrors = [];
    const consoleErrors = [];
    const externalRequests = [];

    page.on('pageerror', (error) => pageErrors.push(String(error)));
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('request', (request) => {
      const url = request.url();
      if (/^https?:/i.test(url) && !url.startsWith('http://127.0.0.1:4173/')) {
        externalRequests.push(url);
      }
    });

    await page.goto(module.path, { waitUntil: 'domcontentloaded' });
    await stabilizePage(page);

    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveTitle(new RegExp(module.version.replaceAll('.', '\\.'), 'i'));

    const interactiveCount = await page.locator('button, input, select, textarea, a[href], [role="button"]').count();
    expect(interactiveCount).toBeGreaterThan(0);

    const storageResult = await page.evaluate(() => {
      const key = '__l2g_playwright_storage_probe__';
      try {
        localStorage.setItem(key, 'ok');
        const value = localStorage.getItem(key);
        localStorage.removeItem(key);
        return { writable: value === 'ok' };
      } catch (error) {
        return { writable: false, error: String(error) };
      }
    });
    expect(storageResult.writable, JSON.stringify(storageResult)).toBe(true);

    await testInfo.attach(`${module.slug}-console-errors.json`, {
      body: Buffer.from(JSON.stringify(consoleErrors, null, 2)),
      contentType: 'application/json'
    });

    expect(externalRequests, `Unexpected network requests: ${externalRequests.join(', ')}`).toEqual([]);
    expect(pageErrors, `Unhandled page errors: ${pageErrors.join('\n')}`).toEqual([]);
  });
}

test('workshop-v78: accepted-only contract-safe reports and helper snapshots remain bounded', async ({ page }, testInfo) => {
  const pageErrors = [];
  const consoleErrors = [];
  page.on('pageerror', (error) => pageErrors.push(String(error)));
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });

  await page.goto('/modules/workshop/releases/v78/cmmc_l2_gap_workshop_tool_v78.html', { waitUntil: 'domcontentloaded' });
  await stabilizePage(page);
  await expect(page.locator('#v78ReportingWorkspace')).toBeVisible();

  const result = await page.evaluate(() => {
    const accepted = {
      ownership_record_id: 'EOC-ACCEPTED-001', candidate_id: 'EOC-ACCEPTED-001',
      practice_id: 'AC.L2-3.1.1', practice_name: 'Authorized access control',
      evidence_category: 'provider_platform', evidence_category_label: 'Provider-produced platform evidence',
      audience: 'Provider', production_owner: 'Azure Provider', retention_owner: 'Azure Provider',
      access_owner: 'Client Security', access_path: 'C:\\Secret\\evidence.zip file://local/private',
      submission_owner: 'Azure Provider', review_followup_owner: 'Advisor',
      contract_validation_required: true, access_limitation: 'token=abc /home/user/private',
      state: 'accepted', advisor_note: 'Internal advisor note', validation_questions: ['Internal validation question'],
      responsibility_record_id: 'RESP-001', source_package_kind: 'l2g_responsibility_reconciliation_v1',
      source_package_version: '0.1', source_fingerprint: 'SECRET-FP', service_names: ['Azure'],
      accepted_at: '2026-07-25T00:00:00Z', accepted_by: 'Advisor'
    };
    const candidateOnly = {
      ...accepted, ownership_record_id: undefined, candidate_id: 'EOC-CANDIDATE-002',
      practice_id: 'AC.L2-3.1.2', state: 'candidate', advisor_note: 'Must not appear'
    };
    state.evidenceOwnershipV77 = {
      ...v77Defaults(),
      candidates: [accepted, candidateOnly],
      accepted_records: [accepted],
      requests: [{ request_id: 'REQ-001', ownership_record_id: accepted.candidate_id, status: 'requested', due_date: '2020-01-01', action_id: 'ACT-V77-001' }],
      provider_followups: [{ followup_id: 'PFU-001', ownership_record_id: accepted.candidate_id, state: 'requested', due_date: '2020-01-01', action_id: 'ACT-V77-001' }]
    };
    state.reportingV78 = v78Defaults();
    renderAll();

    const original = JSON.stringify(state.evidenceOwnershipV77);
    const advisor1 = v78BuildSnapshot('advisor', true);
    const advisor2 = v78BuildSnapshot('advisor', true);
    const client = v78BuildSnapshot('client', true);
    const workbookHelper = v78HelperSnapshot('workbook');
    const workbookPackage = l2gWorkbookHandoffPackage();
    state.reportingV78.ui.report_audience = 'client';
    renderAll();

    return {
      acceptedRows: v78AcceptedRows().length,
      candidateCount: state.evidenceOwnershipV77.candidates.length,
      advisorRows: advisor1.rows.length,
      advisorHasProvenance: Boolean(advisor1.rows[0]?.ownership_record_id && advisor1.rows[0]?.source_fingerprint),
      stableSnapshotId: advisor1.snapshot_id === advisor2.snapshot_id,
      stableGeneratedAt: advisor1.generated_at === advisor2.generated_at,
      clientJson: JSON.stringify(client),
      helper: workbookHelper,
      workbookKind: workbookPackage.package_kind,
      workbookEnhancement: workbookPackage.handoff_schema_enhancements_version || workbookPackage.contract_manifest?.contract_release,
      workbookHasHelper: Boolean(workbookPackage.optional_workshop_evidence_ownership_helper_v78),
      sourceUnchanged: original === JSON.stringify(state.evidenceOwnershipV77),
      runtimeChecks: v60RuntimeChecks(),
      sspFactoryNames: v78SspFactoryNames()
    };
  });

  expect(result.acceptedRows).toBe(1);
  expect(result.candidateCount).toBe(2);
  expect(result.advisorRows).toBe(1);
  expect(result.advisorHasProvenance).toBe(true);
  expect(result.stableSnapshotId).toBe(true);
  expect(result.stableGeneratedAt).toBe(true);
  expect(result.sourceUnchanged).toBe(true);
  expect(result.helper.accepted_only).toBe(true);
  expect(result.helper.consumer_may_ignore).toBe(true);
  expect(result.helper.downstream_consumption_confirmed).toBe(false);
  expect(result.helper.source_contracts.workbook_handoff).toBe('1.7');
  expect(result.helper.source_contracts.ssp_handoff).toBe('1.0');
  expect(result.workbookKind).toBe('l2g_workbook_handoff_v1');
  expect(result.workbookEnhancement).toBe('1.7');
  expect(result.workbookHasHelper).toBe(true);
  expect(result.clientJson).not.toMatch(/advisor_note|validation_questions|source_fingerprint|Internal advisor note|SECRET-FP|Must not appear/i);
  expect(result.clientJson).not.toContain('C:\\Secret');
  expect(result.clientJson).not.toContain('file://');
  expect(result.clientJson).not.toContain('/home/user');
  expect(result.clientJson).not.toContain('token=abc');
  expect(result.runtimeChecks.failed).toBe(0);
  await expect(page.locator('#v78ReportingWorkspace')).not.toContainText('Internal advisor note');

  await testInfo.attach('workshop-v78-regression.json', {
    body: Buffer.from(JSON.stringify({ ...result, clientJson: JSON.parse(result.clientJson) }, null, 2)),
    contentType: 'application/json'
  });
  expect(pageErrors, `Unhandled page errors: ${pageErrors.join('\n')}`).toEqual([]);
  expect(consoleErrors, `Console errors: ${consoleErrors.join('\n')}`).toEqual([]);
});
