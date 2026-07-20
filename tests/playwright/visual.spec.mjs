import { test, expect } from '@playwright/test';
import { modules, stabilizePage, applyDarkMode } from './module-catalog.mjs';

for (const module of modules) {
  test(`${module.slug}: light-mode landing baseline`, async ({ page }) => {
    await page.goto(module.path, { waitUntil: 'domcontentloaded' });
    await stabilizePage(page);
    await expect(page).toHaveScreenshot(`${module.slug}-light.png`, { fullPage: false });
  });

  if (module.darkStrategy) {
    test(`${module.slug}: dark-mode landing baseline`, async ({ page }) => {
      await page.goto(module.path, { waitUntil: 'domcontentloaded' });
      await stabilizePage(page);
      await applyDarkMode(page, module.darkStrategy);
      await expect(page).toHaveScreenshot(`${module.slug}-dark.png`, { fullPage: false });
    });
  }
}
