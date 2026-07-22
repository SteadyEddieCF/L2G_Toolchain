# Import and Export Specification — v1.8.6

The v1.8.5 portfolio/module JSON exchange and module Word Review contracts remain supported. Exchange package version 1.5 remains valid for backward compatibility; new review-register exports use `cmmc_l2_ssp_review_approval_register_v1`, package version `1.6`.

Existing safe-only reconciliation, deterministic fingerprints, protected identities, cross-portfolio safeguards, and queue-only Word Review behavior remain unchanged. Formal review records are not imported through ordinary portfolio/module exchange because assignments, submissions, dispositions, and approvals are governance records that require explicit local workflow actions.
