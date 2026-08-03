import { test, expect } from '@playwright/test';
import { artifactPath, artifactUrl, addParticipant } from './integrated-suite-foundation-helpers.mjs';

test.beforeEach(async ({ page }) => {
  await page.goto(artifactUrl);
  await expect(page.getByTestId('app-shell')).toBeVisible();
});

test('renders the eight-workspace shell with truthful profile and save language', async ({ page }) => {
  await expect(page.locator('[data-workspace]')).toHaveCount(8);
  await expect(page.getByText('Presentation profile only—not a security boundary.')).toBeVisible();
  await expect(page.getByTestId('save-state')).toContainText(/browser recovery|project file/i);
  await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
  const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');
  expect(csp).toContain("connect-src 'none'");
  expect(csp).toContain("default-src 'none'");
});

test('enforces CSP and makes no unexpected runtime requests', async ({ browser }) => {
  const context = await browser.newContext({ bypassCSP: false });
  const page = await context.newPage();
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto(artifactUrl);
  await expect(page.getByTestId('app-shell')).toBeVisible();
  const result = await page.evaluate(async () => {
    try { await fetch('https://example.invalid/l2g-network-test'); return 'unexpected-success'; }
    catch (error) { return error instanceof Error ? error.name : String(error); }
  });
  expect(result).not.toBe('unexpected-success');
  expect(requests.filter(url => !url.includes(artifactPath))).toEqual([]);
  await context.close();
});

test('edits engagement data with human-readable Undo and Redo', async ({ page }) => {
  await page.locator('[data-workspace="pre-engagement"]').click();
  const input = page.locator('[data-engagement-field="engagement_name"]');
  await input.fill('McFirecoal Foundation Round Trip');
  await input.blur();
  await expect(page.locator('#top-engagement-name')).toHaveText('McFirecoal Foundation Round Trip');
  await expect(page.getByRole('button', { name: /Undo Update engagement name/i })).toBeEnabled();
  await page.getByRole('button', { name: /Undo Update engagement name/i }).click();
  await expect(page.locator('#top-engagement-name')).toHaveText('Synthetic Foundation Engagement');
  await page.getByRole('button', { name: /Redo Update engagement name/i }).click();
  await expect(page.locator('#top-engagement-name')).toHaveText('McFirecoal Foundation Round Trip');
});

test('filters advisor-only participant content before Client View renders', async ({ page }) => {
  await page.locator('[data-workspace="pre-engagement"]').click();
  await addParticipant(page, { name: 'Hidden Advisor', role: 'Advisor', visibility: 'advisor-only' });
  await addParticipant(page, { name: 'Visible Client', role: 'System Owner', visibility: 'client-safe' });
  await expect(page.getByText('Hidden Advisor')).toBeVisible();
  await page.locator('#profile-select').selectOption('client');
  await expect(page.getByText('Client View active. This is not a security boundary.')).toBeVisible();
  await expect(page.getByText('Hidden Advisor')).toHaveCount(0);
  await expect(page.getByText('Visible Client')).toBeVisible();
  await expect(page.locator('[data-engagement-field="engagement_name"]')).toBeDisabled();
});
