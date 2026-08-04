import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { artifactUrl, fixtureDir, openMenu, PASSPHRASE, storedZipNames } from './integrated-suite-v03-helpers.mjs';

test.beforeEach(async ({ page }) => {
  await page.goto(artifactUrl);
  await expect(page.getByTestId('app-shell')).toBeVisible();
});

test('renders the eight-workspace engagement shell with restrictive CSP and no network', async ({ page }) => {
  const external = [];
  page.on('request', request => {
    if (!request.url().startsWith('http://127.0.0.1') && !request.url().startsWith('http://localhost') && !request.url().startsWith('blob:') && !request.url().startsWith('data:')) external.push(request.url());
  });
  await expect(page.locator('[data-workspace]')).toHaveCount(8);
  await expect(page.getByTestId('protection-state')).toContainText('Unprotected');
  const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');
  expect(csp).toContain("connect-src 'none'");
  expect(csp).toContain("default-src 'none'");
  await page.waitForTimeout(150);
  expect(external).toEqual([]);
});

test('filters client data before render without hidden candidate or inspector leakage', async ({ page }) => {
  await page.locator('[data-workspace="pre-engagement"]').click();
  await expect(page.getByText('Avery Advisor')).toBeVisible();
  await page.locator('#profile-select').selectOption('client');
  await expect(page.getByText('Morgan Client')).toBeVisible();
  await expect(page.getByText('Avery Advisor')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Context' })).toHaveCount(0);
  await page.locator('[data-workspace="reviews-actions"]').click();
  await expect(page.getByText('No candidates visible')).toBeVisible();
  await expect(page.getByText('legacy-metadata')).toHaveCount(0);
  await expect(page.locator('[data-candidate-card]')).toHaveCount(0);
  await expect(page.locator('.inspector')).toHaveCount(0);
});

test('accepts an engagement candidate only through an explicit Advisor command', async ({ page }) => {
  await page.locator('[data-workspace="pre-engagement"]').click();
  const context = page.locator('[data-identity="delivery_context"]');
  const before = await context.inputValue();
  expect(before).not.toContain('Facilitated CMMC Level 2');
  await page.locator('[data-workspace="reviews-actions"]').click();
  const card = page.locator('[data-candidate-card]').filter({ hasText: 'legacy-metadata' });
  await card.getByRole('button', { name: 'Accept' }).click();
  await page.locator('#candidate-rationale').fill('Accepted during synthetic browser validation.');
  await page.getByRole('button', { name: 'Confirm accept' }).click();
  await expect(page.getByText('Candidate accept command completed.')).toBeVisible();
  await page.locator('[data-workspace="pre-engagement"]').click();
  await expect(page.locator('[data-identity="delivery_context"]')).toHaveValue(/Facilitated CMMC Level 2/);
  await page.getByRole('button', { name: /Undo/ }).click();
  await expect(page.locator('[data-identity="delivery_context"]')).toHaveValue(before);
  await page.getByRole('button', { name: /Redo/ }).click();
  await expect(page.locator('[data-identity="delivery_context"]')).toHaveValue(/Facilitated CMMC Level 2/);
});

test('creates an encrypted save, excludes known plaintext, and reopens it', async ({ page }) => {
  await page.evaluate(() => Object.defineProperty(window, 'showSaveFilePicker', { value: undefined, configurable: true }));
  await openMenu(page);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('menuitem', { name: 'Save encrypted project' }).click();
  await page.locator('#pass-one').fill(PASSPHRASE);
  await page.locator('#pass-two').fill(PASSPHRASE);
  await page.getByRole('button', { name: 'Create encrypted session' }).click();
  const download = await downloadPromise;
  const savedPath = await download.path();
  expect(savedPath).toBeTruthy();
  const bytes = fs.readFileSync(savedPath);
  expect(storedZipNames(bytes)).toEqual(['ciphertext.bin', 'envelope.json']);
  expect(bytes.toString('utf8')).not.toContain('McFirecoal Synthetic Client');
  await page.locator('[data-workspace="pre-engagement"]').click();
  const input = page.locator('[data-identity="engagement_name"]');
  await input.fill('Temporary Browser Name');
  await input.blur();
  await page.locator('#open-input').setInputFiles(savedPath);
  await page.locator('#unlock-pass').fill(PASSPHRASE);
  await page.getByRole('button', { name: 'Unlock' }).click();
  await expect(page.locator('#top-engagement-name')).toHaveText('McFirecoal Synthetic CMMC Engagement');
  await expect(page.getByTestId('protection-state')).toContainText('Encrypted');
});

test('migrates a valid v0.2 encrypted project and requires a v0.3 save', async ({ page }) => {
  const legacy = path.join(fixtureDir, 'legacy-v02-encrypted-project.l2g');
  await page.locator('#open-input').setInputFiles(legacy);
  await page.locator('#unlock-pass').fill(PASSPHRASE);
  await page.getByRole('button', { name: 'Unlock' }).click();
  await expect(page.locator('#top-engagement-name')).toHaveText('Legacy Synthetic Engagement');
  await expect(page.getByText('Migration checkpoint created')).toBeVisible();
  await expect(page.getByTestId('save-state')).toContainText(/migrated|save required/i);
  await page.locator('[data-workspace="reviews-actions"]').click();
  await expect(page.getByText(/Migrated legacy engagement metadata/)).toBeVisible();
});

test('rejects a wrong passphrase without changing governed state', async ({ page }) => {
  const fixed = path.join(fixtureDir, 'fixed-v03-project.l2g');
  const original = await page.locator('#top-engagement-name').innerText();
  await page.locator('#open-input').setInputFiles(fixed);
  await page.locator('#unlock-pass').fill('Wrong-Passphrase-Value!');
  await page.getByRole('button', { name: 'Unlock' }).click();
  await expect(page.getByText(/passphrase is incorrect or the encrypted content was modified/i)).toBeVisible();
  await expect(page.locator('#top-engagement-name')).toHaveText(original);
});

test('restores encrypted browser recovery after explicit unlock', async ({ page }) => {
  await page.evaluate(() => Object.defineProperty(window, 'showSaveFilePicker', { value: undefined, configurable: true }));
  await openMenu(page);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('menuitem', { name: 'Save encrypted project' }).click();
  await page.locator('#pass-one').fill(PASSPHRASE);
  await page.locator('#pass-two').fill(PASSPHRASE);
  await page.getByRole('button', { name: 'Create encrypted session' }).click();
  await downloadPromise;
  await page.locator('[data-workspace="pre-engagement"]').click();
  const input = page.locator('[data-identity="engagement_name"]');
  await input.fill('Recovered v0.3 Engagement');
  await input.blur();
  await expect(page.getByTestId('save-state')).toContainText('encrypted browser recovery', { timeout: 15000 });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Encrypted recovery available' })).toBeVisible();
  await page.getByRole('button', { name: 'Unlock recovery' }).click();
  await page.locator('#unlock-pass').fill(PASSPHRASE);
  await page.getByRole('button', { name: 'Unlock' }).click();
  await expect(page.locator('#top-engagement-name')).toHaveText('Recovered v0.3 Engagement');
});

test('passes accessibility checks in Advisor, Client, and narrow responsive views', async ({ page }) => {
  let results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(item => ['critical', 'serious'].includes(item.impact ?? ''))).toEqual([]);
  await page.locator('[data-workspace="pre-engagement"]').click();
  await page.locator('#profile-select').selectOption('client');
  results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(item => ['critical', 'serious'].includes(item.impact ?? ''))).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByTestId('app-shell')).toBeVisible();
  await expect(page.locator('[data-workspace]')).toHaveCount(8);
  results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(item => ['critical', 'serious'].includes(item.impact ?? ''))).toEqual([]);
});
