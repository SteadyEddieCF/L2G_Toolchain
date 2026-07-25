import { test, expect } from '@playwright/test';
import { modules, stabilizePage, applyDarkMode } from './module-catalog.mjs';

async function normalizeBaselineOnlyFields(page, module) {
  if (!module.visualBaselineVersion) return;
  await page.evaluate((version) => {
    document.querySelectorAll('.hero h1 .small').forEach((node) => { node.textContent = version; });
  }, module.visualBaselineVersion);
  await page.waitForTimeout(50);
}

for (const module of modules.filter((entry) => entry.visual !== false)) {
  const baselineSlug = module.visualBaselineSlug || module.slug;

  test(`${module.slug}: light-mode landing baseline`, async ({ page }) => {
    await page.goto(module.path, { waitUntil: 'domcontentloaded' });
    await stabilizePage(page);
    await normalizeBaselineOnlyFields(page, module);
    await expect(page).toHaveScreenshot(`${baselineSlug}-light.png`, { fullPage: false });
  });

  if (module.darkStrategy) {
    test(`${module.slug}: dark-mode landing baseline`, async ({ page }) => {
      await page.goto(module.path, { waitUntil: 'domcontentloaded' });
      await stabilizePage(page);
      await applyDarkMode(page, module.darkStrategy);
      await normalizeBaselineOnlyFields(page, module);
      await expect(page).toHaveScreenshot(`${baselineSlug}-dark.png`, { fullPage: false });
    });
  }
}