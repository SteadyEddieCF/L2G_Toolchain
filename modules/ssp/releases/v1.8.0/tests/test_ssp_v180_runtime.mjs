import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { Window } from 'happy-dom';

const root = path.resolve(import.meta.dirname, '..');
const htmlPath = path.join(root, 'build/CMMC_L2_SSP_v1.8.0/CMMC_L2_SSP_Modern_Editable_v1.8.0.html');
const resultPath = path.join(root, 'build/CMMC_L2_SSP_v1.8.0/CMMC_L2_SSP_v1.8.0_Runtime_Regression.json');
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
  url: 'https://ssp.local/v1.8.0',
  settings: {
    disableJavaScriptEvaluation: false,
    disableJavaScriptFileLoading: true,
    disableCSSFileLoading: true,
    disableIframePageLoading: true
  }
});
const { document } = window;
window.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
window.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
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
const value = (selector, next) => {
  const el = document.querySelector(selector);
  assert.ok(el, `${selector} exists`);
  el.value = next;
  el.dispatchEvent(new window.Event('input', { bubbles: true }));
  return el;
};

assert.equal(document.querySelectorAll('.control-card').length, 110, 'all 110 controls remain');
assert.equal(document.querySelector('.brand-version').textContent.trim(), 'v1.8.0');
assert.equal(document.querySelector('meta[name="application-version"]').content, '1.8.0');
pass('Application boots with 110 controls and consistent v1.8.0 identity');
assert.equal(document.querySelector('#portfolioModularPanel').hidden, true, 'portfolio controls start hidden');
assert.match(document.querySelector('#portfolioSetupBtn').textContent, /Enable optional/);
pass('Single-System mode remains the default and modular controls are hidden');
assert.ok(window.__sspTestHooks, 'test hooks available');

const hooks = window.__sspTestHooks;
const foundation = hooks.portfolioCreateModularState('McFirecoal Portfolio');
assert.equal(foundation.operatingMode, 'modular-portfolio');
assert.equal(foundation.modules.length, 1);
assert.equal(foundation.modules[0].moduleType, 'top-level');
assert.equal(hooks.portfolioNormalizeState(foundation).portfolio.name, 'McFirecoal Portfolio');
pass('Versioned portfolio foundation creates one stable anchor module');

const withChild = hooks.portfolioCloneState(foundation);
withChild.modules.push({
  ...withChild.modules[0],
  moduleId: 'module-shared-services',
  parentModuleId: withChild.portfolio.topLevelModuleId,
  moduleType: 'shared-service',
  name: 'Shared Security Services',
  shortName: 'Shared Services'
});
assert.equal(hooks.portfolioNormalizeState(withChild).modules.length, 2, 'valid child accepted');
pass('Valid parent-child module relationship is accepted');

const orphan = hooks.portfolioCloneState(withChild);
orphan.modules[1].parentModuleId = 'module-missing';
assert.throws(() => hooks.portfolioNormalizeState(orphan), /missing parent/i);
pass('Orphaned module relationship is rejected');
const cycle = hooks.portfolioCloneState(withChild);
cycle.modules.push({
  ...cycle.modules[1],
  moduleId: 'module-product',
  parentModuleId: cycle.modules[1].moduleId,
  moduleType: 'product',
  name: 'Product',
  shortName: 'Product'
});
cycle.modules[1].parentModuleId = 'module-product';
assert.throws(() => hooks.portfolioNormalizeState(cycle), /circular/i);
pass('Circular module relationship is rejected');

click('#portfolioSetupBtn');
assert.equal(document.querySelector('#portfolioModal').hidden, false, 'portfolio modal opens');
click('#portfolioPreviewMigrationBtn');
assert.equal(document.querySelector('#portfolioMigrationPreview').hidden, false, 'migration preview opens');
pass('Guided migration preview opens before any conversion');
value('#portfolioMigrationName', 'McFirecoal CMMC Portfolio');
click('#portfolioConfirmMigrationBtn');
assert.equal(document.querySelector('#portfolioModularPanel').hidden, false, 'portfolio mode enabled');
pass('Confirmed conversion enables modular portfolio mode');
assert.ok(window.localStorage.getItem('cmmc-l2-ssp-modern-v1.8.0-portfolio-rollback'), 'rollback snapshot created');
pass('Conversion creates a complete local rollback snapshot');

let saved = JSON.parse(window.localStorage.getItem('cmmc-l2-ssp-modern-v1.8.0'));
assert.equal(saved.portfolioFoundation.operatingMode, 'modular-portfolio');
assert.equal(saved.portfolioFoundation.modules.length, 1);
pass('Converted backup preserves one anchor module and modular operating mode');
assert.equal(saved.portfolioFoundation.moduleRequirements.length, 0, 'no implementation is inferred');
pass('Foundation conversion does not infer child requirement implementation');

click('#portfolioAddModuleBtn');
value('#portfolioModuleName', 'Shared Security Services');
value('#portfolioModuleShortName', 'Shared Services');
value('#portfolioModuleBoundary', 'Shared identity, logging, and endpoint protection services.');
click('#portfolioModuleSaveBtn');
saved = JSON.parse(window.localStorage.getItem('cmmc-l2-ssp-modern-v1.8.0'));
assert.equal(saved.portfolioFoundation.modules.length, 2, 'module saved through the UI');
pass('Shared-service module can be created through the accessible UI');
assert.equal(saved.portfolioFoundation.modules[1].parentModuleId, saved.portfolioFoundation.portfolio.topLevelModuleId);
pass('New module retains the selected parent identifier');

const packaged = {
  package_kind: 'cmmc_l2_ssp_portfolio_foundation_v1',
  foundation: saved.portfolioFoundation,
  anchorWorkspace: saved
};
assert.equal(hooks.migrateData(packaged).data.portfolioFoundation.modules.length, 2, 'complete foundation package is importable');
pass('Complete portfolio foundation export shape can be imported');

click('#portfolioRollbackBtn');
click('#actionConfirmBtn');
saved = JSON.parse(window.localStorage.getItem('cmmc-l2-ssp-modern-v1.8.0'));
assert.equal(saved.portfolioFoundation.operatingMode, 'single-system', 'rollback restores Single-System mode');
assert.equal(document.querySelector('#portfolioModularPanel').hidden, true);
pass('Rollback restores the pre-conversion Single-System workspace');

const legacy = {
  schema: 'cmmc-l2-ssp-modern-v1.7.1',
  schemaVersion: '1.7.1',
  appVersion: '1.7.1',
  catalog: { version: 'source-template-1.0' },
  savedAt: new Date().toISOString(),
  fields: {},
  statuses: {},
  reviewerStatuses: {},
  tables: {}
};
const migrated = hooks.migrateData(legacy).data;
assert.equal(migrated.schema, 'cmmc-l2-ssp-modern-v1.8.0');
assert.equal(hooks.portfolioNormalizeState(migrated.portfolioFoundation).operatingMode, 'single-system');
pass('A v1.7.1 backup migrates to v1.8.0 without forcing portfolio mode');

const summary = {
  release: 'v1.8.0',
  suite: 'happy-dom-runtime-foundation',
  status: 'passed',
  passed: checks.length,
  total: checks.length,
  checks
};
fs.writeFileSync(resultPath, JSON.stringify(summary, null, 2) + '\n');
process.stdout.write(JSON.stringify({ release: summary.release, passed: summary.passed, total: summary.total, status: summary.status }) + '\n');
process.exit(0);
