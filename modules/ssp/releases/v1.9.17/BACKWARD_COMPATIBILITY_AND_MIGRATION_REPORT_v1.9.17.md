# Backward Compatibility and Migration Report — SSP v1.9.17

The SSP working-data schema remains `cmmc-l2-ssp-modern-v1.9.11`. Existing v1.9.11 working data opens without migration and receives an empty optional `wordQaSidecarEvidence` history when no RG-4 records exist.

The new history is append-only browser-local evidence metadata. It is included in backup/export, restore, local persistence, and repeated JSON export. It is explicitly excluded from governed-source fingerprint computation, as are existing RG-2 and RG-3 review histories. Importing, previewing, rejecting, accepting, acknowledging, deduplicating, or deriving supersession does not alter authored narrative, implementation status, evidence references, requirement text, review stages, review dispositions, review profile selection, sign-off, Workshop-owned records, or existing package routes.

RG-1, RG-2, UX-3, RG-3, Word Review, Needs Attention, Workshop SSP Handoff 1.0, SSP Return 1.0, portfolio behavior, and exactly 110 requirements are retained. Historical RG-3 preliminary inspection records are not converted to RG-4 evidence.

The route remains optional and proposal-only. Older SSP versions may preserve the optional history as unrecognized extension data under the existing v1.9.11 compatibility behavior, but they do not provide the RG-4 consumer UI or validation semantics.
