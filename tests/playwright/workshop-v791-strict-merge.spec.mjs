import { test } from '@playwright/test';

// Exact Builder governance records intentionally omit Workshop-only UI state.
// Add that non-governed operational field only while the test seeds the current
// Workshop ownership store. Source and workbook records remain byte-exact.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const originalStructuredClone = window.structuredClone.bind(window);
    window.structuredClone = value => {
      const cloned = originalStructuredClone(value);
      const currentAccepted = window.state?.evidenceOwnershipV77?.accepted_records;
      if (
        cloned &&
        typeof cloned === 'object' &&
        !Array.isArray(cloned) &&
        typeof cloned.ownership_record_id === 'string' &&
        !Object.prototype.hasOwnProperty.call(cloned, 'record_id') &&
        (!Array.isArray(currentAccepted) || currentAccepted.length === 0) &&
        !Object.prototype.hasOwnProperty.call(cloned, 'state')
      ) {
        cloned.state = 'accepted';
      }
      return cloned;
    };
  });
});

await import('./workshop-v791-strict-merge-core.mjs');
