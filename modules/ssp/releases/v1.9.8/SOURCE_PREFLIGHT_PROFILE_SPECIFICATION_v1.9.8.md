# Generic source-preflight profile specification — v1.9.8

## Identity

- Profile ID: `generic-cmmc-ssp-review-v1`
- Profile version: `0.1`
- Run kind: `source-preflight`
- Registry: built-in, versioned, de-identified, not user-editable

## Checks

The profile contains twelve stable generic IDs covering document/client/system metadata, configured profile/date, unresolved source content, source structure, identity consistency, document-control metadata consistency, 110-requirement inventory, implementation-status/statement presence, status-aware coherence, and inherited/shared-source consistency.

## Progression semantics

Source-preflight readiness requires all applicable required items to have acceptable terminal results, automated blockers resolved, permitted N/A results to contain rationale, and the run fingerprint to match the current governed source. Advisory or non-applicable items are not unconditional automated blocks.

## Authority boundary

The profile does not determine statement accuracy, assessment-objective coverage, evidence sufficiency, readiness, risk, compliance, certification, authenticated identity, final Word QA, or client-release approval.
