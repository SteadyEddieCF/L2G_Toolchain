# Issue #67 bounded scope — SSP v1.9.11

## Authorized change

Implement only RG-3 preliminary SSP Word-review-copy inspection over the exact promoted v1.9.10 runtime. The SSP may inspect the exact generated or selected SSP Word Review DOCX, bind results to its SHA-256 and current SSP source fingerprint, and retain append-only/superseding SSP-owned inspection evidence.

## Supported preliminary checks

- safe DOCX ZIP/package readability and required main document part;
- exact artifact SHA-256 and byte size;
- supported embedded SSP Word Review manifest;
- expected manifest-declared section headings;
- recognized unresolved placeholders and canonical tokens;
- manifest entry/tag/snapshot reconciliation;
- current SSP source-fingerprint comparison;
- reliable package-XML comment count;
- reliable main-document tracked-revision element count.

## Non-goals and authority boundary

This release does not perform final Word QA; final TOC refresh/correctness; pagination; header/footer rendering; assembled formatting; visual glance-through; Builder/Merger validation; client-release approval; technical accuracy; evidence sufficiency; readiness; risk; compliance; assessment; certification; or scoring. It creates no Builder/Merger sidecar and changes no cross-tool package route or stable contract.

## Handshake decision

No handshake release is required for v1.9.11. The schema change is additive and SSP-owned. RG-4 Builder/Merger final Word-QA sidecar is the next known mandatory SSP/Builder-Merger handshake point.
