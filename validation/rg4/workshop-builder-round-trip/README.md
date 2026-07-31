# RG-4 Workshop / Builder Round-Trip Validation

This directory contains the Workshop-owned regression evidence required by issue #101.

- Baseline: `8804efcfd7b190117aea76ef48929b2c171dbc70`
- Workshop: v79
- Builder/Merger: v3.10
- SSP: v1.9.17
- Sidecar registry stability: `proposal`
- Result: technical routes largely pass, but promotion is blocked by documented compatibility conditions.

The exact generated JSON/XLSX artifacts are uploaded by Playwright as Actions evidence and are included in the external checksummed regression-evidence ZIP. Large generated binaries are not committed to repository history.

Run the static evidence gate after current runtimes have been materialized:

```text
python validation/rg4/workshop-builder-round-trip/verify_rg4_workshop_builder.py
```

Run the focused browser route:

```text
npx playwright test tests/playwright/rg4-workshop-builder-round-trip.spec.mjs --project=chromium
```

This validation does not modify the Workshop, Builder/Merger, SSP, DocConverter, Scoper, or Control Center runtimes; it does not modify the contract registry or the historical v79 suite snapshot; and it does not promote the RG-4 sidecar route.
