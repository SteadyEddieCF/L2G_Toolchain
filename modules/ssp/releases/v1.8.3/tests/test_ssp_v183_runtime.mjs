import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';

const root = path.resolve(import.meta.dirname, '..');
const htmlPath = path.join(root, 'build/CMMC_L2_SSP_v1.8.3/CMMC_L2_SSP_Modern_Editable_v1.8.3.html');
const resultPath = path.join(root, 'build/CMMC_L2_SSP_v1.8.3/CMMC_L2_SSP_v1.8.3_Runtime_Regression.json');
const checks = [];
const pass = (name, detail = '') => checks.push({ name, passed: true, detail });
const html = fs.readFileSync(htmlPath, 'utf8');
const mainStart = html.lastIndexOf('<script>');
const mainEnd = html.lastIndexOf('</script>');
assert.ok(mainStart > 0 && mainEnd > mainStart);
const appScript = html.slice(mainStart + '<script>'.length, mainEnd);
const modelMatch = html.match(/<script id="sspModel" type="application\/json">[\s\S]*?<\/script>/);
assert.ok(modelMatch);
const markup = html.replace(/<script(?:\s[^>]*)?>[\s\S]*?<\/script>/gi, '').replace('</body>', `${modelMatch[0]}</body>`);

const window = new Window({
  url: 'https://ssp.local/v1.8.3',
  settings: { disableJavaScriptEvaluation: false, disableJavaScriptFileLoading: true, disableCSSFileLoading: true, disableIframePageLoading: true }
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

const hooks = window.__sspTestHooks;
assert.ok(hooks);
assert.equal(document.querySelectorAll('.control-card').length, 110);
assert.equal(document.querySelector('.brand-version').textContent.trim(), 'v1.8.3');
assert.equal(document.querySelector('meta[name="application-version"]').content, '1.8.3');
pass('Application boots with 110 controls and consistent v1.8.3 identity');
assert.equal(document.querySelector('#portfolioModularPanel').hidden, true);
pass('Single-System remains the default');

const state = hooks.portfolioCreateModularState('McFirecoal Portfolio');
const anchor = state.modules[0];
const product = { ...anchor, moduleId: 'module-product-alpha', parentModuleId: anchor.moduleId, moduleType: 'product', name: 'Product Alpha', shortName: 'Alpha' };
const sibling = { ...anchor, moduleId: 'module-product-bravo', parentModuleId: anchor.moduleId, moduleType: 'product', name: 'Product Bravo', shortName: 'Bravo' };
const shared = { ...anchor, moduleId: 'module-shared-security', parentModuleId: anchor.moduleId, moduleType: 'shared-service', name: 'Shared Security', shortName: 'Shared Security' };
state.modules.push(product, sibling, shared);
state.moduleRequirements = hooks.portfolioEnsureRequirementRecords(state.moduleRequirements, state.modules);
assert.equal(state.moduleRequirements.length, 440);
pass('Four modules receive exactly 440 stable requirement records');

const get = (moduleId, requirementId) => state.moduleRequirements.find(record => record.moduleId === moduleId && record.requirementId === requirementId);
const replaceRecord = next => { state.moduleRequirements = state.moduleRequirements.map(record => record.requirementRecordId === next.requirementRecordId ? next : record); };
const makeCurrent = (requirementId, targetModule = product, sourceModule = anchor, options = {}) => {
  let source = get(sourceModule.moduleId, requirementId);
  Object.assign(source, {
    applicability: 'applicable-locally-implemented',
    implementationStatus: 'implemented',
    implementationNarrative: `Source ${requirementId} v1`,
    responsibilityModel: 'organization-led',
    organizationResponsibility: 'Operate the source implementation.',
    ownerIds: ['source-owner'],
    evidenceIds: ['source-evidence'],
    updatedAt: '2026-07-22T01:00:00Z'
  });
  let target = get(targetModule.moduleId, requirementId);
  Object.assign(target, {
    applicability: options.supplement ? 'applicable-inherited-with-local-supplement' : 'applicable-inherited',
    inheritedFromModuleId: sourceModule.moduleId,
    inheritanceType: options.supplement ? 'supplement' : sourceModule.moduleType === 'shared-service' ? 'shared-service' : 'parent',
    overrideState: options.override ? 'local-override' : 'none',
    overrideRationale: options.override ? 'Approved local alternate implementation.' : '',
    overrideFields: options.override ? ['implementationNarrative'] : [],
    implementationNarrative: options.override ? 'Local alternate v1' : target.implementationNarrative,
    supplementNarrative: options.supplement ? 'Product-specific residual implementation.' : '',
    supplementOwnerIds: options.supplement ? ['product-owner'] : [],
    supplementEvidenceIds: options.supplement ? ['product-evidence'] : []
  });
  target = hooks.portfolioApplyInheritance(target, source, sourceModule);
  replaceRecord(target);
  state.moduleRequirements = hooks.portfolioRefreshInheritanceStatuses(state.moduleRequirements, state.modules);
  return get(targetModule.moduleId, requirementId);
};

let target = makeCurrent('3.1.1');
assert.equal(target.inheritanceStatus, 'current');
const originalNarrative = target.implementationNarrative;
let source = get(anchor.moduleId, '3.1.1');
source.implementationNarrative = 'Source 3.1.1 v2';
source.updatedAt = '2026-07-22T02:00:00Z';
state.moduleRequirements = hooks.portfolioRefreshInheritanceStatuses(state.moduleRequirements, state.modules);
target = get(product.moduleId, '3.1.1');
assert.equal(target.inheritanceStatus, 'stale');
assert.equal(target.impactReviewState, 'pending');
assert.equal(target.implementationNarrative, originalNarrative);
pass('Parent change creates a pending impact without overwriting the child snapshot');

const groups = hooks.portfolioImpactQueue(state.moduleRequirements, state.modules);
assert.equal(groups.length, 1);
assert.equal(groups[0].sourceModuleId, anchor.moduleId);
assert.equal(groups[0].records[0].record.requirementId, '3.1.1');
assert.ok(groups[0].records[0].impact.changedFields.includes('implementationNarrative'));
pass('Stale records are grouped by source module with field-level impact');

let deferred = hooks.portfolioApplyImpactDecision(target, 'defer', 'Wait for architecture review.', 'ISSO', state.moduleRequirements, state.modules, '2026-07-22T02:05:00Z');
assert.equal(deferred.impactReviewState, 'deferred');
assert.equal(deferred.inheritedSnapshotFingerprint, target.inheritedSnapshotFingerprint);
assert.ok(deferred.impactDecisionId.startsWith('impact-'));
replaceRecord(deferred);
state.moduleRequirements = hooks.portfolioRefreshInheritanceStatuses(state.moduleRequirements, state.modules);
assert.equal(get(product.moduleId, '3.1.1').impactReviewState, 'deferred');
pass('Defer records rationale, reviewer, source fingerprint, and preserves the child snapshot');

source = get(anchor.moduleId, '3.1.1');
source.implementationNarrative = 'Source 3.1.1 v3';
source.updatedAt = '2026-07-22T03:00:00Z';
state.moduleRequirements = hooks.portfolioRefreshInheritanceStatuses(state.moduleRequirements, state.modules);
target = get(product.moduleId, '3.1.1');
assert.equal(target.impactReviewState, 'pending');
pass('A newer parent change reopens a previously deferred decision');

let preserved = hooks.portfolioApplyImpactDecision(target, 'preserve', 'Preserve the validated child snapshot for this release.', 'System Owner', state.moduleRequirements, state.modules, '2026-07-22T03:05:00Z');
assert.equal(preserved.impactReviewState, 'preserved');
assert.equal(preserved.implementationNarrative, originalNarrative);
pass('Preserve explicitly acknowledges the change without copying source values');

let refreshed = hooks.portfolioApplyImpactDecision(target, 'refresh', '', 'ISSE', state.moduleRequirements, state.modules, '2026-07-22T03:10:00Z');
assert.equal(refreshed.impactReviewState, 'refreshed');
assert.equal(refreshed.inheritanceStatus, 'current');
assert.equal(refreshed.implementationNarrative, 'Source 3.1.1 v3');
assert.equal(refreshed.overrideState, 'none');
pass('Refresh is explicit and copies current source values while clearing any override');

let supplement = makeCurrent('3.1.2', product, anchor, { supplement: true });
source = get(anchor.moduleId, '3.1.2');
source.implementationNarrative = 'Source 3.1.2 v2';
source.updatedAt = '2026-07-22T04:00:00Z';
state.moduleRequirements = hooks.portfolioRefreshInheritanceStatuses(state.moduleRequirements, state.modules);
supplement = get(product.moduleId, '3.1.2');
const refreshedSupplement = hooks.portfolioApplyImpactDecision(supplement, 'refresh', '', 'ISSE', state.moduleRequirements, state.modules, '2026-07-22T04:05:00Z');
assert.equal(refreshedSupplement.supplementNarrative, 'Product-specific residual implementation.');
assert.deepEqual(Array.from(refreshedSupplement.supplementOwnerIds), ['product-owner']);
pass('Refreshing inherited base fields preserves the separate local supplement');

let override = makeCurrent('3.14.2', sibling, shared, { override: true });
source = get(shared.moduleId, '3.14.2');
source.implementationNarrative = 'Shared security implementation v2';
source.updatedAt = '2026-07-22T05:00:00Z';
state.moduleRequirements = hooks.portfolioRefreshInheritanceStatuses(state.moduleRequirements, state.modules);
override = get(sibling.moduleId, '3.14.2');
const conflict = hooks.portfolioImpactDiff(override, get(shared.moduleId, '3.14.2'));
assert.ok(conflict.conflictFields.includes('implementationNarrative'));
const escalated = hooks.portfolioApplyImpactDecision(override, 'escalate', 'Architecture and shared-service owners must adjudicate the collision.', 'CISO', state.moduleRequirements, state.modules, '2026-07-22T05:05:00Z');
assert.equal(escalated.impactReviewState, 'escalated');
assert.ok(escalated.impactConflictFields.includes('implementationNarrative'));
assert.equal(escalated.implementationNarrative, 'Local alternate v1');
pass('Local-override collision is detected and can be escalated without propagation');

assert.throws(() => hooks.portfolioApplyImpactDecision(override, 'preserve', '', '', state.moduleRequirements, state.modules), /requires a decision rationale/i);
assert.throws(() => hooks.portfolioApplyImpactDecision(override, 'defer', '', '', state.moduleRequirements, state.modules), /requires a decision rationale/i);
assert.throws(() => hooks.portfolioApplyImpactDecision(override, 'escalate', '', '', state.moduleRequirements, state.modules), /requires a decision rationale/i);
pass('Preserve, defer, and escalate reject missing rationale');

const legacy = structuredClone(state);
legacy.schemaVersion = '1.2.0';
legacy.portfolio.schemaVersion = '1.2.0';
legacy.moduleRequirements = legacy.moduleRequirements.map(record => {
  const copy = { ...record };
  for (const key of ['impactDecisionId', 'impactReviewState', 'impactReviewRationale', 'impactReviewedAt', 'impactReviewedBy', 'impactSourceFingerprint', 'impactPreviousSnapshotFingerprint', 'impactChangedFields', 'impactConflictFields']) delete copy[key];
  return copy;
});
const migrated = hooks.portfolioNormalizeState(legacy);
assert.equal(migrated.schemaVersion, '1.3.0');
assert.equal(migrated.moduleRequirements.length, 440);
assert.ok(migrated.moduleRequirements.some(record => record.inheritanceStatus === 'stale' && record.impactReviewState === 'pending'));
pass('v1.8.2 schema migrates to 1.3.0 and derives pending impacts without decisions');

const packaged = { package_kind: 'cmmc_l2_ssp_portfolio_foundation_v1', package_version: '1.3', foundation: migrated, anchorWorkspace: hooks.collectData(true) };
const roundTrip = hooks.portfolioNormalizeState(hooks.migrateData(packaged).data.portfolioFoundation);
assert.equal(roundTrip.moduleRequirements.length, 440);
assert.equal(roundTrip.schemaVersion, '1.3.0');
pass('Portfolio 1.3 JSON round trip preserves module and impact records');

const summary = { release: 'v1.8.3', suite: 'happy-dom-runtime-impact-review', status: 'passed', passed: checks.length, total: checks.length, checks };
fs.writeFileSync(resultPath, JSON.stringify(summary, null, 2) + '\n');
process.stdout.write(JSON.stringify({ release: summary.release, passed: summary.passed, total: summary.total, status: summary.status }) + '\n');
