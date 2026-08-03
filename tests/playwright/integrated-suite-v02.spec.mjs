import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { artifactUrl, fixtureDir, openMenu, storedZipNames } from './integrated-suite-v02-helpers.mjs';

const PASSPHRASE = 'Synthetic-Test-Passphrase-Only!';

test.beforeEach(async ({ page }) => {
  await page.goto(artifactUrl);
  await expect(page.getByTestId('app-shell')).toBeVisible();
});

test('renders eight workspaces, unprotected state, and restrictive CSP', async ({ page }) => {
  await expect(page.locator('[data-workspace]')).toHaveCount(8);
  await expect(page.getByTestId('protection-state')).toContainText('Unprotected');
  const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');
  expect(csp).toContain("connect-src 'none'");
  expect(csp).toContain("default-src 'none'");
});

test('creates encrypted save, hides known plaintext, and reopens after passphrase validation', async ({ page }) => {
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
  const input = page.locator('[data-engagement="engagement_name"]');
  await input.fill('Temporary Name');
  await input.blur();
  await page.locator('#open-input').setInputFiles(savedPath);
  await page.locator('#unlock-pass').fill(PASSPHRASE);
  await page.getByRole('button', { name: 'Unlock' }).click();
  await expect(page.locator('#top-engagement-name')).toHaveText('Synthetic Encrypted Engagement');
  await expect(page.getByTestId('protection-state')).toContainText('Encrypted');
});

test('wrong passphrase rejects without changing active project', async ({ page }) => {
  const fixed = path.join(fixtureDir, 'fixed-encrypted-project.l2g');
  const original = await page.locator('#top-engagement-name').innerText();
  await page.locator('#open-input').setInputFiles(fixed);
  await page.locator('#unlock-pass').fill('Wrong-Passphrase-Value!');
  await page.getByRole('button', { name: 'Unlock' }).click();
  await expect(page.getByText(/passphrase is incorrect or the encrypted content was modified/i)).toBeVisible();
  await expect(page.locator('#top-engagement-name')).toHaveText(original);
});

test('encrypted browser recovery requires explicit unlock after reload', async ({ page }) => {
  await page.evaluate(() => Object.defineProperty(window, 'showSaveFilePicker', { value: undefined, configurable: true }));
  await openMenu(page);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('menuitem', { name: 'Save encrypted project' }).click();
  await page.locator('#pass-one').fill(PASSPHRASE);
  await page.locator('#pass-two').fill(PASSPHRASE);
  await page.getByRole('button', { name: 'Create encrypted session' }).click();
  await downloadPromise;
  await page.locator('[data-workspace="pre-engagement"]').click();
  const input = page.locator('[data-engagement="engagement_name"]');
  await input.fill('Recovered Encrypted Engagement');
  await input.blur();
  await expect(page.getByTestId('save-state')).toContainText('encrypted browser recovery', { timeout: 15000 });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Encrypted recovery available' })).toBeVisible();
  await page.getByRole('button', { name: 'Unlock recovery' }).click();
  await page.locator('#unlock-pass').fill(PASSPHRASE);
  await page.getByRole('button', { name: 'Unlock' }).click();
  await expect(page.locator('#top-engagement-name')).toHaveText('Recovered Encrypted Engagement');
});

test('passes axe-core on advisor and client surfaces', async ({ page }) => {
  let results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(item => ['critical', 'serious'].includes(item.impact ?? ''))).toEqual([]);
  await page.locator('[data-workspace="pre-engagement"]').click();
  await page.locator('#profile-select').selectOption('client');
  results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(item => ['critical', 'serious'].includes(item.impact ?? ''))).toEqual([]);
});
