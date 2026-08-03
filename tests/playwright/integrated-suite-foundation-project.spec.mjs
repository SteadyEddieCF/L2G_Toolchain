import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { artifactUrl, fixtureDir, openOverflow, readStoredZipNames } from './integrated-suite-foundation-helpers.mjs';

test.beforeEach(async ({ page }) => {
  await page.goto(artifactUrl);
  await expect(page.getByTestId('app-shell')).toBeVisible();
});

test('saves and reopens a deterministic project after full validation', async ({ page }) => {
  await page.locator('[data-workspace="pre-engagement"]').click();
  const input = page.locator('[data-engagement-field="engagement_name"]');
  await input.fill('Saved Foundation Engagement');
  await input.blur();
  await page.evaluate(() => Object.defineProperty(window, 'showSaveFilePicker', { value: undefined, configurable: true }));
  await openOverflow(page);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('menuitem', { name: 'Save As' }).click();
  const download = await downloadPromise;
  const savedPath = await download.path();
  expect(savedPath).toBeTruthy();
  const buffer = fs.readFileSync(savedPath);
  expect(readStoredZipNames(buffer)).toEqual([
    'compatibility/current-registry.json',
    'domains/engagement.json',
    'domains/reviews-actions.json',
    'history/checkpoints.json',
    'history/events.ndjson',
    'integrity/sha256-manifest.json',
    'manifest.json'
  ]);
  await input.fill('Temporary Unsaved Name');
  await input.blur();
  await page.locator('#open-project-input').setInputFiles(savedPath);
  await expect(page.getByText('Project opened only after structure and integrity validation passed.')).toBeVisible();
  await expect(page.locator('#top-engagement-name')).toHaveText('Saved Foundation Engagement');
});

test('rejects malformed, compressed, duplicate, traversal, duplicate-key, and tampered projects without mutation', async ({ page }) => {
  const original = await page.locator('#top-engagement-name').innerText();
  const invalidFixtures = [
    'invalid-compressed-entry.l2g',
    'invalid-duplicate-path.l2g',
    'invalid-path-traversal.l2g',
    'invalid-duplicate-json-key.l2g',
    'invalid-tampered-integrity.l2g'
  ];
  for (const fixture of invalidFixtures) {
    await page.locator('#open-project-input').setInputFiles(path.join(fixtureDir, fixture));
    await expect(page.getByText(/Project rejected:/)).toBeVisible();
    await expect(page.locator('#top-engagement-name')).toHaveText(original);
  }
});

test('creates and restores a checkpoint without erasing history', async ({ page }) => {
  await page.locator('[data-workspace="pre-engagement"]').click();
  page.once('dialog', dialog => dialog.accept('Before identity change'));
  await openOverflow(page);
  await page.getByRole('menuitem', { name: 'Create checkpoint' }).click();
  const input = page.locator('[data-engagement-field="engagement_name"]');
  await input.fill('Changed after checkpoint');
  await input.blur();
  await page.locator('[data-workspace="reviews-actions"]').click();
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Restore' }).click();
  await expect(page.getByText('Checkpoint restored. Prior history was retained.')).toBeVisible();
  await expect(page.locator('#top-engagement-name')).toHaveText('Synthetic Foundation Engagement');
  await expect(page.getByText(/Restored checkpoint/)).toBeVisible();
});

test('restores browser recovery only after explicit choice', async ({ page }) => {
  await page.locator('[data-workspace="pre-engagement"]').click();
  const input = page.locator('[data-engagement-field="engagement_name"]');
  await input.fill('Recovered Foundation Engagement');
  await input.blur();
  await expect(page.getByTestId('save-state')).toHaveText('Saved in browser recovery; project file not written', { timeout: 5000 });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Recovery checkpoint available' })).toBeVisible();
  await page.getByRole('button', { name: 'Restore recovery' }).click();
  await expect(page.locator('#top-engagement-name')).toHaveText('Recovered Foundation Engagement');
});
