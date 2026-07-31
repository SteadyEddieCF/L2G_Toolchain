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
const EXPECTED = {
  handoffSha256: '99c63ca4b617a479e5634bb7ad64f74e10d4d4b43ca747e698c134c545012ec2',
  workbookSha256: '53836fd615dfdde88ac5510516b97e13c351fe88d29a2ca94a1a8c4b3012c43a',
  mergeSha256: 'e17a5c6a971f9f8c7ae388c3205ff4888b7cee4decd7026d4544447793dec899'
};
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const canonicalObjective = (value) => String(value || '').replace(/\s+\[/g, '[');
const capture = (page) => {
  const pageErrors = [], consoleErrors = [], externalRequests = [];
  page.on('pageerror', (error) => pageErrors.push(String(error)));
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('request', (request) => {
    const url = request.url();
    if (/^https?:/i.test(url) && !url.startsWith('http://127.0.0.1:4173/')) externalRequests.push(url);
  });
  return { pageErrors, consoleErrors, externalRequests };
};

test.describe.configure({ mode: 'serial' });

test('RG-4 Workshop v79 and Builder/Merger v3.10 round trip produces exact evidence and records blockers', async ({ browser }, testInfo) => {
  test.setTimeout(240000);
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'rg4-workshop-builder-'));
  const handoffPath = path.join(temp, 'RG4_Workshop_v79_Workbook_Handoff_Expected_1.7_Actual_1.0.json');
  const workbookPath = path.join(temp, 'RG4_BuilderMerger_v3.10_Generated_Workbook.xlsx');
  const mergePath = path.join(temp, 'RG4_BuilderMerger_v3.10_Workbook_Merge_1.1.json');

  const workshop = await browser.newPage();
  const workshopErrors = capture(workshop);
  await workshop.goto(WORKSHOP, { waitUntil: 'domcontentloaded' });
  const handoff = await seedWorkshopV79(workshop);
  const handoffText = stableJson(handoff);
  fs.writeFileSync(handoffPath, handoffText);
  expect(sha256(handoffText)).toBe(EXPECTED.handoffSha256);
  expect(handoff.package_kind).toBe('l2g_workbook_handoff_v1');
  expect(handoff.package_version).toBe('1.0');
  expect(handoff.handoff_schema_enhancements_version).toBe('1.7');
  expect(handoff.practice_catalog).toHaveLength(110);
  expect(handoff.objective_review_rows).toHaveLength(320);
  expect(handoff.workshop_action_register_v67.actions).toHaveLength(1);
  expect(handoff.optional_workshop_evidence_ownership_helper_v78.records).toHaveLength(1);
  const sspHandoff = await workshop.evaluate(() => v70SspHandoffPackage());
  expect(sspHandoff.package_version).toBe('1.0');

  const builder = await browser.newPage({ acceptDownloads: true });
  const builderErrors = capture(builder);
  await builder.goto(BUILDER, { waitUntil: 'domcontentloaded' });
  await setFixedClock(builder);
  await builder.evaluate(async (text) => {
    const file = new File([text], 'RG4_Workshop_v79_Workbook_Handoff_Expected_1.7_Actual_1.0.json', { type: 'application/json' });
    await handleHandoffFile(file);
  }, handoffText);
  const importSummary = await builder.evaluate(() => ({
    packageType: state.handoff.packageType,
    rows: state.handoff.rows.length,
    unmatched: state.mergePlan?.unmatchedPractices || [],
    embeddedTemplate: state.defaultTemplateUsed === true,
    downloadEnabled: !document.getElementById('downloadWorkbookBtn').disabled
  }));
  expect(importSummary).toMatchObject({ rows: 110, unmatched: [], embeddedTemplate: true, downloadEnabled: true });

  const workbookDownloadPromise = builder.waitForEvent('download');
  await builder.evaluate(() => downloadPopulatedWorkbook());
  const workbookDownload = await workbookDownloadPromise;
  await workbookDownload.saveAs(workbookPath);
  const workbookBytes = fs.readFileSync(workbookPath);
  expect(sha256(workbookBytes)).toBe(EXPECTED.workbookSha256);

  const workbookB64 = workbookBytes.toString('base64');
  const extraction = await builder.evaluate(async ({ workbookB64, handoffText }) => {
    const decode = (b64) => {
      const bin = atob(b64), bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
      return bytes;
    };
    const workbook = new File([decode(workbookB64)], 'RG4_BuilderMerger_v3.10_Generated_Workbook.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const handoffFile = new File([handoffText], 'RG4_Workshop_v79_Workbook_Handoff_Expected_1.7_Actual_1.0.json', { type: 'application/json' });
    await handleReviewWorkbookFile(workbook);
    await handleCompareHandoffFile(handoffFile);
    buildExtractPreviewIfReady();
    const xmlFiles = Object.values(state.reviewWorkbookZip.files).filter((entry) => !entry.dir && /\.xml$/i.test(entry.name));
    const xml = (await Promise.all(xmlFiles.map((entry) => entry.async('text')))).join('\n');
    return {
      package: state.extractPlan.packageObj,
      sheetCount: state.reviewWorkbookInfo.sheets.length,
      formulaCount: state.reviewWorkbookInfo.sheetSummaries.reduce((sum, sheet) => sum + sheet.formulaCount, 0),
      tokenPresence: {
        provider: xml.includes('Synthetic Cloud Provider'),
        decision: xml.includes('Preserve Workshop-authored meaning and frozen package contracts.'),
        actionId: xml.includes('action-rg4-001'),
        ownershipId: xml.includes('ownership-rg4-001'),
        actionOwner: xml.includes('Synthetic Evidence Owner'),
        dueDate: xml.includes('2026-09-30'),
        blocker: xml.includes('Awaiting provider response'),
        accessLimitation: xml.includes('Client tenant export required.')
      }
    };
  }, { workbookB64, handoffText });

  const mergeText = stableJson(extraction.package);
  fs.writeFileSync(mergePath, mergeText);
  expect(sha256(mergeText)).toBe(EXPECTED.mergeSha256);
  expect(extraction.package.package_kind).toBe('l2g_workbook_merge_v1');
  expect(extraction.package.package_version).toBe('1.1');
  expect(extraction.package.practice_results).toHaveLength(110);
  expect(extraction.package.objective_results).toHaveLength(320);
  expect(extraction.sheetCount).toBe(12);
  expect(extraction.formulaCount).toBe(222);
  expect(extraction.tokenPresence.provider).toBe(true);
  expect(extraction.tokenPresence.decision).toBe(true);

  const handoffPracticeIds = new Set(handoff.practice_catalog.map((row) => row.practice_id));
  const mergePracticeIds = new Set(extraction.package.practice_results.map((row) => row.Practice_ID));
  expect([...handoffPracticeIds].sort()).toEqual([...mergePracticeIds].sort());
  const handoffObjectiveIds = new Set(handoff.objective_review_rows.map((row) => canonicalObjective(row.objective_id)));
  const mergeObjectiveIds = new Set(extraction.package.objective_results.map((row) => canonicalObjective(row.Objective_ID)));
  expect([...handoffObjectiveIds].sort()).toEqual([...mergeObjectiveIds].sort());

  const workshopReturn = await browser.newPage();
  const returnErrors = capture(workshopReturn);
  workshopReturn.on('dialog', (dialog) => dialog.accept());
  await workshopReturn.goto(WORKSHOP, { waitUntil: 'domcontentloaded' });
  await seedWorkshopV79(workshopReturn);
  const mergeResult = await workshopReturn.evaluate(async (text) => {
    const clone = (value) => JSON.parse(JSON.stringify(value));
    const substantive = () => ({
      practices: clone(state.practices), objectives: clone(state.objectiveReviews), decisions: clone(state.decisions),
      actions: clone(state.actionRegister.actions), ownership: clone(state.evidenceOwnershipV77.accepted_records),
      requests: clone(state.evidenceOwnershipV77.requests), followups: clone(state.evidenceOwnershipV77.provider_followups),
      ssp: clone(state.sspReturnGovernanceV71)
    });
    const before = substantive();
    const preview = v57PreviewMergeText(text, 'RG4_BuilderMerger_v3.10_Workbook_Merge_1.1.json');
    const afterPreview = substantive();
    v57ApplyPendingMerge();
    await new Promise((resolve) => setTimeout(resolve, 50));
    const afterApply = substantive();
    const second = v57PreviewMergeText(text, 'RG4_BuilderMerger_v3.10_Workbook_Merge_1.1.json');
    const basePackage = JSON.parse(text);
    const unknownVersion = JSON.parse(text); unknownVersion.package_version = '2.0';
    const extraProperty = JSON.parse(text); extraProperty.unexpected_property = 'x';
    const unknown = v57PreviewMergeText(JSON.stringify(unknownVersion), 'unknown-version');
    const extra = v57PreviewMergeText(JSON.stringify(extraProperty), 'extra-property');
    const duplicateKey = `{"package_kind":"l2g_workbook_merge_v1","package_version":"2.0","package_version":"1.1","schema_trusted":true,"generated_by":"L2G Builder/Merger v3.10","practice_results":${JSON.stringify(basePackage.practice_results || [])}}`;
    let duplicateKeyAccepted = false;
    try { duplicateKeyAccepted = !v57PreviewMergeText(duplicateKey, 'duplicate-key').blocking; } catch (_) {}
    const injection = JSON.parse(text);
    injection.practice_results[0].Reviewer_Notes = '<img src=x onerror="window.__RG4_INJECTED__=true">';
    const injected = v57PreviewMergeText(JSON.stringify(injection), 'injected-text');
    const holder = document.createElement('div');
    holder.innerHTML = `<p>${escapeHtml(injected.practice_results[0].Reviewer_Notes)}</p>`;
    document.body.appendChild(holder);
    return {
      previewNonMutating: JSON.stringify(before) === JSON.stringify(afterPreview),
      practiceRows: preview.practice_results.length, objectiveRows: preview.objective_results.length,
      unmatchedPractices: preview.unmatched_practices, unmatchedObjectives: preview.unmatched_objectives,
      historyCount: state.workbookMergeV57.history.length, duplicateBlocked: second.duplicate === true,
      unrelatedUnchanged: {
        decisions: JSON.stringify(before.decisions) === JSON.stringify(afterApply.decisions),
        actions: JSON.stringify(before.actions) === JSON.stringify(afterApply.actions),
        ownership: JSON.stringify(before.ownership) === JSON.stringify(afterApply.ownership),
        requests: JSON.stringify(before.requests) === JSON.stringify(afterApply.requests),
        followups: JSON.stringify(before.followups) === JSON.stringify(afterApply.followups),
        ssp: JSON.stringify(before.ssp) === JSON.stringify(afterApply.ssp)
      },
      negative: {
        unknownVersionAccepted: !unknown.blocking,
        extraPropertyAccepted: !extra.blocking,
        duplicateKeyAccepted,
        injectedTextExecuted: window.__RG4_INJECTED__ === true,
        injectedRenderedHtml: holder.innerHTML
      }
    };
  }, mergeText);

  expect(mergeResult.previewNonMutating).toBe(true);
  expect(mergeResult.practiceRows).toBe(110);
  expect(mergeResult.objectiveRows).toBe(320);
  expect(mergeResult.unmatchedPractices).toEqual([]);
  expect(mergeResult.unmatchedObjectives).toEqual([]);
  expect(mergeResult.historyCount).toBe(1);
  expect(mergeResult.duplicateBlocked).toBe(true);
  expect(Object.values(mergeResult.unrelatedUnchanged).every(Boolean)).toBe(true);
  expect(mergeResult.negative.injectedTextExecuted).toBe(false);
  expect(mergeResult.negative.injectedRenderedHtml).toContain('&lt;img');

  const blockerReport = {
    validation_scope: 'Workshop-owned RG-4 regression only',
    promotion_eligible: false,
    blockers: [
      { id: 'WKS-RG4-001', condition: 'Frozen registry declares Workbook Handoff 1.7 but exact Workshop v79 output declares package_version 1.0 and enhancement version 1.7.', actual: handoff.package_version, enhancement: handoff.handoff_schema_enhancements_version },
      { id: 'WKS-RG4-002', condition: 'Workshop v79 accepts unknown Workbook Merge versions as trusted/nonblocking.', actual: mergeResult.negative.unknownVersionAccepted },
      { id: 'WKS-RG4-003', condition: 'Workshop v79 accepts unknown top-level Workbook Merge properties.', actual: mergeResult.negative.extraPropertyAccepted },
      { id: 'WKS-RG4-004', condition: 'Workshop v79 does not explicitly reject duplicate JSON keys when the final value is valid.', actual: mergeResult.negative.duplicateKeyAccepted },
      { id: 'RG4-ROUNDTRIP-005', condition: 'Generated workbook omits exact action/ownership IDs or action owner/due-date/blocker/access-limitation fields required by issue #101.', actual: extraction.tokenPresence }
    ]
  };

  await testInfo.attach('RG4_Workshop_v79_Workbook_Handoff_Expected_1.7_Actual_1.0.json', { body: Buffer.from(handoffText), contentType: 'application/json' });
  await testInfo.attach('RG4_BuilderMerger_v3.10_Generated_Workbook.xlsx', { body: workbookBytes, contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  await testInfo.attach('RG4_BuilderMerger_v3.10_Workbook_Merge_1.1.json', { body: Buffer.from(mergeText), contentType: 'application/json' });
  await testInfo.attach('RG4_Workshop_Builder_Blockers.json', { body: Buffer.from(JSON.stringify(blockerReport, null, 2)), contentType: 'application/json' });
  expect(blockerReport.promotion_eligible).toBe(false);
  for (const errors of [workshopErrors, builderErrors, returnErrors]) {
    expect(errors.externalRequests).toEqual([]);
    expect(errors.pageErrors).toEqual([]);
    expect(errors.consoleErrors).toEqual([]);
  }
  await Promise.all([workshop.close(), builder.close(), workshopReturn.close()]);
  fs.rmSync(temp, { recursive: true, force: true });
});

test('RG-4 Workshop v79 and SSP v1.9.17 Handoff/Return 1.0 remain isolated from SSP-owned RG-4 evidence history', async ({ browser }, testInfo) => {
  test.setTimeout(240000);
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'rg4-workshop-ssp-'));
  const docxPath = path.join(temp, 'ssp_current.docx');
  const returnPath = path.join(temp, 'RG4_SSP_v1.9.17_Return_1.0.json');

  const workshop = await browser.newPage();
  const workshopErrors = capture(workshop);
  await workshop.goto(WORKSHOP, { waitUntil: 'domcontentloaded' });
  await seedWorkshopV79(workshop);
  const handoff = await workshop.evaluate(() => v70SspHandoffPackage());
  expect(handoff.package_kind).toBe('l2g_ssp_handoff_v1');
  expect(handoff.package_version).toBe('1.0');
  expect(handoff.controls).toHaveLength(110);

  const generated = await generateWordFixture(browser, 'current', docxPath);
  const sidecar = adaptSidecarArtifact(readSidecar('l2g_ssp_word_qa_sidecar_v1_current_attempt1.json'), docxPath);
  const ssp = await browser.newPage({ acceptDownloads: true });
  const sspErrors = capture(ssp);
  await ssp.goto(SSP, { waitUntil: 'domcontentloaded' });
  await setFixedClock(ssp);
  await ssp.evaluate((snapshot) => window.__sspTestHooks.applyData(snapshot), generated.snapshot);
  const sidecarText = JSON.stringify(sidecar);
  const docxB64 = fs.readFileSync(docxPath).toString('base64');
  const route = await ssp.evaluate(async ({ handoff, sidecarText, docxB64 }) => {
    const bin = atob(docxB64), bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
    const sidecarFile = new File([sidecarText], 'l2g_ssp_word_qa_sidecar_v1_current_attempt1.json', { type: 'application/json' });
    const docxFile = new File([bytes], 'ssp_current.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const preview = await __sspRg4TestHooks.validatePairFiles(sidecarFile, docxFile);
    const record = __sspRg4TestHooks.buildRecord(preview, { localId: 'rg4-validation', displayName: 'RG-4 Validation' });
    __sspRg4TestHooks.setHistory([record]);
    const before = __sspRg4TestHooks.getHistory();
    const validated = __sspTestHooks.l2gValidatePackage(handoff);
    const rows = __sspTestHooks.l2gBuildRows(validated);
    const after = __sspRg4TestHooks.getHistory();
    return { previewValid: preview.valid, validatedKind: validated.package_kind, validatedVersion: validated.package_version, controls: validated.controls.length, rows: rows.length, historyBefore: before, historyAfter: after };
  }, { handoff, sidecarText, docxB64 });
  expect(route.previewValid).toBe(true);
  expect(route.validatedKind).toBe('l2g_ssp_handoff_v1');
  expect(route.validatedVersion).toBe('1.0');
  expect(route.controls).toBe(110);
  expect(route.historyAfter).toEqual(route.historyBefore);

  const returnDownloadPromise = ssp.waitForEvent('download');
  await ssp.evaluate(() => __sspTestHooks.l2gExportReturnPackage());
  const returnDownload = await returnDownloadPromise;
  await returnDownload.saveAs(returnPath);
  const returnText = fs.readFileSync(returnPath, 'utf8');
  const returnPackage = JSON.parse(returnText);
  expect(returnPackage.package_kind).toBe('l2g_ssp_return_package_v1');
  expect(returnPackage.package_version).toBe('1.0');
  expect(returnPackage.controls).toHaveLength(110);
  expect(returnText).not.toMatch(/l2g_ssp_word_qa_sidecar_v1|rg4-evidence-/i);

  const workshopReturn = await browser.newPage();
  const returnErrors = capture(workshopReturn);
  await workshopReturn.goto(WORKSHOP, { waitUntil: 'domcontentloaded' });
  await seedWorkshopV79(workshopReturn);
  const previewResult = await workshopReturn.evaluate((pkg) => {
    const snapshot = () => JSON.stringify({ practices: state.practices, objectives: state.objectiveReviews, documents: state.documents, decisions: state.decisions, actions: state.actionRegister.actions, ownership: state.evidenceOwnershipV77.accepted_records, requests: state.evidenceOwnershipV77.requests, followups: state.evidenceOwnershipV77.provider_followups });
    const before = snapshot();
    const preview = v71PreviewSspReturnPackage(pkg, 'RG4_SSP_v1.9.17_Return_1.0.json');
    return { before, after: snapshot(), errors: preview.errors, controls: preview.controls.length };
  }, returnPackage);
  expect(previewResult.after).toBe(previewResult.before);
  expect(previewResult.errors).toEqual([]);
  expect(previewResult.controls).toBe(110);

  await testInfo.attach('RG4_Workshop_v79_SSP_Handoff_1.0.json', { body: Buffer.from(stableJson(handoff)), contentType: 'application/json' });
  await testInfo.attach('RG4_SSP_v1.9.17_Return_1.0.json', { body: Buffer.from(returnText), contentType: 'application/json' });
  for (const errors of [workshopErrors, sspErrors, returnErrors]) {
    expect(errors.externalRequests).toEqual([]);
    expect(errors.pageErrors).toEqual([]);
    expect(errors.consoleErrors).toEqual([]);
  }
  await Promise.all([workshop.close(), ssp.close(), workshopReturn.close()]);
  fs.rmSync(temp, { recursive: true, force: true });
});
