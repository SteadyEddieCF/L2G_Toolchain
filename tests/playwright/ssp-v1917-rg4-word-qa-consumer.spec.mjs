import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { generateWordFixture, createBlockedDocx, createNegativeDocxFixtures, readSidecar, adaptSidecarArtifact } from './ssp-rg4-fixture-helper.mjs';

const runtimePath = '/modules/ssp/releases/v1.9.17/CMMC_L2_SSP_Modern_Editable_v1.9.17.html';
let fixtureRoot, currentSnapshot, changedSnapshot, currentSidecar, changedSidecar, incompleteSidecar, blockedSidecar;
let currentDocx, changedDocx, blockedDocx, malformedDocx, traversalDocx;
const f = (relative) => path.join(fixtureRoot, relative);

test.describe.configure({ mode: 'serial' });
test.beforeAll(async ({ browser }) => {
  test.setTimeout(180000);
  fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ssp-v1917-rg4-'));
  currentDocx = f('ssp_current.docx');
  changedDocx = f('ssp_changed_source.docx');
  blockedDocx = f('ssp_current_with_unresolved_token.docx');
  const current = await generateWordFixture(browser, 'current', currentDocx);
  const changed = await generateWordFixture(browser, 'changed_source', changedDocx);
  currentSnapshot = current.snapshot;
  changedSnapshot = changed.snapshot;
  await createBlockedDocx(browser, currentDocx, blockedDocx);
  ({ malformed: malformedDocx, traversal: traversalDocx } = createNegativeDocxFixtures(fixtureRoot));
  currentSidecar = adaptSidecarArtifact(
    readSidecar('l2g_ssp_word_qa_sidecar_v1_current_attempt1.json'),
    currentDocx,
  );
  changedSidecar = adaptSidecarArtifact(
    readSidecar('l2g_ssp_word_qa_sidecar_v1_changed_source_attempt2.json'),
    changedDocx,
    { supersedesSidecarId: currentSidecar.sidecar_id },
  );
  incompleteSidecar = adaptSidecarArtifact(
    readSidecar('l2g_ssp_word_qa_sidecar_v1_qa_incomplete.json'),
    currentDocx,
  );
  blockedSidecar = adaptSidecarArtifact(
    readSidecar('l2g_ssp_word_qa_sidecar_v1_qa_blocked.json'),
    blockedDocx,
  );
});
test.afterAll(() => {
  if (fixtureRoot) fs.rmSync(fixtureRoot, { recursive: true, force: true });
});

const clone = (value) => structuredClone(value);
const canonical = (value) => {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
};
const digest = (value) => crypto.createHash('sha256').update(canonical(value), 'utf8').digest('hex');
const recompute = (value) => {
  const sidecar = clone(value);
  delete sidecar.sidecar_id;
  delete sidecar.package_fingerprint;
  sidecar.sidecar_id = `sha256:${digest(sidecar)}`;
  const fingerprintInput = clone(sidecar);
  delete fingerprintInput.package_fingerprint;
  sidecar.package_fingerprint = digest(fingerprintInput);
  return sidecar;
};
const sidecarFile = (value, name = 'sidecar.json') => ({
  name,
  mimeType: 'application/json',
  buffer: Buffer.from(JSON.stringify(value, null, 2)),
});
const captureErrors = (page) => {
  const pageErrors = [];
  const consoleErrors = [];
  const externalRequests = [];
  page.on('pageerror', (error) => pageErrors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('request', (request) => {
    const url = request.url();
    if (/^https?:/i.test(url) && !url.startsWith('http://127.0.0.1:4173/')) externalRequests.push(url);
  });
  return { pageErrors, consoleErrors, externalRequests };
};
async function openRuntime(page, snapshot = currentSnapshot) {
  await page.goto(runtimePath, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.control-card')).toHaveCount(110);
  await page.evaluate((data) => window.__sspTestHooks.applyData(data), snapshot);
}
async function openImporter(page) {
  await page.evaluate(() => window.__sspRg4TestHooks.open('import'));
  await expect(page.locator('#rg4Modal')).toBeVisible();
  await expect(page.locator('#rg4Title')).toBeFocused();
}
async function validatePair(page, sidecar, docxPath, name = 'sidecar.json') {
  await openImporter(page);
  await page.locator('#rg4SidecarFile').setInputFiles(sidecarFile(sidecar, name));
  await page.locator('#rg4DocxFile').setInputFiles(docxPath);
  await page.locator('#rg4ValidateBtn').click();
  await expect.poll(
    () => page.evaluate(() => window.__sspRg4TestHooks.getPreview()),
    { timeout: 30000, message: `RG-4 validation preview was not produced for ${name}` },
  ).not.toBeNull();
  await expect(page.locator('#rg4Live')).toContainText(/Structurally valid|Rejected with/);
  return page.evaluate(() => window.__sspRg4TestHooks.getPreview());
}
async function acceptPreview(page, localId = 'rg4-local-reviewer', displayName = 'RG-4 Local Reviewer') {
  await page.locator('#rg4LocalId').fill(localId);
  await page.locator('#rg4DisplayName').fill(displayName);
  await page.locator('#rg4AcceptCheck').check();
  await expect(page.locator('#rg4AcceptBtn')).toBeEnabled();
  await page.locator('#rg4AcceptBtn').click();
  await expect(page.locator('#rg4HistoryView')).toBeVisible();
  return page.evaluate(() => window.__sspRg4TestHooks.getHistory());
}
const stripSavedAt = (value) => {
  const copy = clone(value);
  delete copy.savedAt;
  return copy;
};

test('SSP v1.9.17 accepts current evidence, preserves idempotency, detects staleness, and supersedes only after current attempt 2 acceptance', async ({ page }) => {
  const errors = captureErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await openRuntime(page);
  const governedBefore = stripSavedAt(await page.evaluate(() => window.__sspTestHooks.collectData(false)));
  const preview1 = await validatePair(
    page,
    currentSidecar,
    currentDocx,
    'l2g_ssp_word_qa_sidecar_v1_current_attempt1.json',
  );
  expect(preview1).toMatchObject({
    valid: true,
    errors: [],
    currency: 'current',
    duplicate: false,
    currentFingerprint: '84e151b810224ea2f3a6a6121bc0d168b44f68641f749c0846258e2ebea90c8c',
  });
  expect(stripSavedAt(await page.evaluate(() => window.__sspTestHooks.collectData(false)))).toEqual(governedBefore);
  const accepted1 = await acceptPreview(page);
  expect(accepted1).toHaveLength(1);
  expect(accepted1[0]).toMatchObject({
    acceptanceKind: 'accepted-current',
    producerQaState: 'qa_complete',
    currencyAtAcceptance: 'current',
    structuralValidity: 'valid',
    attemptNumber: 1,
  });
  expect(accepted1[0].localAcceptance).toMatchObject({
    locallyAsserted: true,
    authenticated: false,
    digitalSignature: false,
  });
  await page.waitForTimeout(1200);
  await page.reload({ waitUntil: 'domcontentloaded' });
  expect(await page.evaluate(() => window.__sspRg4TestHooks.getHistory().length)).toBe(1);
  const duplicate = await validatePair(page, currentSidecar, currentDocx);
  expect(duplicate).toMatchObject({ valid: true, duplicate: true });
  await expect(page.locator('#rg4Preview')).toContainText('Idempotent duplicate');
  await expect(page.locator('#rg4AcceptancePanel')).toBeHidden();
  expect(await page.evaluate(() => window.__sspRg4TestHooks.getHistory().length)).toBe(1);
  const changedWorkingData = await page.evaluate(() => window.__sspTestHooks.collectData(false));
  changedWorkingData.fields['token:SYSTEM_PURPOSE_AND_FUNCTION'] = changedSnapshot.fields['token:SYSTEM_PURPOSE_AND_FUNCTION'];
  await page.evaluate((data) => window.__sspTestHooks.applyData(data), changedWorkingData);
  await page.evaluate(() => window.__sspRg4TestHooks.open('history'));
  await expect(page.locator('#rg4HistoryList')).toContainText('stale');
  expect((await page.evaluate(() => window.__sspRg4TestHooks.getHistory()))[0].source.sourceFingerprint)
    .toBe('84e151b810224ea2f3a6a6121bc0d168b44f68641f749c0846258e2ebea90c8c');
  const preview2 = await validatePair(
    page,
    changedSidecar,
    changedDocx,
    'l2g_ssp_word_qa_sidecar_v1_changed_source_attempt2.json',
  );
  expect(preview2).toMatchObject({
    valid: true,
    errors: [],
    currency: 'current',
    duplicate: false,
    currentFingerprint: 'c4320e890630b90830b9c0d71b7ea35e0803e6a74cb4f6a86e1f54a73e90eaeb',
  });
  const accepted2 = await acceptPreview(page);
  expect(accepted2).toHaveLength(2);
  expect(accepted2[1]).toMatchObject({
    acceptanceKind: 'accepted-current',
    attemptNumber: 2,
    supersedesSidecarId: currentSidecar.sidecar_id,
  });
  const currencies = await page.evaluate(async () => Promise.all(
    window.__sspRg4TestHooks.getHistory().map(
      (record) => window.__sspRg4TestHooks.recordCurrency(record),
    ),
  ));
  expect(currencies).toEqual(['superseded', 'current']);
  const backup = await page.evaluate(() => window.__sspTestHooks.collectData(false));
  await page.evaluate(() => window.__sspRg4TestHooks.setHistory([]));
  await page.evaluate((data) => window.__sspTestHooks.applyData(data), backup);
  expect(await page.evaluate(() => window.__sspRg4TestHooks.getHistory())).toEqual(accepted2);
  expect(errors.externalRequests).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
  expect(errors.consoleErrors).toEqual([]);
});

test('SSP v1.9.17 records blocked and incomplete producer states without treating them as completed or superseding evidence', async ({ page }) => {
  const errors = captureErrors(page);
  await openRuntime(page);
  const incomplete = await validatePair(
    page,
    incompleteSidecar,
    currentDocx,
    'l2g_ssp_word_qa_sidecar_v1_qa_incomplete.json',
  );
  expect(incomplete).toMatchObject({ valid: true, currency: 'current' });
  await expect(page.locator('#rg4Preview')).toContainText('qa_incomplete');
  let history = await acceptPreview(page, 'rg4-incomplete', 'RG-4 Incomplete Reviewer');
  expect(history[0]).toMatchObject({
    acceptanceKind: 'recorded-incomplete',
    producerQaState: 'qa_incomplete',
  });
  const blocked = await validatePair(
    page,
    blockedSidecar,
    blockedDocx,
    'l2g_ssp_word_qa_sidecar_v1_qa_blocked.json',
  );
  expect(blocked).toMatchObject({ valid: true, currency: 'current' });
  await expect(page.locator('#rg4Preview')).toContainText('qa_blocked');
  history = await acceptPreview(page, 'rg4-blocked', 'RG-4 Blocked Reviewer');
  expect(history).toHaveLength(2);
  expect(history[1]).toMatchObject({
    acceptanceKind: 'recorded-blocked',
    producerQaState: 'qa_blocked',
  });
  const currencies = await page.evaluate(async () => Promise.all(
    window.__sspRg4TestHooks.getHistory().map(
      (record) => window.__sspRg4TestHooks.recordCurrency(record),
    ),
  ));
  expect(currencies).toEqual(['current', 'current']);
  expect(errors.externalRequests).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
  expect(errors.consoleErrors).toEqual([]);
});

test('SSP v1.9.17 rejects contract, identity, package-security, and adversarial failures without mutation', async ({ page }) => {
  const errors = captureErrors(page);
  await openRuntime(page);
  const original = stripSavedAt(await page.evaluate(() => window.__sspTestHooks.collectData(false)));
  const cases = [
    [
      'manifest mismatch',
      recompute({
        ...clone(currentSidecar),
        source: { ...currentSidecar.source, word_export_manifest_sha256: '0'.repeat(64) },
      }),
      currentDocx,
      /manifest SHA-256/i,
    ],
    [
      'source snapshot mismatch',
      recompute({
        ...clone(currentSidecar),
        source: { ...currentSidecar.source, source_snapshot_sha256: '1'.repeat(64) },
      }),
      currentDocx,
      /source_snapshot_sha256/i,
    ],
    [
      'profile order mismatch',
      recompute({
        ...clone(currentSidecar),
        checks: [currentSidecar.checks[1], currentSidecar.checks[0], ...currentSidecar.checks.slice(2)],
      }),
      currentDocx,
      /frozen profile order/i,
    ],
    [
      'aggregate mismatch',
      recompute({ ...clone(currentSidecar), aggregate: { ...currentSidecar.aggregate, pass: 4 } }),
      currentDocx,
      /Aggregate pass/i,
    ],
    [
      'lineage mismatch',
      recompute({
        ...clone(currentSidecar),
        lineage: { ...currentSidecar.lineage, lineage_key: '2'.repeat(64) },
      }),
      currentDocx,
      /Lineage key/i,
    ],
    [
      'timestamp order mismatch',
      recompute({
        ...clone(currentSidecar),
        operator_assertions: currentSidecar.operator_assertions.map((assertion) => ({
          ...assertion,
          asserted_at: '2026-07-30T18:00:01Z',
        })),
      }),
      currentDocx,
      /occurs after created_at/i,
    ],
    [
      'invalid scope',
      recompute({ ...clone(currentSidecar), scope: { ...currentSidecar.scope, module_id: 'wrong' } }),
      currentDocx,
      /Single-system scope/i,
    ],
    [
      'unknown version',
      recompute({ ...clone(currentSidecar), package_version: '2.0' }),
      currentDocx,
      /must equal 1.0/i,
    ],
    [
      'extra property',
      recompute({ ...clone(currentSidecar), unexpected: 'x' }),
      currentDocx,
      /not allowed/i,
    ],
  ];
  for (const [name, sidecar, docx, message] of cases) {
    const preview = await validatePair(page, sidecar, docx, `${name.replaceAll(' ', '-')}.json`);
    expect(preview.valid, name).toBe(false);
    expect(preview.errors.join('\n'), name).toMatch(message);
    expect(stripSavedAt(await page.evaluate(() => window.__sspTestHooks.collectData(false))), name)
      .toEqual(original);
  }
  const duplicateJson = JSON.stringify(currentSidecar, null, 2).replace(
    '"package_kind": "l2g_ssp_word_qa_sidecar_v1",',
    '"package_kind": "l2g_ssp_word_qa_sidecar_v1",\n  "package_kind": "l2g_ssp_word_qa_sidecar_v1",',
  );
  await openImporter(page);
  await page.locator('#rg4SidecarFile').setInputFiles({
    name: 'duplicate.json',
    mimeType: 'application/json',
    buffer: Buffer.from(duplicateJson),
  });
  await page.locator('#rg4DocxFile').setInputFiles(currentDocx);
  await page.locator('#rg4ValidateBtn').click();
  await expect(page.locator('#rg4Preview')).toContainText('Duplicate JSON key');
  const mismatched = await validatePair(page, currentSidecar, changedDocx);
  expect(mismatched.valid).toBe(false);
  expect(mismatched.errors.join('\n')).toMatch(/filename|byte length|SHA-256/i);
  const malformed = recompute({
    ...clone(currentSidecar),
    artifact: {
      ...currentSidecar.artifact,
      file_name: 'malformed_package.docx',
      size_bytes: fs.statSync(malformedDocx).size,
      sha256: crypto.createHash('sha256').update(fs.readFileSync(malformedDocx)).digest('hex'),
    },
  });
  expect((await validatePair(page, malformed, malformedDocx)).errors.join('\n'))
    .toMatch(/not a readable Open XML package/i);
  const traversal = recompute({
    ...clone(currentSidecar),
    artifact: {
      ...currentSidecar.artifact,
      file_name: 'path_traversal.docx',
      size_bytes: fs.statSync(traversalDocx).size,
      sha256: crypto.createHash('sha256').update(fs.readFileSync(traversalDocx)).digest('hex'),
    },
  });
  expect((await validatePair(page, traversal, traversalDocx)).errors.join('\n'))
    .toMatch(/unsafe package path/i);
  const injected = clone(currentSidecar);
  injected.checks[0].summary = '<img src=x onerror=window.__rg4Injected=1><script>window.__rg4Injected=2</script>';
  const inert = recompute(injected);
  const inertPreview = await validatePair(page, inert, currentDocx, 'injected.json');
  expect(inertPreview.valid).toBe(true);
  await expect(page.locator('#rg4Preview script, #rg4Preview img')).toHaveCount(0);
  expect(await page.evaluate(() => window.__rg4Injected || 0)).toBe(0);
  await expect(page.locator('#rg4Preview')).toContainText('<script>');
  expect(stripSavedAt(await page.evaluate(() => window.__sspTestHooks.collectData(false))))
    .toEqual(original);
  expect(errors.externalRequests).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
  expect(errors.consoleErrors).toEqual([]);
});

test('SSP v1.9.17 RG-4 workspace preserves focus, keyboard, themes, constrained viewport, and print suppression', async ({ page }, testInfo) => {
  const errors = captureErrors(page);
  await page.setViewportSize({ width: 1366, height: 768 });
  await openRuntime(page);

  await page.locator('#importMenu > summary').click();
  await page.locator('#rg4ImportBtn').click();
  await expect(page.locator('#rg4Modal')).toBeVisible();
  await expect(page.locator('#rg4Title')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  expect(await page.evaluate(() => document.activeElement?.closest('#rg4Modal') !== null)).toBe(true);
  await page.locator('#rg4Modal .modal-close-icon[data-close-rg4]').click();
  await expect(page.locator('#rg4Modal')).toBeHidden();
  expect(await page.evaluate(() => document.activeElement?.closest('#rg4Modal') === null)).toBe(true);
  await page.locator('#importMenu').evaluate((menu) => { menu.open = false; });

  await page.locator('#reviewWorkspaceBtn').focus();
  await page.evaluate(() => window.__sspRg4TestHooks.open('history'));
  await expect(page.locator('#rg4Modal')).toBeVisible();
  await expect(page.locator('#rg4HistoryTab')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#rg4Modal')).toBeHidden();
  await expect(page.locator('#reviewWorkspaceBtn')).toBeFocused();

  await page.evaluate(() => document.body.classList.add('dark'));
  await page.evaluate(() => window.__sspRg4TestHooks.open('history'));
  await expect(page.locator('body')).toHaveClass(/dark/);
  await page.screenshot({
    path: testInfo.outputPath('ssp-v1917-rg4-dark-1366x768.png'),
    fullPage: false,
  });
  await page.evaluate(() => document.body.classList.remove('dark'));
  await expect(page.locator('body')).not.toHaveClass(/dark/);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('#rg4Modal')).toBeHidden();
  await page.emulateMedia({ media: 'screen' });
  expect(errors.externalRequests).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
  expect(errors.consoleErrors).toEqual([]);
});
