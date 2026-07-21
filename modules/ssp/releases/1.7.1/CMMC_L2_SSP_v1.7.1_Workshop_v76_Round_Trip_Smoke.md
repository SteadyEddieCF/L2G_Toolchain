# CMMC L2 SSP v1.7.1 ↔ Workshop v76 Exact-Version Round-Trip Smoke

**Result:** PASS — 32/32 checks passed.

This bounded smoke used the governed SSP v1.7.1 release candidate and the authoritative Workshop v76 runtime. No SSP features or Workshop source were changed.

## Artifacts

- `l2g_ssp_handoff_v1_mcfirecoal_v76.json`
- `l2g_ssp_return_package_v1_mcfirecoal_v1.7.1_v76_smoke.json`
- `l2g_ssp_round_trip_audit_v1_mcfirecoal_v76.json`
- `CMMC_L2_SSP_v1.7.1_v76_smoke_backup.json`

## Checks

- PASS — Workshop runtime identifies v76: v76
- PASS — Workshop state imported with McFirecoal identity: McFirecoal Federal Systems, Inc.
- PASS — Workshop v76 supplies handoff kind/version: l2g_ssp_handoff_v1 1.0
- PASS — Workshop handoff contains 110 controls: 110
- PASS — Repeated preview preserves control/status counts: 110/110
- PASS — Repeated preview preserves package fingerprint: fnv1a-9c8d0996 vs fnv1a-9c8d0996
- PASS — Downloaded handoff identity matches preview: fnv1a-9c8d0996
- PASS — SSP loads 110 controls: 110
- PASS — SSP recognizes and opens v76 handoff preview
- PASS — SSP preview contains 110 control groups: 110
- PASS — No control/status candidates auto-selected: 0
- PASS — Existing accepted value retains precedence in preview
- PASS — Imported draft candidate visibly lower precedence
- PASS — Backup export functional: 157443 bytes
- PASS — Only safe identity fields may preselect: 4
- PASS — Unselected accepted control value unchanged after Apply
- PASS — Undo and redo remain functional
- PASS — Protected requirement cannot be overwritten
- PASS — SSP exports return kind/version: l2g_ssp_return_package_v1 1.0
- PASS — SSP return contains 110 coherent controls: 110
- PASS — Return carries no assessment conclusions
- PASS — Workshop v76 recognizes return package
- PASS — Workshop return preview contains 110 controls: 110
- PASS — Workshop assessment state unchanged before Apply
- PASS — Workshop preview has zero selected fields: 0
- PASS — Optional audit kind/version remain read-only: l2g_ssp_round_trip_audit_v1 0.1
- PASS — Repeated return preview preserves package identity/counts
- PASS — No page errors
- PASS — No console errors
- PASS — No network requests
- PASS — No local-path leakage
- PASS — Authoritative input files not mutated

## Remaining gates

This smoke does not claim company-wide production-baseline approval. SME/QMS pilot, governance decisions, cross-browser execution, repository CI, and independent PR review remain open.
