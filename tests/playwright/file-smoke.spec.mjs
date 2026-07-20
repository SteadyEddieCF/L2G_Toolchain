import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { modules, stabilizePage } from './module-catalog.mjs';

for (const module of modules) {
  test(`${module.slug}: Windows file-origin smoke`, async ({ page }) => {
    const absolutePath = path.resolve(process.cwd(), module.path.replace(/^\//, ''));
    const fileUrl = pathToFileURL(absolutePath).href;
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(String(error)));

    await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
    await stabilizePage(page);

    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveTitle(new RegExp(module.version.replaceAll('.', '\\.'), 'i'));

    const storage = await page.evaluate(() => {
      const key = '__l2g_file_origin_probe__';
      try {
        localStorage.setItem(key, 'ok');
        const value = localStorage.getItem(key);
        localStorage.removeItem(key);
        return value;
      } catch (error) {
        return String(error);
      }
    });
    expect(storage).toBe('ok');
    expect(pageErrors).toEqual([]);
  });
}
