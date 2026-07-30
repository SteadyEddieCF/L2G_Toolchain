# RG-4 deterministic derivations and semantic rules

These rules freeze implementation behavior for issue #91 while the registry entry remains `proposal`.

## Canonical JSON

`canonical-json-v1` is UTF-8 JSON with object keys sorted lexicographically, arrays preserved in declared order, separators `,` and `:`, no insignificant whitespace, `ensure_ascii=false`, and no trailing newline. Duplicate keys are rejected before canonicalization.

## QA-profile identity

The canonical profile is `l2g-builder-merger-final-word-qa-v1.profile.json`. Its `sha256` value is calculated over canonical JSON of the profile **with the top-level `sha256` property removed**.

Frozen profile SHA-256: `9aec3fd144e9f8ccfefdd3dd1ba5605ec0364127459f8cbded71904cf02b789c`.

The sidecar `checks` array must contain exactly the five profile check IDs in the profile order, with matching classification and severity. No additional or omitted checks are permitted in contract 1.0.

## Lineage key

`lineage.lineage_key` is lowercase SHA-256 hex of canonical JSON of:

```json
{"package_kind":<package_kind>,"package_version":<package_version>,"scope":<scope>,"document_version":<source.document_version>,"qa_profile":{"id":<qa_profile.id>,"version":<qa_profile.version>}}
```

The key intentionally excludes source fingerprint, export manifest, review-package ID, artifact hash, SSP release, timestamps, results, and attempt number so a corrected or regenerated DOCX for the same local SSP scope and document version remains in one lineage.

## Sidecar ID

`sidecar_id` is `sha256:` followed by lowercase SHA-256 hex of canonical JSON of the complete sidecar after removing both `sidecar_id` and `package_fingerprint`.

## Package fingerprint

`package_fingerprint` is lowercase SHA-256 hex of canonical JSON of the complete sidecar after removing only `package_fingerprint`. It therefore binds the declared `sidecar_id`.

## Timestamps and deterministic output

- `created_at` and every `asserted_at` use UTC RFC 3339 seconds form: `YYYY-MM-DDTHH:MM:SSZ`.
- Fractional seconds and offsets other than `Z` are rejected by contract semantics even though the base JSON Schema accepts general `date-time` values.
- Each assertion timestamp must be less than or equal to `created_at`.
- A production run uses its real local clock. Re-running with a different clock input produces a new sidecar ID and package fingerprint.
- A deterministic test repeats with the same artifact bytes, declared clock, operator inputs, producer version/instance, and ordered results; the sidecar bytes, ID, lineage key, and package fingerprint must then be identical.

## Scope semantics

- `single-system`: `portfolio_id` is null and `module_id` is exactly `single-system`.
- `portfolio-module`: both IDs are non-empty and `module_id` is not `single-system`.

## Source and artifact pairing

For contract 1.0, `source.source_snapshot_sha256` equals `source.source_ssp_fingerprint`; both identify the canonical governed SSP source snapshot. Builder/Merger must hash the exact DOCX bytes and exact embedded Word-export manifest bytes. The manifest must reconcile `runtimeRelease`, `documentVersion`, `reviewPackageId`, `sourceFingerprint`, `reviewScope`, and schema identity with the sidecar. The original DOCX is never silently modified.

## Aggregate and human assertions

- Check IDs are unique and exactly match the frozen ordered profile.
- Aggregate counters exactly equal check results.
- `qa_blocked` is required when any blocking check fails.
- `qa_incomplete` is required when no blocking check fails but a required check needs human review or a required human assertion is absent.
- `qa_complete` is permitted only when every required check passes and every required human check has exactly one valid local assertion.
- Contract 1.0 does not permit `not-applicable` for any frozen profile check.
- Automated checks have no operator assertion. A completed human check has exactly one assertion for its check ID.
- Local names and IDs are unauthenticated labels, not identity proof or digital signatures.

## Retry and supersession

- Attempt 1 has `supersedes_sidecar_id=null`.
- Attempt N greater than 1 references the immediately preceding sidecar ID from the same lineage and uses attempt number N-1 plus one.
- An identical package fingerprint is an idempotent duplicate.
- SSP may mark an earlier accepted-current record superseded only after explicit acceptance of a higher-attempt, `qa_complete`, current-source package in the same lineage.
- Blocked, incomplete, stale, rejected, or preview-only attempts never erase or supersede accepted history.

## Consumer enforcement

SSP recomputes the profile hash, lineage key, sidecar ID, package fingerprint, exact DOCX and manifest hashes, source currency, aggregate semantics, assertion linkage, and retry chain. Strings remain inert text. Preview and rejection do not mutate governed SSP data.
