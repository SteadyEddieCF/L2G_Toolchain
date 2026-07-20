# L2G Scoper v3.12

Bounded release from the merged v3.11 post-release audit.

## Release focus

- fixes the release-blocking `makeReturn()` idempotency defect;
- adds optional additive `scoping_decision_ledger_v1`;
- adds optional additive `pre_workshop_question_package_v1`;
- quarantines malformed question candidates with source-traceable diagnostics;
- promotes connected Decision Ledger, Unknowns, and Pre-Workshop review surfaces;
- consolidates Advisor Report, Client Executive Summary, and PowerPoint output;
- preserves the unchanged package identities, browser storage key, local/offline architecture, and zero-practice guardrail.

## Runtime

`L2Scoper-v3.12.html` is deterministically materialized from the authoritative v3.11 baseline plus the bounded v3.12 patch source. Expected SHA-256:

`2adf329557fb2df4699e13bb572bcde762667292700200f8edeae0dd6ade7ef3`

The branch materialization workflow verifies this checksum before committing the generated runtime.

## Contracts

- Input: `l2g_scope_context_v1`, version `1.0`
- Output: `l2g_scope_return_package_v1`, version `1.0`
- Storage key: `l2scoper_v30_state`
- Practice records: zero

See the release report, regression, compatibility manifest, and roadmap in this directory. Generated binary deliverables remain release/Actions artifacts rather than repeated repository history.
