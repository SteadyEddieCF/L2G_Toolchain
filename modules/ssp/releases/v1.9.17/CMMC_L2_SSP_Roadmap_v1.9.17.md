# CMMC L2 SSP Roadmap after v1.9.17

1. Keep SSP v1.9.17 and Builder/Merger v3.10 draft and unmerged while the Orchestrator performs exact-head joint RG-4 testing.
2. Verify current acceptance, current-to-stale transition, higher-attempt acceptance/supersession, blocked/incomplete non-supersession, duplicate idempotency, and all mismatch/adversarial cases with exact paired artifacts.
3. Regress every existing L2G route and confirm no adjacent module consumes the full sidecar by implication.
4. Create a new exact-version suite snapshot without rewriting the historical Workshop-v79 snapshot.
5. Only after every joint gate passes, promote the contract route from `proposal` to `validated`, then merge producer and consumer in the authorized order and perform metadata-only reconciliation.
6. Reconsider UX-4, UX-5, and RG-5 only after the RG-4 authority and evidence route is stable; contract-neutral accessibility work may proceed independently when it does not overlap the handshake.
