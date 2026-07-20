# DocConverter-L2G v7.9.5.1 release candidate

Bounded DocConverter-only hotfix for validation-question candidate precision.

## Demonstrated defect

The current v7.9.5 baseline still exported raw JSON field/value fragments as `l2g_scope_context_v1.validation_questions`. The exact affected 21-candidate fixture and a controlled replay reproduced the defect.

## Proposed correction

- Reject raw serialized field/value fragments, JSON delimiters, package metadata, schema labels, and short headers.
- Reject ordinary text-mined candidates from re-ingested downstream L2G package JSON.
- Retain natural-language questions and clear validation instructions.
- Normalize serialization punctuation and merge case/punctuation duplicates while preserving source lineage.
- Keep inferred questions draft and advisor-review-required.
- Preserve all three package kinds at version 1.0 and all existing offline/extraction safeguards.

## Reviewable source

- `DocConverter-L2G_v7.9.5.1_Candidate_Precision_Patch.js` contains the bounded runtime patch.
- `build_v7951.py` deterministically applies it to the authoritative v7.9.5 baseline.
- The expected generated HTML is `DocConverter-L2G_v7.9.5.1.html`, 7,952,581 bytes, SHA-256 `df64d0912b43d69d5eda256188458c3d32f9aa679c49ed43f6ddf4cb64b9c17d`.

The full standalone HTML and deliverables ZIP are supplied outside this draft PR because the connected GitHub file API is not suitable for committing the approximately 8 MB generated single-file runtime in this session. Before the PR is marked ready or merged, the generated HTML must be placed at the intended runtime path or published according to the repository's approved generated-asset process, and the current-release pointer must then be updated.

## Validation

Focused regression result: **PASS**.

- affected candidates: 21 original; 11 accepted unique; 8 rejected; 2 duplicates merged;
- raw JSON field/value fragments exported: 0;
- source traceability retained: yes;
- package kinds/versions unchanged: yes;
- page errors, console warnings/errors, HTTP/HTTPS requests, identity mutations: 0;
- 25 inline JavaScript blocks passed syntax validation;
- duplicate static IDs: 0.

## Scope boundary

No Scoper, Workshop, Builder/Merger, SSP, or Control Center application code is changed by this release candidate.
