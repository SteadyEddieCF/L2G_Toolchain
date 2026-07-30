# L2G Builder/Merger v3.10 Release Notes

**Release date:** 2026-07-30  
**Status:** Candidate / unvalidated proposal route  
**Baseline:** L2G Builder/Merger v3.8  
**Reserved version:** v3.9 remains reserved for Advisor and Client Delivery Profiles  
**Implementation branch:** `release/builder-merger-v3.10-rg4-word-qa-producer`  
**Initial PR base:** `contracts/rg4-ssp-word-qa-sidecar-v1` at `cb5c41abf015d7eee095b10fabe2fc0059473e89`

## Release focus

v3.10 adds the bounded local/offline **RG-4 SSP Final Word-QA Sidecar Producer**. It loads one exact SSP-generated DOCX, inspects the Open XML package, reconciles the embedded SSP Word-export manifest, runs the frozen ordered QA checks, captures one required local human layout assertion, and exports `l2g_ssp_word_qa_sidecar_v1` version `1.0` JSON.

The source DOCX is never silently modified. The route produces final Word-QA evidence only. It does not determine source currency, SSP acceptance, supersession, CMMC readiness, compliance, assessment, certification, scoring, technical accuracy, or client-release approval.

## New workflow

1. Select one SSP-generated DOCX.
2. Calculate exact DOCX size and SHA-256.
3. Inspect ZIP/Open XML structure and required parts.
4. Extract and hash the embedded SSP Word-export manifest.
5. Reconcile manifest, source, scope, and exact artifact identity.
6. Run the four frozen automated checks.
7. Complete the required local human layout review.
8. Preview and export one sidecar JSON.
9. Optionally export a local Markdown QA report or print summary.

## Frozen checks

The producer emits exactly these checks in this order:

1. `WQA-PACKAGE-OPEN` — automated, blocking
2. `WQA-SOURCE-IDENTITY` — automated, blocking
3. `WQA-UNRESOLVED-TOKENS` — automated, blocking
4. `WQA-COMMENTS-REVISIONS` — automated, blocking
5. `WQA-LAYOUT-HUMAN` — human, blocking

No check is added, removed, renamed, reordered, reclassified, or marked not applicable under contract version 1.0.

## Aggregate behavior

- Any failed blocking check yields `qa_blocked`.
- No failed blocking check with an unresolved required human review yields `qa_incomplete`.
- `qa_complete` is available only when all five checks pass and exactly one valid local assertion is linked to the human check.
- Local reviewer labels remain unauthenticated and unsigned.

## Exact identity behavior

v3.10 implements the frozen canonical JSON rules for:

- QA-profile identity;
- lineage key;
- sidecar ID;
- package fingerprint;
- UTC second-resolution timestamps;
- attempts and immediate retry linkage;
- deterministic repeated output with fixed inputs and clock.

## Existing-route compatibility

The prior Builder/Merger routes remain available:

- Workshop Handoff `l2g_workbook_handoff_v1` version 1.7;
- Workbook Merge `l2g_workbook_merge_v1` version 1.1;
- optional Builder Decision Plan `l2g_builder_decision_plan_v1` version 1.0;
- Create from External CSV.

A pre-release reconciliation found the v3.8 runtime emitted Workbook Merge package version `1.0` even though the frozen registry and release pointer identify version `1.1`. v3.10 corrects only that package-version metadata and associated UI labels to `1.1`; the route structure and extraction behavior are otherwise unchanged.

## Accessibility and presentation

- Adds light/dark theme control for the Word-QA route.
- Adds visible keyboard focus.
- Adds accessible labels for the existing Build workbook and handoff file inputs.
- Corrects the mode tablist structure so utility buttons are not tab children.
- Preserves constrained-viewport usability and print output.

## Offline and source-safety controls

- Standalone HTML; no remote script dependencies.
- Content Security Policy retains `connect-src 'none'`.
- No `fetch`, `XMLHttpRequest`, `sendBeacon`, telemetry, API key, or cloud upload behavior.
- Invalid package filenames and path traversal are rejected.
- Untrusted strings are rendered as inert text.
- Original DOCX bytes remain unchanged.

## Candidate runtime

- File: `L2G-BM_v3.10.html`
- Size: 775,189 bytes
- SHA-256: `96ecb1caee5f7ba278c3b46c666d703423e2db40cac22f8431e70485e5d76a17`

## Promotion boundary

The new route remains a proposal and is not marked validated. The implementation PR must remain draft and unmerged until the frozen contract PR is independently approved and the Orchestrator retargets or rebases the implementation onto the then-current protected `main`.
