import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { modules, stabilizePage } from './module-catalog.mjs';

for (const module of modules) {
  test(`${module.slug}: axe-core accessibility scan`, async ({ page }, testInfo) => {
    await page.goto(module.path, { waitUntil: 'domcontentloaded' });
    await stabilizePage(page);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    await testInfo.attach(`${module.slug}-axe.json`, {
      body: Buffer.from(JSON.stringify(results, null, 2)),
      contentType: 'application/json'
    });

    const critical = results.violations.filter((violation) => violation.impact === 'critical');
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
  });
}
