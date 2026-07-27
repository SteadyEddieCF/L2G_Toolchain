# QA report — SSP v1.9.10 candidate

## Local checks completed

- exact promoted v1.9.9 baseline hash verified;
- runtime materialized to SHA-256 `a282173c4a8ea23e59d6091a5f68c09757393df2c2d18b92b72569f69310f91c`;
- 110 authoritative control cards retained;
- release identity 1.9.10 with app/schema identity 1.9.9;
- zero page errors, console errors, or network requests in local Chromium `setContent` regression;
- stable item IDs across repeated derivation;
- queue open/refresh/filter operations do not mutate governed data;
- synthetic RG-1, RG-2, missing-reviewer, missing-attestation, and open-corrective-action coverage;
- dark and constrained-viewport smoke.

## Independent gates required before promotion

Repository validation, Playwright runtime/axe, visual regression, and native Windows Chromium `file://` smoke must all pass on the exact PR head. This report does not claim those pending independent gates have passed.
