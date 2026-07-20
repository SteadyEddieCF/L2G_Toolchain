import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import { modules, stabilizePage } from './module-catalog.mjs';

const baseline = JSON.parse(
  fs.readFileSync(new URL('./accessibility-baseline.json', import.meta.url), 'utf8')
);

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

    const currentCritical = results.violations
      .filter((violation) => violation.impact === 'critical')
      .flatMap((violation) =>
        violation.nodes.map((node) => ({
          rule: violation.id,
          target: node.target.join(' >>> '),
          help: violation.help,
          helpUrl: violation.helpUrl
        }))
      );

    const approved = baseline.modules[module.slug] ?? [];
    const unexpected = currentCritical.filter(
      (finding) => !approved.some(
        (entry) => entry.rule === finding.rule && entry.target === finding.target
      )
    );

    const summary = {
      module: module.slug,
      critical_findings: currentCritical,
      approved_baseline: approved,
      unexpected_critical_findings: unexpected
    };
    await testInfo.attach(`${module.slug}-accessibility-summary.json`, {
      body: Buffer.from(JSON.stringify(summary, null, 2)),
      contentType: 'application/json'
    });

    expect(unexpected, JSON.stringify(summary, null, 2)).toEqual([]);
  });
}
