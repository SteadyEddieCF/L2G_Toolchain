import { test, expect } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const fileUrl = pathToFileURL(path.resolve('apps/integrated-suite/dist/L2G_Integrated_Suite_Foundation_v0.1.0.html')).href;

test('runs natively from a Windows file origin with zero external requests', async ({ browser }) => {
  const context = await browser.newContext({ bypassCSP: false, acceptDownloads: true });
  const page = await context.newPage();
  const external = [];
  page.on('request', request => {
    if (!request.url().startsWith('file:') && !request.url().startsWith('blob:') && !request.url().startsWith('data:')) external.push(request.url());
  });
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(fileUrl);
  await expect(page.getByTestId('app-shell')).toBeVisible();
  await expect(page.locator('[data-workspace]')).toHaveCount(8);
  await page.locator('[data-workspace="pre-engagement"]').click();
  const input = page.locator('[data-engagement-field="engagement_name"]');
  await input.fill('Windows File Origin Foundation');
  await input.blur();
  await page.getByRole('button', { name: /Undo Update engagement name/i }).click();
  await expect(page.locator('#top-engagement-name')).toHaveText('Synthetic Foundation Engagement');
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
  await context.close();
});
