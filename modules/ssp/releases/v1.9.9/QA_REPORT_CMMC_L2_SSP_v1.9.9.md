# QA report — CMMC L2 SSP v1.9.9

Overall result: **PASS**, with direct Windows `file://` acceptance remaining an independent confirmation because the managed browser blocks local-file navigation.

## Passed
- 110 authoritative controls in Single-System and exactly 110 requirements per module.
- Exact profile v0.1 object, 12 items, and historical v0.1 run preservation.
- v0.2 preview, explicit confirmation, and no governed-data mutation during preview.
- Ordered SME, corrective-action, Quality, corrective-action, and Project Director stages.
- Conditional N/A/exception rationale, blocker prevention, attestations, local-ID role conflicts, reopen/supersede, append-only history, and deterministic IDs.
- Source and referenced-artifact staleness, migration from v1.9.5/v1.9.5.1/v1.9.8, clean-browser restore, and canonical repeated export.
- Light/dark/constrained UI, keyboard trap and focus restoration, direct affected-record navigation, and print suppression.
- McFirecoal v1.2.0 clean/adversarial cases; zero browser requests, page errors, and console errors.
- Working-data and current registry schema validation.

## Evidence
See `evidence/` and `CMMC_L2_SSP_v1.9.9_Release_Manifest.json`. Runtime SHA-256: `4df58dd45c369fd2c3ec6e49e81fa8887f80859dddd4fbd9b00f410679144927`.
