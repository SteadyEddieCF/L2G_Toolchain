import { test, expect } from '@playwright/test';
import { modules, stabilizePage, applyDarkMode } from './module-catalog.mjs';

for (const module of modules.filter((entry) => entry.visual !== false)) {
  const snapshotSlug = module.visualBaselineSlug || module.slug;
  const screenshotOptions = {
    fullPage: false,
    ...(Number.isInteger(module.visualMaxDiffPixels) ? { maxDiffPixels: module.visualMaxDiffPixels } : {})
  };

  test(`${module.slug}: light-mode landing baseline`, async ({ page }) => {
    await page.goto(module.path, { waitUntil: 'domcontentloaded' });
    await stabilizePage(page);
    await expect(page).toHaveScreenshot(`${snapshotSlug}-light.png`, screenshotOptions);
  });

  if (module.darkStrategy) {
    test(`${module.slug}: dark-mode landing baseline`, async ({ page }) => {
      await page.goto(module.path, { waitUntil: 'domcontentloaded' });
      await stabilizePage(page);
      await applyDarkMode(page, module.darkStrategy);
      await expect(page).toHaveScreenshot(`${snapshotSlug}-dark.png`, screenshotOptions);
    });
  }
}
