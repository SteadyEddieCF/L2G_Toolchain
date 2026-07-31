import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import {
  adaptSidecarArtifact,
  generateWordFixture,
  readSidecar,
} from './ssp-rg4-fixture-helper.mjs';

export const SSP_RUNTIME_HTTP = '/modules/ssp/releases/v1.9.17/CMMC_L2_SSP_Modern_Editable_v1.9.17.html';
export const SSP_RUNTIME_RELATIVE = 'modules/ssp/releases/v1.9.17/CMMC_L2_SSP_Modern_Editable_v1.9.17.html';
export const WORKSHOP_HANDOFF_ENCODED_PATH = path.resolve(
  process.cwd(),
  'validation/rg4/ssp-history-harness/fixtures/RG4_Workshop_v79_SSP_Handoff_1.0.json.gz.b64',
);
export const WORKSHOP_HANDOFF_PATH = path.resolve(
  process.cwd(),
  'test-results/ssp-rg4-history-fixtures/RG4_Workshop_v79_SSP_Handoff_1.0.json',
);
export const UNSUPPORTED_SYNTHETIC_HISTORY_PATH = path.resolve(
  process.cwd(),
  'validation/rg4/ssp-history-harness/fixtures/unsupported_synthetic_history_seed.json',
);
export const EXPECTED_WORKSHOP_HANDOFF_ENCODED_SHA256 = 'da47a88949edb82997d0a1d9a1cddd875bc8fa8be60aea19fd1a884749229505';
export const EXPECTED_WORKSHOP_HANDOFF_SHA256 = '81ca3171e14e3f2ff8caed17b70a031f50e0bcd3c75a69cb5367e221bb073947';
export const EXPECTED_UNSUPPORTED_SEED_SHA256 = '73121ab9a8160c84f28aeff2b8d61969392b7c2eac1a83d8de5966595f48d780';
export const EXPECTED_RG4_PROFILE_SHA256 = '9aec3fd144e9f8ccfefdd3dd1ba5605ec0364127459f8cbded71904cf02b789c';

export const sha256Bytes = (value) => crypto.createHash('sha256').update(value).digest('hex');
export const sha256Json = (value) => sha256Bytes(Buffer.from(JSON.stringify(value)));
export const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

export function materializeWorkshopHandoffFixture() {
  const encoded = fs.readFileSync(WORKSHOP_HANDOFF_ENCODED_PATH);
  const encodedSha256 = sha256Bytes(encoded);
  if (encodedSha256 !== EXPECTED_WORKSHOP_HANDOFF_ENCODED_SHA256) {
    throw new Error(`Encoded Workshop Handoff fixture hash mismatch: ${encodedSha256}`);
  }
  const workshop = zlib.gunzipSync(Buffer.from(encoded.toString('ascii').replace(/\s+/g, ''), 'base64'));
  const workshopSha256 = sha256Bytes(workshop);
  if (workshopSha256 !== EXPECTED_WORKSHOP_HANDOFF_SHA256) {
    throw new Error(`Workshop Handoff fixture hash mismatch: ${workshopSha256}`);
  }
  fs.mkdirSync(path.dirname(WORKSHOP_HANDOFF_PATH), { recursive: true });
  fs.writeFileSync(WORKSHOP_HANDOFF_PATH, workshop);
  return { path: WORKSHOP_HANDOFF_PATH, encodedSha256, workshopSha256, sizeBytes: workshop.length };
}

export function verifyStaticFixtureHashes() {
  const workshop = materializeWorkshopHandoffFixture();
  const unsupported = fs.readFileSync(UNSUPPORTED_SYNTHETIC_HISTORY_PATH);
  const actual = {
    workshopHandoffEncoded: workshop.encodedSha256,
    workshopHandoff: workshop.workshopSha256,
    workshopHandoffSizeBytes: workshop.sizeBytes,
    unsupportedSeed: sha256Bytes(unsupported),
  };
  if (actual.unsupportedSeed !== EXPECTED_UNSUPPORTED_SEED_SHA256) {
    throw new Error(`Unsupported history seed hash mismatch: ${actual.unsupportedSeed}`);
  }
  return actual;
}

export function observeBrowser(page, { allowLocalHttp = true } = {}) {
  const result = { pageErrors: [], consoleErrors: [], externalRequests: [] };
  page.on('pageerror', (error) => result.pageErrors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error') result.consoleErrors.push(message.text());
  });
  page.on('request', (request) => {
    const url = request.url();
    if (!/^https?:/i.test(url)) return;
    if (allowLocalHttp && url.startsWith('http://127.0.0.1:4173/')) return;
    result.externalRequests.push(url);
  });
  return result;
}

export async function installFixedClock(page, iso = '2026-07-31T18:45:00.000Z') {
  await page.addInitScript((fixedIso) => {
    const RealDate = Date;
    const fixed = RealDate.parse(fixedIso);
    class FixedDate extends RealDate {
      constructor(...args) { super(...(args.length ? args : [fixed])); }
      static now() { return fixed; }
    }
    FixedDate.parse = RealDate.parse;
    FixedDate.UTC = RealDate.UTC;
    Object.setPrototypeOf(FixedDate, RealDate);
    window.Date = FixedDate;
    Math.random = () => 0.123456789;
  }, iso);
}

export async function createChangedSourceSnapshot(browser, root) {
  const outputPath = path.join(root, 'ssp_changed_source.docx');
  const generated = await generateWordFixture(browser, 'changed_source', outputPath);
  return { sourceSnapshot: generated.snapshot, docxPath: outputPath };
}

export async function createSupportedCurrentPair(browser, root) {
  const docxPath = path.join(root, 'ssp_current.docx');
  const generated = await generateWordFixture(browser, 'current', docxPath);
  const sidecar = adaptSidecarArtifact(
    readSidecar('l2g_ssp_word_qa_sidecar_v1_current_attempt1.json'),
    docxPath,
  );
  const sidecarPath = path.join(root, 'l2g_ssp_word_qa_sidecar_v1_current_attempt1.runtime.json');
  fs.writeFileSync(sidecarPath, `${JSON.stringify(sidecar, null, 2)}\n`);
  return {
    docxPath,
    sidecar,
    sidecarPath,
    sourceSnapshot: generated.snapshot,
    identities: {
      docxSha256: sha256Bytes(fs.readFileSync(docxPath)),
      docxSizeBytes: fs.statSync(docxPath).size,
      sidecarSha256: sha256Bytes(fs.readFileSync(sidecarPath)),
      sidecarId: sidecar.sidecar_id,
      packageFingerprint: sidecar.package_fingerprint,
      sourceFingerprint: sidecar.source.source_ssp_fingerprint,
    },
  };
}

export async function openSspRuntime(page, sourceSnapshot, target = SSP_RUNTIME_HTTP) {
  await page.goto(target, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(window.__sspRg4TestHooks && window.__sspTestHooks));
  const controls = await page.locator('.control-card').count();
  if (controls !== 110) throw new Error(`Expected 110 SSP controls, observed ${controls}.`);
  await page.evaluate((snapshot) => window.__sspTestHooks.applyData(snapshot), sourceSnapshot);
}

export async function recordSupportedCurrentEvidence(
  page,
  pair,
  { localId = 'rg4-harness-reviewer', displayName = 'RG-4 Harness Reviewer' } = {},
) {
  await page.evaluate(() => window.__sspRg4TestHooks.open('import'));
  await page.locator('#rg4SidecarFile').setInputFiles(pair.sidecarPath);
  await page.locator('#rg4DocxFile').setInputFiles(pair.docxPath);
  await page.locator('#rg4ValidateBtn').click();
  await page.waitForFunction(() => Boolean(window.__sspRg4TestHooks.getPreview()));
  const preview = await page.evaluate(() => window.__sspRg4TestHooks.getPreview());
  if (!preview.valid || preview.currency !== 'current' || preview.duplicate) {
    throw new Error(`Supported current pair did not validate as current: ${JSON.stringify(preview)}`);
  }
  await page.locator('#rg4LocalId').fill(localId);
  await page.locator('#rg4DisplayName').fill(displayName);
  await page.locator('#rg4AcceptCheck').check();
  await page.locator('#rg4AcceptBtn').click();
  await page.waitForFunction(() => window.__sspRg4TestHooks.getHistory().length === 1);
  const records = await page.evaluate(() => window.__sspRg4TestHooks.getHistory());
  return { preview, record: records[0] };
}

export function stripVolatileBackup(value) {
  const clone = structuredClone(value);
  delete clone.savedAt;
  return clone;
}

export async function captureIsolationState(page) {
  return page.evaluate(() => {
    const backup = window.__sspTestHooks.collectData(false);
    delete backup.savedAt;
    const history = structuredClone(backup.wordQaSidecarEvidence || []);
    delete backup.wordQaSidecarEvidence;
    return {
      authoredAndGoverned: backup,
      history,
      rg2: {
        configuration: backup.reviewGateConfiguration,
        runs: backup.reviewGateRuns,
        stages: backup.reviewStageRuns,
        correctiveActions: backup.reviewCorrectiveActions,
      },
      rg3: backup.wordReviewInspections,
      reviewerStatuses: backup.reviewerStatuses,
      signoffLikeStageRuns: (backup.reviewStageRuns || []).filter((row) => row?.stage === 'director-signoff'),
      rg4ProfileSha256: window.__sspRg4TestHooks.PROFILE_SHA256,
    };
  });
}

export async function previewWorkshopHandoff(page) {
  materializeWorkshopHandoffFixture();
  await page.locator('#importL2gSspFile').setInputFiles(WORKSHOP_HANDOFF_PATH);
  await page.locator('#l2gPreviewModal').waitFor({ state: 'visible', timeout: 30000 });
  return page.evaluate((handoff) => {
    const validated = window.__sspTestHooks.l2gValidatePackage(handoff);
    const rows = window.__sspTestHooks.l2gBuildRows(validated);
    return {
      packageKind: validated.package_kind,
      packageVersion: validated.package_version,
      controls: validated.controls.length,
      rows: rows.length,
      selectedRows: rows.filter((row) => row.selected).length,
    };
  }, readJson(WORKSHOP_HANDOFF_PATH));
}

export async function exportSspReturn(page, outputPath) {
  const pending = page.waitForEvent('download');
  await page.evaluate(() => window.__sspTestHooks.l2gExportReturnPackage());
  const download = await pending;
  await download.saveAs(outputPath);
  const bytes = fs.readFileSync(outputPath);
  return {
    bytes,
    text: bytes.toString('utf8'),
    package: JSON.parse(bytes.toString('utf8')),
    sha256: sha256Bytes(bytes),
    sizeBytes: bytes.length,
  };
}

export function findForbiddenReturnLeakage(value, forbiddenValues = []) {
  const findings = [];
  const forbiddenKeys = new Set([
    'wordQaSidecarEvidence',
    'word_qa_sidecar_evidence',
    'rg4History',
    'rg4_history',
    'sidecar_id',
    'package_fingerprint',
    'evidenceRecordId',
  ]);
  const walk = (node, pointer = '') => {
    if (Array.isArray(node)) {
      node.forEach((item, index) => walk(item, `${pointer}/${index}`));
      return;
    }
    if (node && typeof node === 'object') {
      for (const [key, child] of Object.entries(node)) {
        const childPointer = `${pointer}/${key}`;
        if (forbiddenKeys.has(key)) findings.push({ pointer: childPointer, reason: 'forbidden-key', value: key });
        walk(child, childPointer);
      }
      return;
    }
    if (typeof node !== 'string') return;
    if (node === 'l2g_ssp_word_qa_sidecar_v1' || node.startsWith('rg4-evidence-')) {
      findings.push({ pointer, reason: 'forbidden-value', value: node });
    }
    for (const forbidden of forbiddenValues.filter(Boolean)) {
      if (node === forbidden) findings.push({ pointer, reason: 'record-identity-leak', value: node });
    }
  };
  walk(value);
  return findings;
}

export function historyIdentity(record) {
  return {
    recordSha256: sha256Json(record),
    evidenceRecordId: record.evidenceRecordId,
    packageFingerprint: record.packageFingerprint,
    sidecarId: record.sidecarId,
    acceptanceKind: record.acceptanceKind,
    producerQaState: record.producerQaState,
    currencyAtAcceptance: record.currencyAtAcceptance,
    localAcceptance: record.localAcceptance,
  };
}
