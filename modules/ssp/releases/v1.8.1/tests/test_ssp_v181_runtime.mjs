import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { Window } from 'happy-dom';

const root = path.resolve(import.meta.dirname, '..');
const htmlPath = path.join(root, 'build/CMMC_L2_SSP_v1.8.1/CMMC_L2_SSP_Modern_Editable_v1.8.1.html');
const resultPath = path.join(root, 'build/CMMC_L2_SSP_v1.8.1/CMMC_L2_SSP_v1.8.1_Runtime_Regression.json');
const checks = [];
const pass = (name, detail = '') => checks.push({ name, passed: true, detail });
const html = fs.readFileSync(htmlPath, 'utf8');
const mainStart = html.lastIndexOf('<script>');
const mainEnd = html.lastIndexOf('</script>');
assert.ok(mainStart > 0 && mainEnd > mainStart, 'main application script exists');
const appScript = html.slice(mainStart + '<script>'.length, mainEnd);
const modelMatch = html.match(/<script id="sspModel" type="application\/json">[\s\S]*?<\/script>/);
assert.ok(modelMatch, 'embedded SSP model exists');
const markup = html
  .replace(/<script(?:\s[^>]*)?>[\s\S]*?<\/script>/gi, '')
  .replace('</body>', `${modelMatch[0]}</body>`);

const window = new Window({
  url: 'https://ssp.local/v1.8.1',
  settings: {
    disableJavaScriptEvaluation: false,
    disableJavaScriptFileLoading: true,
    disableCSSFileLoading: true,
    disableIframePageLoading: true
  }
});
const { document } = window;
window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
window.getComputedStyle = () => ({ display: 'block', visibility: 'visible' });
window.HTMLElement.prototype.scrollIntoView = function () {};
window.URL.createObjectURL = () => 'blob:ssp-test';
window.URL.revokeObjectURL = () => {};
document.write(markup);
document.close();
window.eval(appScript);

const click = (selector) => {
  const el = document.querySelector(selector);
  assert.ok(el, `${selector} exists`);
  el.click();
  return el;
};
const value = (selector, next, event = 'input') => {
  const el = document.querySelector(selector);
  assert.ok(el, `${selector} exists`);
  el.value = next;
  el.dispatchEvent(new window.Event(event, { bubbles: true }));
  return el;
};
const saved = () => JSON.parse(window.localStorage.getItem('cmmc-l2-ssp-modern-v1.8.1'));

assert.equal(document.querySelectorAll('.control-card').length, 110);
assert.equal(document.querySelector('.brand-version').textContent.trim(), 'v1.8.1');
assert.equal(document.querySelector('meta[name="application-version"]').content, '1.8.1');
pass('Application boots with 110 controls and consistent v1.8.1 identity');
assert.equal(document.querySelector('#portfolioModularPanel').hidden, true);
assert.match(document.querySelector('#portfolioSetupBtn').textContent, /Enable optional/);
pass('Single-System remains the default with portfolio controls hidden');

const hooks = window.__sspTestHooks;
assert.ok(hooks);
const foundation = hooks.portfolioCreateModularState('McFirecoal Portfolio');
assert.equal(foundation.modules.length, 1);
assert.equal(foundation.moduleRequirements.length, 110);
assert.equal(new Set(foundation.moduleRequirements.map(r => r.requirementId)).size, 110);
assert.ok(foundation.moduleRequirements.every(r => r.applicability === 'pending-decision'));
pass('Portfolio creation establishes exactly 110 uninferred pending decisions for the anchor');

const childModule = {
  ...foundation.modules[0],
  moduleId: 'module-shared-services',
  parentModuleId: foundation.portfolio.topLevelModuleId,
  moduleType: 'shared-service',
  name: 'Shared Security Services',
  shortName: 'Shared Services'
};
const upgradedV180 = hooks.portfolioCloneState(foundation);
upgradedV180.schemaVersion = '1.0.0';
upgradedV180.portfolio.schemaVersion = '1.0.0';
upgradedV180.modules.push(childModule);
upgradedV180.moduleRequirements = [];
const normalizedUpgrade = hooks.portfolioNormalizeState(upgradedV180);
assert.equal(normalizedUpgrade.schemaVersion, '1.1.0');
assert.equal(normalizedUpgrade.moduleRequirements.length, 220);
assert.ok(normalizedUpgrade.moduleRequirements.every(r => r.applicability === 'pending-decision'));
pass('v1.8.0 portfolio foundations migrate to 110 pending records per module without inference');

const duplicate = hooks.portfolioCloneState(normalizedUpgrade);
duplicate.moduleRequirements.push({ ...duplicate.moduleRequirements[0], requirementRecordId: 'requirement-duplicate' });
assert.throws(() => hooks.portfolioNormalizeState(duplicate), /Duplicate module requirement record/i);
pass('Duplicate module-requirement pairs are rejected');

const orphan = hooks.portfolioCloneState(normalizedUpgrade);
orphan.moduleRequirements[0].moduleId = 'module-missing';
assert.throws(() => hooks.portfolioNormalizeState(orphan), /unknown module/i);
pass('Orphaned module requirement records are rejected');

click('#portfolioSetupBtn');
click('#portfolioPreviewMigrationBtn');
value('#portfolioMigrationName', 'McFirecoal CMMC Portfolio');
click('#portfolioConfirmMigrationBtn');
assert.equal(document.querySelector('#portfolioModularPanel').hidden, false);
assert.ok(window.localStorage.getItem('cmmc-l2-ssp-modern-v1.8.1-portfolio-rollback'));
assert.equal(saved().portfolioFoundation.moduleRequirements.length, 110);
assert.equal(document.querySelectorAll('.portfolio-requirement-row').length, 110);
assert.equal(document.querySelector('#portfolioRequirementPending').textContent, '110');
pass('Guided conversion creates rollback plus 110 visible unresolved decisions');

click('#portfolioAddModuleBtn');
value('#portfolioModuleName', 'Shared Security Services');
value('#portfolioModuleShortName', 'Shared Services');
value('#portfolioModuleBoundary', 'Shared identity, logging, endpoint, vulnerability, and monitoring services.');
click('#portfolioModuleSaveBtn');
let state = saved().portfolioFoundation;
assert.equal(state.modules.length, 2);
assert.equal(state.moduleRequirements.length, 220);
assert.equal(state.moduleRequirements.filter(r => r.moduleId === state.modules[1].moduleId).length, 110);
assert.equal(document.querySelectorAll('.portfolio-requirement-row').length, 110);
pass('Adding a module atomically creates its complete 110-record decision set');

click('.portfolio-requirement-row button');
value('#portfolioRequirementEditApplicability', 'not-applicable', 'change');
click('#portfolioRequirementSaveBtn');
assert.equal(document.querySelector('#portfolioRequirementEditor').hidden, false, 'editor remains open');
assert.match(document.querySelector('#appNoticeText').textContent, /requires a documented rationale/i);
pass('Not-applicable save is blocked until a rationale is supplied');

value('#portfolioRequirementEditRationale', 'This shared service does not perform the requirement function; the product module owns it.');
value('#portfolioRequirementEditResponsibility', 'module-led', 'change');
value('#portfolioRequirementEditApproval', 'pending-approval', 'change');
click('#portfolioRequirementSaveBtn');
state = saved().portfolioFoundation;
const notApplicable = state.moduleRequirements.find(r => r.moduleId === state.modules[1].moduleId && r.applicability === 'not-applicable');
assert.ok(notApplicable);
assert.match(notApplicable.applicabilityRationale, /product module owns it/);
assert.equal(notApplicable.approvalStatus, 'pending-approval');
pass('Individual review persists rationale, responsibility, and approval-tracking metadata');

value('#portfolioRequirementFamily', '3.14', 'change');
value('#portfolioBulkApplicability', 'applicable-shared-responsibility', 'change');
value('#portfolioBulkResponsibility', 'shared', 'change');
click('#portfolioBulkApplyBtn');
click('#actionConfirmBtn');
state = saved().portfolioFoundation;
const sharedFamily = state.moduleRequirements.filter(r => r.moduleId === state.modules[1].moduleId && r.requirementId.startsWith('3.14.'));
assert.equal(sharedFamily.length, 7);
assert.ok(sharedFamily.every(r => r.applicability === 'applicable-shared-responsibility'));
assert.ok(sharedFamily.every(r => r.responsibilityModel === 'shared'));
pass('Bulk review updates only the currently visible family records');

value('#portfolioRequirementFamily', '', 'change');
click('#portfolioPendingQueueBtn');
assert.equal(document.querySelector('#portfolioRequirementApplicability').value, 'pending-decision');
assert.equal(document.querySelectorAll('.portfolio-requirement-row').length, 102);
pass('Unresolved-decision queue filters the selected module without hiding resolved records permanently');

const packaged = {
  package_kind: 'cmmc_l2_ssp_portfolio_foundation_v1',
  package_version: '1.1',
  foundation: state,
  anchorWorkspace: saved()
};
const roundTrip = hooks.portfolioNormalizeState(hooks.migrateData(packaged).data.portfolioFoundation);
assert.equal(roundTrip.moduleRequirements.length, 220);
assert.equal(roundTrip.moduleRequirements.find(r => r.requirementRecordId === notApplicable.requirementRecordId).applicabilityRationale, notApplicable.applicabilityRationale);
pass('Portfolio JSON round trip preserves stable requirement identifiers and decisions');

const childId = state.modules[1].moduleId;
const selectedNode = [...document.querySelectorAll('.portfolio-node')].find(row => row.classList.contains('is-selected'));
assert.ok(selectedNode);
const deleteButton = [...selectedNode.querySelectorAll('button')].find(button => button.textContent === 'Delete');
assert.ok(deleteButton);
deleteButton.click();
click('#actionConfirmBtn');
state = saved().portfolioFoundation;
assert.equal(state.modules.length, 1);
assert.equal(state.moduleRequirements.length, 110);
assert.ok(state.moduleRequirements.every(r => r.moduleId !== childId));
pass('Deleting a leaf module also removes exactly its 110 decision records');

click('#portfolioRollbackBtn');
click('#actionConfirmBtn');
assert.equal(saved().portfolioFoundation.operatingMode, 'single-system');
assert.equal(saved().portfolioFoundation.moduleRequirements.length, 0);
assert.equal(document.querySelector('#portfolioModularPanel').hidden, true);
pass('Rollback restores the captured Single-System workspace');

const legacy = {
  schema: 'cmmc-l2-ssp-modern-v1.7.1', schemaVersion: '1.7.1', appVersion: '1.7.1',
  catalog: { version: 'source-template-1.0' }, savedAt: new Date().toISOString(),
  fields: {}, statuses: {}, reviewerStatuses: {}, tables: {}
};
const migrated = hooks.migrateData(legacy).data;
assert.equal(migrated.schema, 'cmmc-l2-ssp-modern-v1.8.1');
assert.equal(hooks.portfolioNormalizeState(migrated.portfolioFoundation).operatingMode, 'single-system');
pass('Legacy Single-System JSON migrates without enabling portfolio mode');

const summary = {
  release: 'v1.8.1', suite: 'happy-dom-runtime-applicability-responsibility',
  status: 'passed', passed: checks.length, total: checks.length, checks
};
fs.writeFileSync(resultPath, JSON.stringify(summary, null, 2) + '\n');
process.stdout.write(JSON.stringify({ release: summary.release, passed: summary.passed, total: summary.total, status: summary.status }) + '\n');
process.exit(0);
