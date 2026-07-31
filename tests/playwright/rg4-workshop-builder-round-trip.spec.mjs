import { test, expect } from '@playwright/test';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { generateWordFixture, readSidecar, adaptSidecarArtifact } from './ssp-rg4-fixture-helper.mjs';
import { seedWorkshopV79, setFixedClock, stableJson } from './rg4-workshop-fixture.mjs';

const WORKSHOP = '/modules/workshop/releases/v79/cmmc_l2_gap_workshop_tool_v79.html';
const BUILDER = '/modules/builder-merger/releases/v3.10/L2G-BM_v3.10.html';
const SSP = '/modules/ssp/releases/v1.9.17/CMMC_L2_SSP_Modern_Editable_v1.9.17.html';
const SHA = {
  handoff: '99c63ca4b617a479e5634bb7ad64f74e10d4d4b43ca747e698c134c545012ec2',
  workbook: '53836fd615dfdde88ac5510516b97e13c351fe88d29a2ca94a1a8c4b3012c43a',
  merge: 'e17a5c6a971f9f8c7ae388c3205ff4888b7cee4decd7026d4544447793dec899'
};
const digest = (value) => crypto.createHash('sha256').update(value).digest('hex');
const canonicalObjective = (value) => String(value || '').replace(/\s+\[/g, '[');
const observe = (page) => {
  const result = { pageErrors: [], consoleErrors: [], external: [] };
  page.on('pageerror', (error) => result.pageErrors.push(String(error)));
  page.on('console', (message) => { if (message.type() === 'error') result.consoleErrors.push(message.text()); });
  page.on('request', (request) => {
    const url = request.url();
    if (/^https?:/i.test(url) && !url.startsWith('http://127.0.0.1:4173/')) result.external.push(url);
  });
  return result;
};

test.describe.configure({ mode: 'serial' });

test('RG-4 Workshop v79 / Builder-Merger v3.10 frozen round trip', async ({ browser }, testInfo) => {
  test.setTimeout(240000);
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'rg4-wb-'));
  const workbookPath = path.join(temp, 'RG4_BuilderMerger_v3.10_Generated_Workbook.xlsx');
  const workshop = await browser.newPage();
  const workshopObs = observe(workshop);
  await workshop.goto(WORKSHOP, { waitUntil: 'domcontentloaded' });
  const handoff = await seedWorkshopV79(workshop);
  const handoffText = stableJson(handoff);
  expect(digest(handoffText)).toBe(SHA.handoff);
  expect(handoff.package_kind).toBe('l2g_workbook_handoff_v1');
  expect(handoff.package_version).toBe('1.0');
  expect(handoff.handoff_schema_enhancements_version).toBe('1.7');
  expect(handoff.practice_catalog).toHaveLength(110);
  expect(handoff.objective_review_rows).toHaveLength(320);

  const builder = await browser.newPage({ acceptDownloads: true });
  const builderObs = observe(builder);
  await builder.goto(BUILDER, { waitUntil: 'domcontentloaded' });
  await setFixedClock(builder);
  await builder.evaluate(async (text) => {
    await handleHandoffFile(new File([text], 'rg4-handoff.json', { type: 'application/json' }));
  }, handoffText);
  expect(await builder.evaluate(() => state.handoff.rows.length)).toBe(110);
  expect(await builder.evaluate(() => state.mergePlan?.unmatchedPractices || [])).toEqual([]);

  const downloadPromise = builder.waitForEvent('download');
  await builder.evaluate(() => downloadPopulatedWorkbook());
  const download = await downloadPromise;
  await download.saveAs(workbookPath);
  const workbookBytes = fs.readFileSync(workbookPath);
  expect(digest(workbookBytes)).toBe(SHA.workbook);

  const extracted = await builder.evaluate(async ({ workbookB64, handoffText }) => {
    const bin = atob(workbookB64);
    const bytes = Uint8Array.from(bin, (char) => char.charCodeAt(0));
    await handleReviewWorkbookFile(new File([bytes], 'rg4.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    await handleCompareHandoffFile(new File([handoffText], 'rg4-handoff.json', { type: 'application/json' }));
    buildExtractPreviewIfReady();
    return {
      pkg: state.extractPlan.packageObj,
      sheets: state.reviewWorkbookInfo.sheets.length,
      formulas: state.reviewWorkbookInfo.sheetSummaries.reduce((sum, sheet) => sum + sheet.formulaCount, 0)
    };
  }, { workbookB64: workbookBytes.toString('base64'), handoffText });
  const mergeText = stableJson(extracted.pkg);
  expect(digest(mergeText)).toBe(SHA.merge);
  expect(extracted.pkg.package_kind).toBe('l2g_workbook_merge_v1');
  expect(extracted.pkg.package_version).toBe('1.1');
  expect(extracted.pkg.practice_results).toHaveLength(110);
  expect(extracted.pkg.objective_results).toHaveLength(320);
  expect(extracted.sheets).toBe(12);
  expect(extracted.formulas).toBe(222);

  const handoffPracticeIds = new Set(handoff.practice_catalog.map((row) => row.practice_id));
  const mergePracticeIds = new Set(extracted.pkg.practice_results.map((row) => row.Practice_ID));
  expect([...handoffPracticeIds].sort()).toEqual([...mergePracticeIds].sort());
  const handoffObjectiveIds = new Set(handoff.objective_review_rows.map((row) => canonicalObjective(row.objective_id)));
  const mergeObjectiveIds = new Set(extracted.pkg.objective_results.map((row) => canonicalObjective(row.Objective_ID)));
  expect([...handoffObjectiveIds].sort()).toEqual([...mergeObjectiveIds].sort());

  const returned = await browser.newPage();
  const returnedObs = observe(returned);
  returned.on('dialog', (dialog) => dialog.accept());
  await returned.goto(WORKSHOP, { waitUntil: 'domcontentloaded' });
  await seedWorkshopV79(returned);
  const result = await returned.evaluate(async (text) => {
    const snapshot = () => JSON.stringify({
      decisions: state.decisions,
      actions: state.actionRegister.actions,
      ownership: state.evidenceOwnershipV77.accepted_records,
      requests: state.evidenceOwnershipV77.requests,
      followups: state.evidenceOwnershipV77.provider_followups,
      ssp: state.sspReturnGovernanceV71
    });
    const before = snapshot();
    const preview = v57PreviewMergeText(text, 'rg4-merge.json');
    const afterPreview = snapshot();
    v57ApplyPendingMerge();
    await new Promise((resolve) => setTimeout(resolve, 50));
    const afterApply = snapshot();
    const duplicate = v57PreviewMergeText(text, 'rg4-merge.json');
    const unknown = JSON.parse(text); unknown.package_version = '2.0';
    const extra = JSON.parse(text); extra.unexpected_property = 'x';
    const mismatch = JSON.parse(text); mismatch.practice_results[0].Practice_ID = mismatch.practice_results[1].Practice_ID;
    const duplicateKey = `{"package_kind":"l2g_workbook_merge_v1","package_version":"2.0","package_version":"1.1","schema_trusted":true,"generated_by":"L2G Builder/Merger v3.10","practice_results":${JSON.stringify(JSON.parse(text).practice_results)}}`;
    let duplicateKeyAccepted = false;
    try { duplicateKeyAccepted = !v57PreviewMergeText(duplicateKey, 'duplicate-key').blocking; } catch (_) {}
    return {
      previewNonMutating: before === afterPreview,
      unrelatedUnchanged: before === afterApply,
      practiceRows: preview.practice_results.length,
      objectiveRows: preview.objective_results.length,
      duplicateBlocked: duplicate.duplicate === true,
      unknownVersionAccepted: !v57PreviewMergeText(JSON.stringify(unknown), 'unknown').blocking,
      extraPropertyAccepted: !v57PreviewMergeText(JSON.stringify(extra), 'extra').blocking,
      mismatchedIdentityAccepted: !v57PreviewMergeText(JSON.stringify(mismatch), 'mismatch').blocking,
      duplicateKeyAccepted
    };
  }, mergeText);
  expect(result.previewNonMutating).toBe(true);
  expect(result.unrelatedUnchanged).toBe(true);
  expect(result.practiceRows).toBe(110);
  expect(result.objectiveRows).toBe(320);
  expect(result.duplicateBlocked).toBe(true);
  expect(result.unknownVersionAccepted).toBe(true);
  expect(result.extraPropertyAccepted).toBe(true);
  expect(result.mismatchedIdentityAccepted).toBe(true);
  expect(result.duplicateKeyAccepted).toBe(true);

  await testInfo.attach('RG4_Workshop_v79_Workbook_Handoff_Expected_1.7_Actual_1.0.json', { body: Buffer.from(handoffText), contentType: 'application/json' });
  await testInfo.attach('RG4_BuilderMerger_v3.10_Generated_Workbook.xlsx', { body: workbookBytes, contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  await testInfo.attach('RG4_BuilderMerger_v3.10_Workbook_Merge_1.1.json', { body: Buffer.from(mergeText), contentType: 'application/json' });
  for (const obs of [workshopObs, builderObs, returnedObs]) {
    expect(obs.pageErrors).toEqual([]);
    expect(obs.consoleErrors).toEqual([]);
    expect(obs.external).toEqual([]);
  }
  await Promise.all([workshop.close(), builder.close(), returned.close()]);
  fs.rmSync(temp, { recursive: true, force: true });
});

test('RG-4 Workshop v79 / SSP v1.9.17 Handoff and Return remain isolated', async ({ browser }, testInfo) => {
  test.setTimeout(240000);
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'rg4-ws-'));
  const docxPath = path.join(temp, 'ssp_current.docx');
  const returnPath = path.join(temp, 'rg4-return.json');
  const workshop = await browser.newPage();
  const workshopObs = observe(workshop);
  await workshop.goto(WORKSHOP, { waitUntil: 'domcontentloaded' });
  await seedWorkshopV79(workshop);
  const handoff = await workshop.evaluate(() => v70SspHandoffPackage());
  expect(handoff.package_kind).toBe('l2g_ssp_handoff_v1');
  expect(handoff.package_version).toBe('1.0');
  expect(handoff.controls).toHaveLength(110);

  const generated = await generateWordFixture(browser, 'current', docxPath);
  const sidecar = adaptSidecarArtifact(readSidecar('l2g_ssp_word_qa_sidecar_v1_current_attempt1.json'), docxPath);
  const ssp = await browser.newPage({ acceptDownloads: true });
  const sspObs = observe(ssp);
  await ssp.goto(SSP, { waitUntil: 'domcontentloaded' });
  await setFixedClock(ssp);
  await ssp.evaluate((snapshot) => window.__sspTestHooks.applyData(snapshot), generated.snapshot);
  const route = await ssp.evaluate(async ({ handoff, sidecarText, docxB64 }) => {
    const bin = atob(docxB64);
    const bytes = Uint8Array.from(bin, (char) => char.charCodeAt(0));
    const preview = await __sspRg4TestHooks.validatePairFiles(
      new File([sidecarText], 'sidecar.json', { type: 'application/json' }),
      new File([bytes], 'ssp.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
    );
    __sspRg4TestHooks.setHistory([__sspRg4TestHooks.buildRecord(preview, { localId: 'rg4', displayName: 'RG-4' })]);
    const before = __sspRg4TestHooks.getHistory();
    const validated = __sspTestHooks.l2gValidatePackage(handoff);
    const rows = __sspTestHooks.l2gBuildRows(validated);
    return { valid: preview.valid, controls: validated.controls.length, rows: rows.length, unchanged: JSON.stringify(before) === JSON.stringify(__sspRg4TestHooks.getHistory()) };
  }, { handoff, sidecarText: JSON.stringify(sidecar), docxB64: fs.readFileSync(docxPath).toString('base64') });
  expect(route).toMatchObject({ valid: true, controls: 110, rows: 1330, unchanged: true });

  const returnPromise = ssp.waitForEvent('download');
  await ssp.evaluate(() => __sspTestHooks.l2gExportReturnPackage());
  const returnDownload = await returnPromise;
  await returnDownload.saveAs(returnPath);
  const returnText = fs.readFileSync(returnPath, 'utf8');
  const returnPackage = JSON.parse(returnText);
  expect(returnPackage.package_kind).toBe('l2g_ssp_return_package_v1');
  expect(returnPackage.package_version).toBe('1.0');
  expect(returnPackage.controls).toHaveLength(110);
  expect(returnText).not.toMatch(/l2g_ssp_word_qa_sidecar_v1|rg4-evidence-/i);

  const returned = await browser.newPage();
  const returnedObs = observe(returned);
  await returned.goto(WORKSHOP, { waitUntil: 'domcontentloaded' });
  await seedWorkshopV79(returned);
  const preview = await returned.evaluate((pkg) => {
    const snapshot = () => JSON.stringify({ practices: state.practices, objectives: state.objectiveReviews, decisions: state.decisions, actions: state.actionRegister.actions, ownership: state.evidenceOwnershipV77.accepted_records });
    const before = snapshot();
    const result = v71PreviewSspReturnPackage(pkg, 'rg4-return.json');
    return { unchanged: before === snapshot(), errors: result.errors, controls: result.controls.length };
  }, returnPackage);
  expect(preview).toEqual({ unchanged: true, errors: [], controls: 110 });
  await testInfo.attach('RG4_Workshop_v79_SSP_Handoff_1.0.json', { body: Buffer.from(stableJson(handoff)), contentType: 'application/json' });
  await testInfo.attach('RG4_SSP_v1.9.17_Return_1.0.json', { body: Buffer.from(returnText), contentType: 'application/json' });
  for (const obs of [workshopObs, sspObs, returnedObs]) {
    expect(obs.pageErrors).toEqual([]);
    expect(obs.consoleErrors).toEqual([]);
    expect(obs.external).toEqual([]);
  }
  await Promise.all([workshop.close(), ssp.close(), returned.close()]);
  fs.rmSync(temp, { recursive: true, force: true });
});
