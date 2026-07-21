# CMMC L2 SSP v1.7.1 — Workshop v76 Exact Round-Trip Smoke

Status: **PASS**

Checks: **37/37 passed**

## Scope

Bounded exact-version smoke only. No SSP features were added and Workshop was not modified.

## Results

- PASS — Workshop exact version is v76: `v76`
- PASS — Workshop v76 supplies handoff kind: `l2g_ssp_handoff_v1`
- PASS — Workshop v76 supplies handoff version 1.0: `1.0`
- PASS — Workshop handoff contains 110 controls: `110`
- PASS — Repeated Workshop preview preserves fingerprint: `fnv1a-acabbe69`
- PASS — Repeated Workshop preview preserves counts
- PASS — SSP exact application version is v1.7.1
- PASS — SSP contains 110 controls
- PASS — SSP recognizes and opens the v76 preview
- PASS — SSP previews all 110 v76 controls
- PASS — No control or status candidate is automatically selected
- PASS — Existing SSP/accepted Word Review value is shown with higher precedence
- PASS — Lower-precedence candidate is flagged
- PASS — Existing Word-reviewed control remains unchanged
- PASS — No status is automatically applied
- PASS — Protected requirement remains unchanged
- PASS — Protected objectives remain unchanged
- PASS — Undo restores the pre-import identity
- PASS — Redo restores the selected identity
- PASS — Backup export is created
- PASS — SSP return kind is `l2g_ssp_return_package_v1`
- PASS — SSP return version is `1.0`
- PASS — SSP return contains 110 controls
- PASS — Repeated SSP export preserves package kind, version, and counts
- PASS — SSP return preserves the source handoff fingerprint
- PASS — Workshop v76 recognizes the SSP return
- PASS — Workshop preview sees 110 controls
- PASS — Workshop state remains unchanged before Apply
- PASS — Workshop preview begins with zero selections
- PASS — Workshop assessment/practice state remains unchanged before Apply
- PASS — Audit kind/version are `l2g_ssp_round_trip_audit_v1` / `0.1`
- PASS — Audit remains read-only (`foundation_read_only`)
- PASS — Repeated audit preserves counts
- PASS — Workshop handoff file is not mutated
- PASS — Page errors: 0; console errors: 0
- PASS — Network requests: 0
- PASS — Local-path leakage in generated packages: 0

## Artifact hashes

- Workshop v76 handoff: `416ee5fc57d3ff38da6a183b75781819bec45ec02fbd89174c4c20ab36e9eed1`
- SSP v1.7.1 return package: `d85bae0472dc95e0195ea297484c043a0365a71a66cf63362a81ec01ec43fe63`
- Workshop v76 audit package: `c523c892013658132a540e35003381de1ce2eab3e171561da86a1929e86cd441`
- SSP smoke backup: `1bc745bbb385510b47acc24f6cc647b031fe5e3a6d991d91d9c7eddd42957bf9`

## Promotion posture

The smoke supports an unmerged draft repository-promotion PR. It does not grant production-baseline approval; SME/QMS pilot and governance gates remain open.
