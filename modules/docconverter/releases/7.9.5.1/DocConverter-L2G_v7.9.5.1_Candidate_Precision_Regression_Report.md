# DocConverter-L2G v7.9.5.1 — Candidate Precision Regression Report

Generated: 2026-07-20  
Result: **PASS**

## Baseline reproduction

The current authoritative v7.9.5 HTML still reproduced the reported issue. In a controlled replay, all **7 of 7** malformed JSON field/value fragments were exported as validation-question records. The reproduction evidence is preserved in `DocConverter-L2G_v7.9.5_Reproduction_Minimal.json`.

## Affected 21-candidate fixture

- Original candidates: **21**
- Accepted unique clean candidates: **11**
- Rejected/quarantined candidates: **8**
- Case/punctuation/source duplicates merged: **2**
- Raw JSON field/value fragments exported: **0**
- Accepted records retaining source filename, source document ID, and source basis: **Yes**

The seven identified raw fragments were rejected as serialized non-question fields. `Open items` was rejected as a header. Two semantically duplicate candidates were merged while retaining their source lineage.

## Controlled mixed replay

A mixed replay combined the seven malformed fragments with real natural-language validation instructions. Results:

- Original candidates: **12**
- Accepted: **4**
- Rejected: **8**
- Exported malformed fragments: **0**

Retained examples included:

- `Validate mailbox forwarding and external sharing controls.`
- `Confirm whether provider administrators can access security logs.`
- `RISK-002: ServiceNow attachment handling requires validation.`
- `Provider responsibilities are shared and must be validated.`

## McFirecoal representative regression

Six real files from the supplied McFirecoal 104-file package were replayed at the candidate-generation stage:

- Source files: **6**
- Accepted candidates: **5**
- Rejected candidates: **1**
- Natural questionnaire/evidence instructions retained: **4**
- Raw JSON fragments exported: **0**
- Source traceability retained: **Yes**

## Package and guardrail checks

- Intake: `l2g_intake_package_v1` version `1.0`
- Scope: `l2g_scope_context_v1` version `1.0`
- Meeting: `l2g_meeting_context_v1` version `1.0`
- Converter version: `v7.9.5.1`
- Workbook handoff, workbook merge, or scope-return output introduced: **No**
- Local path leakage in tested scope package: **No**
- Page errors: **0**
- Console warnings/errors: **0**
- HTTP/HTTPS requests: **0**
- Identity mutations: **0**

## Static validation

- Inline JavaScript blocks: **25**
- JavaScript syntax failures: **0**
- Duplicate static IDs: **0**
- External scripts or stylesheets: **0**
- CSP `connect-src 'none'`: **Present**

## Honest limitation

A full browser extraction of all 104 files in the supplied McFirecoal ZIP was attempted but timed out in the managed environment. It is **not** reported as a pass. The regression used the exact affected 21-candidate fixture, a controlled reproduction, and six real representative source files. A complete Windows Chrome/Edge run remains on the local test checklist.
