# L2G Integrated Suite — Rolling Ten-Release Roadmap

## Purpose

This roadmap defines the next ten bounded Integrated Suite releases from the promoted v0.1.0 foundation through the first integrated beta. It is a planning and release-governance record, not authorization to bypass issue-level scope, security review, acceptance matrices, exact-head CI, or human review at authority boundaries.

## Current baseline

- repository: `SteadyEddieCF/L2G_Toolchain`
- current Integrated Suite release: `0.1.0`
- merge commit: `711b84ebbf675a8e005dbfba80a8dfbd42213bc9`
- portable HTML SHA-256: `67a69e026d789901dcfe0bf8aecb574d1ae5a9647b225db18099f5cb43e89e15`
- project kind: `l2g_project_v1`
- runtime model: local, offline, no install, no telemetry, no runtime network
- current data authorization: synthetic-only; not authorized for production, client, FCI, or CUI content
- current standalone module releases remain authoritative and independently distributable

## Release sequence

| Release | Working title | Primary outcome | Authority and safety boundary | Status |
|---|---|---|---|---|
| **v0.1.0** | Foundation | Single-file TypeScript shell, eight workspaces, project lifecycle, recovery, history, profiles, compatibility catalog, CSP, deterministic build, and adversarial archive validation | Synthetic-only; no substantive module migration or production-data authorization | **Current — merged by PR #122** |
| **v0.2.0** | Encrypted Project Safety Foundation | Versioned encrypted project envelope, passphrase lifecycle, authenticated encryption, encrypted/disabled recovery, cryptographic adversarial tests, and updated threat model | Encryption is necessary but not sufficient for production/CUI authorization; no module migration | **Planned — issue #123** |
| **v0.3.0** | Engagement Spine | Governed engagement identity, participants, objectives, phase, assumptions, decisions, and engagement-level metadata available across workspaces | Engagement domain owns canonical records; presentation profiles remain non-security modes | Planned |
| **v0.4.0** | Evidence Catalog Core | Reference-only evidence records, SHA-256 fingerprints, source provenance, relink workflow, duplicate detection, search index, and candidate mapping container | Evidence workspace owns ingestion metadata and provenance; no automatic scope or practice conclusions | Planned |
| **v0.5.0** | Pre-Engagement and Interview Sessions | Intake requests, meeting/session records, Interview Mode, attendees, questions, notes, follow-ups, and reviewable candidate outputs | Interview outputs remain candidates until explicitly accepted by owning domains | Planned |
| **v0.6.0** | Scope Vertical Slice | Proposed boundary, systems, assets, providers, data flows, assumptions, and decisions with legacy Scoper import/export compatibility | Scope owns authoritative scope records; evidence and interviews may propose but not directly mutate scope | Planned |
| **v0.7.0** | Practice Review Vertical Slice | Facilitated practice review, evidence requests, gaps, actions, blockers, provider follow-up, and Workshop compatibility | Practice Review owns facilitated conclusions; no automated Met/Not Met, readiness, or certification claim | Planned |
| **v0.8.0** | SSP Vertical Slice | Governed SSP narratives, inheritance, baselines, conflicts, Needs Attention, and SSP handoff/return compatibility | SSP owns governed SSP content; scope/practice/evidence records are linked inputs, not silent overwrites | Planned |
| **v0.9.0** | Deliverables Vertical Slice | Deterministic workbook/document/presentation assembly, reconciliation, packaging, profiles, and output QA using Builder/Merger compatibility | Deliverables render accepted governed records; output generation does not create new assessment conclusions | Planned |
| **v1.0.0-beta.1** | Integrated Engagement Beta | One normal portable HTML, one encrypted engagement project, end-to-end synthetic and approved pilot workflow, curated client export, and full regression package | Standalone tools remain available until explicit retirement criteria are met; pilot authorization requires separate governance approval | Planned |

## Release-wide acceptance pattern

Every release must have:

1. a separately bounded issue with included and excluded scope;
2. architecture/security/authority decisions recorded before implementation when the release changes a trust boundary;
3. an implementation branch from current `main` while preserving the exact prior promoted baseline;
4. deterministic source-controlled build inputs and locked build dependencies;
5. exact-head Linux and native Windows `file://` validation;
6. zero unexpected runtime network requests;
7. zero serious or critical axe-core findings on tested primary surfaces;
8. malformed, oversized, tampered, and unsupported-input rejection before governed-state mutation;
9. complete current six-tool and registered-route non-regression;
10. durable release notes, SHA-256 identity, SBOM, validation report, current pointer, and downloadable ZIP plus standalone HTML;
11. no client data, FCI, CUI, secrets, private paths, or proprietary unlicensed content in repository history or CI evidence;
12. explicit statement of what the release does not conclude or authorize.

## Migration rules

- Migrate one bounded vertical slice at a time; do not perform a wholesale rewrite.
- Preserve existing standalone releases, package contracts, snapshots, and validated behavior until explicit retirement approval.
- A source domain may publish candidates or read-only projections to another domain, but the target authority must explicitly accept or modify them.
- Cross-domain acceptance must retain source links, rationale, timestamps, history, and supersession state.
- Legacy JSON contracts remain supported through reviewed adapters until a separate compatibility-retirement decision.
- Original evidence remains reference-only by default. Embedding evidence requires a separately approved security and size model.
- Presentation profiles do not create access control or a safe client distribution artifact. Client distribution requires curated export.
- No release may infer readiness, compliance, certification, evidence sufficiency, scoring, or Met/Not Met without an explicitly approved domain rule and human decision.

## Rolling-roadmap maintenance

After each promoted release:

- mark the completed release and exact merge identity;
- add the next bounded release so the roadmap continues to show ten releases;
- reconcile the root README, current pointer, release notes, validation report, QA commands/catalog, and related issues;
- preserve prior roadmap versions when a major strategy change requires an auditable planning fork;
- avoid treating roadmap placement as implementation approval.
