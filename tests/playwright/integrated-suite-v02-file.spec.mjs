import { test, expect } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const fileUrl = pathToFileURL(path.resolve('apps/integrated-suite-v0.2/dist/L2G_Integrated_Suite_Encrypted_Project_v0.2.0.html')).href;

test('runs from Windows file origin with zero external requests', async ({ browser }) => {
  const context = await browser.newContext({ bypassCSP: false, acceptDownloads: true });
  const page = await context.newPage();
  const external = [];
  const errors = [];
  page.on('request', request => {
    if (!request.url().startsWith('file:') && !request.url().startsWith('blob:') && !request.url().startsWith('data:')) external.push(request.url());
  });
  page.on('pageerror', error => errors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(fileUrl);
  await expect(page.getByTestId('app-shell')).toBeVisible();
  await expect(page.locator('[data-workspace]')).toHaveCount(8);
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
  await context.close();
});
