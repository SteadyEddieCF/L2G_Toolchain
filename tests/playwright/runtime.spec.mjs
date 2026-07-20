import { test, expect } from '@playwright/test';
import { modules, stabilizePage } from './module-catalog.mjs';

for (const module of modules) {
  test(`${module.slug}: loads, stays offline, and exposes an interactive UI`, async ({ page }, testInfo) => {
    const pageErrors = [];
    const consoleErrors = [];
    const externalRequests = [];

    page.on('pageerror', (error) => pageErrors.push(String(error)));
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('request', (request) => {
      const url = request.url();
      if (/^https?:/i.test(url) && !url.startsWith('http://127.0.0.1:4173/')) {
        externalRequests.push(url);
      }
    });

    await page.goto(module.path, { waitUntil: 'domcontentloaded' });
    await stabilizePage(page);

    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveTitle(new RegExp(module.version.replaceAll('.', '\\.'), 'i'));

    const interactiveCount = await page.locator('button, input, select, textarea, a[href], [role="button"]').count();
    expect(interactiveCount).toBeGreaterThan(0);

    const storageResult = await page.evaluate(() => {
      const key = '__l2g_playwright_storage_probe__';
      try {
        localStorage.setItem(key, 'ok');
        const value = localStorage.getItem(key);
        localStorage.removeItem(key);
        return { writable: value === 'ok' };
      } catch (error) {
        return { writable: false, error: String(error) };
      }
    });
    expect(storageResult.writable, JSON.stringify(storageResult)).toBe(true);

    await testInfo.attach(`${module.slug}-console-errors.json`, {
      body: Buffer.from(JSON.stringify(consoleErrors, null, 2)),
      contentType: 'application/json'
    });

    expect(externalRequests, `Unexpected network requests: ${externalRequests.join(', ')}`).toEqual([]);
    expect(pageErrors, `Unhandled page errors: ${pageErrors.join('\n')}`).toEqual([]);
  });
}
