import { test, expect } from '@playwright/test';

const route = '/modules/builder-merger/releases/v3.10/L2G-BM_v3.10.html';

const frozenChecks = [
  ['WQA-PACKAGE-OPEN', 'automated', 'blocking'],
  ['WQA-SOURCE-IDENTITY', 'automated', 'blocking'],
  ['WQA-UNRESOLVED-TOKENS', 'automated', 'blocking'],
  ['WQA-COMMENTS-REVISIONS', 'automated', 'blocking'],
  ['WQA-LAYOUT-HUMAN', 'human', 'blocking']
];

test.describe('Builder/Merger v3.10 SSP Final Word-QA producer', () => {
  test('route shell, frozen profile, themes, keyboard, and offline policy', async ({ page }) => {
    const pageErrors = [];
    const unexpectedConsole = [];
    page.on('pageerror', (error) => pageErrors.push(String(error)));
    page.on('console', (message) => {
      if (message.type() === 'error') unexpectedConsole.push(message.text());
    });

    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await page.getByRole('tab', { name: 'SSP Final Word-QA' }).click();
    await expect(page.getByRole('heading', { name: 'SSP Final Word-QA Sidecar' })).toBeVisible();
    await expect(page.getByLabel('Select SSP-generated DOCX')).toBeVisible();

    const profile = await page.evaluate(() => WQA_PROFILE.checks.map((check) => [
      check.check_id,
      check.classification,
      check.severity
    ]));
    expect(profile).toEqual(frozenChecks);

    await page.getByRole('button', { name: 'Light theme' }).click();
    await expect(page.locator('body')).toHaveClass(/wqa-light-theme/);
    await page.getByRole('button', { name: 'Dark theme' }).click();
    await expect(page.locator('body')).not.toHaveClass(/wqa-light-theme/);

    await page.getByRole('tab', { name: 'SSP Final Word-QA' }).focus();
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();

    const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');
    expect(csp).toContain("connect-src 'none'");
    expect(pageErrors).toEqual([]);
    expect(unexpectedConsole).toEqual([]);
  });
});
