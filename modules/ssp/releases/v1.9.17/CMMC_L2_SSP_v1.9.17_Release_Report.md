# Release Report — CMMC L2 SSP v1.9.17

## Purpose

v1.9.17 adds the SSP-owned consumer and local evidence-history half of RG-4. Builder/Merger remains responsible for artifact inspection and sidecar production; SSP independently validates the imported pair, recomputes source currency, and records only an explicitly acknowledged local evidence event.

## User workflow

1. Select one `l2g_ssp_word_qa_sidecar_v1` JSON file and its exact paired DOCX.
2. Preview structural validity, producer QA aggregate, and SSP-local currency as separate dimensions.
3. Review exact source, artifact, profile, lineage, and check identities.
4. Explicitly accept current `qa_complete` evidence, acknowledge stale evidence, or record blocked/incomplete evidence with its limitations.
5. Review append-only local history and derived current/stale/superseded status.

## Validation boundary

The consumer rejects duplicate JSON keys, unknown kind/version, extra properties, canonical fingerprint/ID mismatches, profile/order mismatch, aggregate mismatch, invalid assertion timestamps, invalid scope, lineage/retry errors, exact DOCX mismatch, malformed or unsafe Open XML packages, manifest mismatch, and source identity mismatch. Preview and rejection do not mutate SSP data.

## Identity

- Baseline v1.9.16 runtime: `f463f01d8b24ec3865467261659f8e90222b23bb9875282e665f04bec778a765`.
- Candidate v1.9.17 runtime: `bfd9d10a780809ba259406f0770641da6a40ac2d8a6d1e372b070d6f5273351b` (`2,266,611` bytes).
- Working-data schema: v1.9.11, unchanged.
- Built-in profile registry and registry schema: unchanged.
- Authoritative requirements: 110.
- Contract route status: `proposal`.

## Authority limitation

An accepted record is local, unauthenticated, and unsigned. It is evidence history only and does not establish technical accuracy, evidence sufficiency, CMMC readiness, compliance, assessment, certification, scoring, client approval, or client release.
