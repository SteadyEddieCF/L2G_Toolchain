# Known limitations — SSP v1.9.10

- The queue is recalculated in the foreground; there is no background monitoring or notification.
- Reviewer names, roles, attestations, and owner labels remain locally asserted and unauthenticated.
- External-tool references are read-only and depend on existing locally imported records; the SSP does not verify the external source's current state.
- Queue absence or a zero count is not a readiness, risk, compliance, assessment, certification, evidence-sufficiency, or client-release conclusion.
- Browser-local filter preferences are not part of backups and may be lost when browser storage is cleared.
- RG-3 preliminary Word-review-copy inspection and RG-4 final Word-QA sidecar remain separately bounded future work.
