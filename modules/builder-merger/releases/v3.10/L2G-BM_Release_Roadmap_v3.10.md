# L2G Builder/Merger Rolling Release Roadmap — v3.10

**Updated:** 2026-07-30  
**Current candidate:** v3.10  
**Rule:** Update this rolling ten-release roadmap with every Builder/Merger release.

## Version position

- **v3.8:** Exception Resolution Ledger and governance packaging — current protected baseline before this candidate.
- **v3.9:** Reserved for Advisor and Client Delivery Profiles; not consumed by the RG-4 implementation.
- **v3.10:** RG-4 SSP Final Word-QA Sidecar Producer — current candidate.

## Next ten releases

| Release | Planned focus | Bounded outcome |
|---|---|---|
| **v3.11** | Word-QA Review Package | Package the source identity summary, sidecar, local report, and retry-chain view without altering the source DOCX or SSP authority. |
| **v3.12** | Advisor and Client Delivery Profiles | Add explicit advisor/client workbook delivery profiles and support-sheet visibility governance while preserving workbook contracts. |
| **v3.13** | Selective Workbook Merge Return | Let operators preview and select eligible reviewer-authored changes before generating the Workbook Merge return. |
| **v3.14** | Template Profile Manager | Recognize governed workbook template profiles, display compatibility, and isolate template-specific mappings without rewriting official workbook structure. |
| **v3.15** | Workbook Integrity Repair Center | Add explicit, non-destructive repair copies for known XLSX package defects with before/after hashes and a new output artifact. |
| **v3.16** | CMMC Effort Report Handoff | Produce a bounded report-support package from reviewed workbook and Advisor Review data without creating final assessment conclusions. |
| **v3.17** | Embedded Compatibility Matrix | Provide operator-visible package/tool/version compatibility rules with fail-closed exceptions for unsupported combinations. |
| **v3.18** | Workbook Action and Ownership Register | Add a cross-workbook action register with owner, due date, dependency, disposition, and return-package traceability. |
| **v3.19** | Expanded Offline Deliverable Portfolio | Add governed local exports beyond XLSX/JSON, such as concise review summaries and technical traceability reports. |
| **v3.20** | Production Hardening and Accessibility | Complete accessibility remediation, native-file regression coverage, performance limits, recovery behavior, and release-governance hardening. |

## Persistent roadmap constraints

- Only Builder/Merger is modified in this development stream.
- Existing stable package meanings are not changed without an explicit handshake release.
- Workshop-derived data never creates automatic Met/Not Met, evidence-sufficiency, readiness, scoring, certification, or final CMMC conclusions.
- New outputs remain local/offline and preserve authoritative source lineage.
- Every release continues to ship a standalone HTML file and a complete deliverables ZIP.
