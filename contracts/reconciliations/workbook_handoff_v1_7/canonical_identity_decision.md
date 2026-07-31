# Canonical Identity Decision — Workbook Handoff 1.7

## Decision status

**Frozen governance decision for issue #104.**

Selected model: **Package version 1.0 with contract/schema enhancement release 1.7.**

Rejected model: changing the top-level wire `package_version` to `1.7`.

## Canonical current identity

A trusted current Workbook Handoff 1.7 package must reconcile all of the following:

| Location | Required value |
|---|---|
| `package_kind` | `l2g_workbook_handoff_v1` |
| `package_version` | `1.0` |
| `handoff_schema_enhancements_version` | `1.7` |
| `schema_trusted` | `true` |
| `contract_manifest.contract_name` | `l2g_workbook_handoff_v1` |
| `contract_manifest.contract_release` | `1.7` |
| `contract_manifest.required_package_identity.package_kind` | `l2g_workbook_handoff_v1` |
| `contract_manifest.required_package_identity.package_version` | `1.0` |
| `package_integrity.contract_release` | `1.7` |

The established human-facing label remains **Workbook Handoff 1.7**. Documentation must describe it as:

> Workbook Handoff contract release 1.7, encoded as `l2g_workbook_handoff_v1` wire package version 1.0 with `handoff_schema_enhancements_version` 1.7.

## Evidence supporting the decision

1. The stable-frozen registry identifies the route's contract release as 1.7.
2. Workshop and Builder/Merger current pointers and release reports consistently call the route Workbook Handoff 1.7.
3. Exact Workshop v79 output uses top-level `package_version: "1.0"` and `handoff_schema_enhancements_version: "1.7"`.
4. The same exact package embeds `contract_release: "1.7"` while explicitly requiring `package_version: "1.0"`.
5. Workshop v77/v78 release overlays describe the route as Handoff 1.7 while wrapping the inherited package factory rather than changing its wire package version.
6. Builder/Merger v3.10 records the top-level package version but makes compatibility decisions using the enhancement version, showing that the two fields have distinct purposes.
7. The exact current handoff's deterministic fingerprint was generated with wire version 1.0. Changing the field would change the package identity even when no business content changed.

## Why the alternative is rejected

Changing `package_version` to `1.7` is rejected because it would:

- conflict with the exact current producer and its embedded required identity;
- change existing package fingerprints;
- require legacy handling for every currently generated v79 package;
- misrepresent an additive schema-release history as seven incompatible wire formats;
- create a breaking change without evidence that any released producer ever emitted top-level version 1.7;
- require unnecessary migration of stable historical packages and reports.

## Registry semantics

The existing registry `version: "1.7"` is retained as the **contract release** for compatibility. A later coordinated metadata reconciliation must add explicit fields rather than silently redefining the existing field:

```json
{
  "package_kind": "l2g_workbook_handoff_v1",
  "version": "1.7",
  "version_semantics": "contract_release",
  "wire_package_version": "1.0",
  "schema_enhancements_version": "1.7",
  "producer": "workshop",
  "consumers": ["builder-merger"],
  "stability": "stable-frozen"
}
```

Current pointers and release documents should similarly distinguish `contract_release` from `wire_package_version`.

## Strict consumer behavior

### Trusted current

Accept as trusted current only when every canonical identity field reconciles exactly and the full 1.7 schema and semantic rules pass.

### Explicit legacy compatibility

A package with wire version 1.0 and a recognized earlier enhancement release may be accepted only through an explicit legacy compatibility path that:

- identifies the exact supported enhancement release;
- displays that it is not the current 1.7 contract release;
- applies that release's own allowlist and semantic rules;
- does not silently upgrade or relabel the package;
- preserves the original package bytes and fingerprint;
- does not treat missing enhancement metadata as current 1.7.

Legacy support must be enumerated. It must not mean “accept any value less than or equal to 1.7.”

### Required rejection

Reject before any mutating operation when any of these conditions occurs:

- duplicate JSON object key at any nesting level;
- missing or incorrect `package_kind`;
- missing or unsupported wire `package_version`;
- top-level `package_version: "1.7"` or another conflicting encoding;
- missing current enhancement release when the package claims current 1.7 status;
- unknown or unsupported enhancement release;
- disagreement among top-level identity, contract manifest, and package-integrity identity;
- `schema_trusted` is not exactly `true` for a trusted path;
- unknown top-level fields under a frozen release unless explicitly declared by that release's extension mechanism;
- duplicate, conflicting, or mismatched governed practice/objective identities;
- failed package fingerprint or source-lineage reconciliation.

A consumer may show a non-mutating unsupported-package explanation, but it must not mark the package trusted or executable.

## Producer behavior

Workshop v79's wire identity is already correct under this decision. Workshop v79.1 must not change the top-level package version to 1.7. It should:

- retain the canonical 1.0/1.7 two-level identity;
- self-check all embedded identity fields before download;
- make the two-level version model explicit in UI/help and generated metadata;
- fail export if its own identity fields conflict;
- preserve deterministic package fingerprint behavior.

## Fingerprint consequences

The identity decision preserves current package bytes and fingerprint rules. Registry/documentation clarification does not change a handoff fingerprint. Any future contract release that changes the enhancement field or allowed content creates a new package fingerprint naturally.

## Corrective release order

1. **Issue #104 governance package** — merge the decision and identity fixtures only.
2. **Issue #107 harness reconciliation** — may proceed independently; tests/fixtures first, no SSP runtime change without a supported-workflow product defect.
3. **Builder/Merger v3.10.1 (#106)** — implement strict Handoff identity validation from this decision and preserve Workshop action/ownership records losslessly.
4. **Workshop v79.1 (#105)** — harden Workbook Merge 1.1 parsing/semantics and add Handoff export self-reconciliation without changing its wire identity.
5. **Coordinated metadata reconciliation** — clarify registry/current-pointer/report terminology after both corrective runtimes pass independent review.
6. **Issue #101 full rerun** — rerun the six-tool matrix, create a new immutable suite snapshot only if all gates pass, and decide RG-4 sidecar registry promotion.

Builder/Merger and Workshop corrective candidates may be developed in parallel after this decision, but the final exact round trip must test both together.

## Historical artifact treatment

Do not rewrite:

- `suite-2026.07.26-workshop-v79-mcfirecoal-v1.2.0`;
- Workshop v79 release evidence;
- exact v79 handoff bytes;
- prior Builder/Merger reports;
- PR #103 evidence artifacts.

New reconciliation reports may annotate that “Handoff 1.7” means wire package 1.0 plus schema enhancement 1.7. Historical bytes and original hashes remain authoritative for what those releases actually produced.

## Canonical blocker IDs

- `WKS-RG4-001` — Workbook Handoff contract identity mismatch;
- `WKS-RG4-002` — unknown Workbook Merge version accepted;
- `WKS-RG4-003` — unknown top-level Workbook Merge property accepted;
- `WKS-RG4-004` — duplicate JSON keys accepted;
- `WKS-RG4-005` — duplicated or mismatched practice identity accepted;
- `RG4-ROUNDTRIP-006` — action and ownership preservation failure.

All future issue #101 evidence must use this mapping consistently.
