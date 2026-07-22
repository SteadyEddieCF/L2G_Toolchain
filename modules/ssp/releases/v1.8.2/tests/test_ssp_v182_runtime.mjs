import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';

const root = path.resolve(import.meta.dirname, '..');
const htmlPath = path.join(root, 'build/CMMC_L2_SSP_v1.8.2/CMMC_L2_SSP_Modern_Editable_v1.8.2.html');
const resultPath = path.join(root, 'build/CMMC_L2_SSP_v1.8.2/CMMC_L2_SSP_v1.8.2_Runtime_Regression.json');
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
  url: 'https://ssp.local/v1.8.2',
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
assert.equal(document.querySelector('.brand-version').textContent.trim(), 'v1.8.2');
assert.equal(document.querySelector('meta[name="application-version"]').content, '1.8.2');
pass('Application boots with 110 controls and consistent v1.8.2 identity');
assert.equal(document.querySelector('#portfolioModularPanel').hidden, true);
pass('Single-System remains the default');

const base = hooks.portfolioCreateModularState('McFirecoal Portfolio');
const anchor = base.modules[0];
const product = { ...anchor, moduleId: 'module-product-alpha', parentModuleId: anchor.moduleId, moduleType: 'product', name: 'Product Alpha', shortName: 'Alpha' };
const sibling = { ...anchor, moduleId: 'module-product-bravo', parentModuleId: anchor.moduleId, moduleType: 'product', name: 'Product Bravo', shortName: 'Bravo' };
const shared = { ...anchor, moduleId: 'module-shared-security', parentModuleId: anchor.moduleId, moduleType: 'shared-service', name: 'Shared Security', shortName: 'Shared Security' };
base.modules.push(product, sibling, shared);
base.moduleRequirements = hooks.portfolioEnsureRequirementRecords(base.moduleRequirements, base.modules);
assert.equal(base.moduleRequirements.length, 440);
pass('Four modules receive exactly 440 stable requirement records');

const get = (moduleId, requirementId) => base.moduleRequirements.find(r => r.moduleId === moduleId && r.requirementId === requirementId);
let source = get(anchor.moduleId, '3.1.1');
Object.assign(source, { applicability: 'applicable-locally-implemented', implementationStatus: 'implemented', implementationNarrative: 'Anchor implementation v1', responsibilityModel: 'organization-led', ownerIds: ['anchor-owner'], evidenceIds: ['evidence-anchor'], updatedAt: '2026-07-22T01:00:00Z' });
let target = get(product.moduleId, '3.1.1');
Object.assign(target, { applicability: 'applicable-inherited', inheritedFromModuleId: anchor.moduleId, inheritanceType: 'parent' });
base.moduleRequirements = hooks.portfolioRefreshInheritanceStatuses(base.moduleRequirements, base.modules);
target = get(product.moduleId, '3.1.1');
assert.equal(target.inheritanceStatus, 'source-pending');
target = hooks.portfolioApplyInheritance(target, source, anchor);
base.moduleRequirements = base.moduleRequirements.map(r => r.requirementRecordId === target.requirementRecordId ? target : r);
base.moduleRequirements = hooks.portfolioRefreshInheritanceStatuses(base.moduleRequirements, base.modules);
target = get(product.moduleId, '3.1.1');
assert.equal(target.inheritanceStatus, 'current');
assert.equal(target.implementationNarrative, 'Anchor implementation v1');
assert.deepEqual(Array.from(target.ownerIds), ['anchor-owner']);
assert.match(target.inheritedSnapshotFingerprint, /^fnv1a64-[0-9a-f]{16}$/);
pass('Deterministic inheritance copies the fixed field set and records a canonical fingerprint');

source = get(anchor.moduleId, '3.1.1');
source.implementationNarrative = 'Anchor implementation v2';
source.updatedAt = '2026-07-22T02:00:00Z';
base.moduleRequirements = hooks.portfolioRefreshInheritanceStatuses(base.moduleRequirements, base.modules);
target = get(product.moduleId, '3.1.1');
assert.equal(target.inheritanceStatus, 'stale');
assert.equal(target.implementationNarrative, 'Anchor implementation v1');
pass('Parent changes mark inherited records stale without overwriting child snapshots');

let supplementSource = get(anchor.moduleId, '3.1.2');
Object.assign(supplementSource, { applicability: 'applicable-locally-implemented', implementationStatus: 'implemented', implementationNarrative: 'Parent session rule', responsibilityModel: 'organization-led', updatedAt: '2026-07-22T01:00:00Z' });
let supplement = get(product.moduleId, '3.1.2');
Object.assign(supplement, { applicability: 'applicable-inherited-with-local-supplement', inheritedFromModuleId: anchor.moduleId, inheritanceType: 'supplement', supplementNarrative: 'Product-specific enforcement', supplementOwnerIds: ['product-owner'], supplementEvidenceIds: ['product-evidence'] });
supplement = hooks.portfolioApplyInheritance(supplement, supplementSource, anchor);
assert.equal(supplement.implementationNarrative, 'Parent session rule');
assert.equal(supplement.supplementNarrative, 'Product-specific enforcement');
assert.deepEqual(Array.from(supplement.supplementOwnerIds), ['product-owner']);
pass('Local supplements remain separate from the inherited base snapshot');

let overrideSource = get(anchor.moduleId, '3.1.3');
Object.assign(overrideSource, { applicability: 'applicable-locally-implemented', implementationStatus: 'implemented', implementationNarrative: 'Parent media flow', responsibilityModel: 'organization-led', updatedAt: '2026-07-22T01:00:00Z' });
let override = get(product.moduleId, '3.1.3');
Object.assign(override, { applicability: 'applicable-inherited', inheritedFromModuleId: anchor.moduleId, inheritanceType: 'parent', implementationNarrative: 'Approved product exception', overrideState: 'local-override', overrideRationale: 'Product architecture requires a documented alternate implementation.', overrideFields: ['implementationNarrative'] });
override = hooks.portfolioApplyInheritance(override, overrideSource, anchor);
assert.equal(override.implementationNarrative, 'Approved product exception');
assert.equal(override.inheritanceStatus, 'current');
assert.ok(override.inheritedSnapshotFingerprint);
pass('Governed override preserves local fields while retaining source fingerprint');

const invalidOverride = { ...override, requirementRecordId: 'requirement-invalid-override', requirementId: '3.1.4', overrideRationale: '' };
assert.throws(() => hooks.portfolioNormalizeRequirement(invalidOverride, new Set(base.modules.map(m => m.moduleId)), new Set(base.moduleRequirements.map(r => r.requirementId))), /override without rationale/i);
pass('Local override without rationale is rejected');

const unauthorized = base.moduleRequirements.map(r => ({ ...r }));
const unauthorizedTarget = unauthorized.find(r => r.moduleId === product.moduleId && r.requirementId === '3.2.1');
Object.assign(unauthorizedTarget, { applicability: 'applicable-inherited', inheritedFromModuleId: sibling.moduleId });
assert.throws(() => hooks.portfolioValidateInheritance(unauthorized, base.modules), /ancestor or active shared-service/i);
pass('Sibling product cannot become an inheritance source');

const cycleRecords = base.moduleRequirements.map(r => ({ ...r }));
const anchorCycle = cycleRecords.find(r => r.moduleId === anchor.moduleId && r.requirementId === '3.3.1');
const sharedCycle = cycleRecords.find(r => r.moduleId === shared.moduleId && r.requirementId === '3.3.1');
Object.assign(anchorCycle, { applicability: 'applicable-inherited', inheritedFromModuleId: shared.moduleId });
Object.assign(sharedCycle, { applicability: 'applicable-inherited', inheritedFromModuleId: anchor.moduleId });
assert.throws(() => hooks.portfolioValidateInheritance(cycleRecords, base.modules), /Circular requirement inheritance/i);
pass('Circular per-requirement inheritance is rejected');

const legacy = structuredClone(base);
legacy.schemaVersion = '1.1.0';
legacy.portfolio.schemaVersion = '1.1.0';
legacy.moduleRequirements = legacy.moduleRequirements.map(r => {
  const copy = { ...r };
  for (const key of ['inheritedSourceRecordId','inheritedSourceRecordVersion','inheritedSnapshotAlgorithm','inheritedSnapshotFingerprint','inheritedSnapshotAt','inheritanceStatus','supplementNarrative','supplementOwnerIds','supplementEvidenceIds','overrideFields']) delete copy[key];
  return copy;
});
const migrated = hooks.portfolioNormalizeState(legacy);
assert.equal(migrated.schemaVersion, '1.2.0');
assert.equal(migrated.moduleRequirements.length, 440);
assert.ok(migrated.moduleRequirements.some(r => r.applicability === 'applicable-inherited' && r.inheritanceStatus === 'source-pending'));
pass('v1.8.1 declarations migrate without invented source snapshots');

const packaged = { package_kind: 'cmmc_l2_ssp_portfolio_foundation_v1', package_version: '1.2', foundation: migrated, anchorWorkspace: hooks.collectData(true) };
const roundTrip = hooks.portfolioNormalizeState(hooks.migrateData(packaged).data.portfolioFoundation);
assert.equal(roundTrip.moduleRequirements.length, 440);
pass('Portfolio 1.2 JSON round trip preserves module requirement cardinality');

const summary = { release: 'v1.8.2', suite: 'happy-dom-runtime-inheritance', status: 'passed', passed: checks.length, total: checks.length, checks };
fs.writeFileSync(resultPath, JSON.stringify(summary, null, 2) + '\n');
process.stdout.write(JSON.stringify({ release: summary.release, passed: summary.passed, total: summary.total, status: summary.status }) + '\n');
