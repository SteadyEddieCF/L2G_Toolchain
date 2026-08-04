# L2G Integrated Suite v0.3.0 — Engagement Spine Threat Model

## Scope

This update covers the new Engagement domain, candidate review, presentation filtering, read-only projections, migration, and next-work calculation. ADR-0007 continues to govern encrypted project and recovery confidentiality.

## Protected assets

- accepted engagement identity and planning context;
- participants, organizations, assumptions, decisions, questions, constraints, milestones, and blockers;
- candidate metadata, rationale, provenance, and confidence;
- advisor-only content excluded from Client View;
- stable identifiers and relationships;
- history, checkpoints, encrypted recovery, and portable project integrity.

## Trust boundaries

1. user-selected encrypted or legacy project bytes to strict parser;
2. decrypted inner ZIP to schema and semantic validator;
3. imported legacy metadata to candidate records;
4. Engagement authority to read-only workspace projections;
5. full project state to presentation-profile filtering;
6. browser memory to encrypted recovery and portable save;
7. public repository and CI to synthetic fixtures only.

## Principal threats and controls

### Silent authority transfer

Threat: imported or downstream metadata silently overwrites accepted Engagement state.

Controls: candidates are stored separately; target mutation occurs only through Engagement-owned Accept or Modify commands; before/after review and append-only decision history are preserved; decided candidates cannot be reused.

### Client-profile information leakage

Threat: advisor-only records leak through counts, titles, snippets, search, next-work, inspector, or DOM-hidden content.

Controls: filter before rendering and before calculations; construct a new profile-safe projection; do not render hidden records into the DOM; test profile-specific counts and empty states; Client View cannot open candidate or provenance inspectors.

### Projection mutation

Threat: downstream workspace code modifies Engagement authority through a shared object reference.

Controls: deep clone and recursively freeze projection objects; provide no direct store reference to downstream renderers; test mutation attempts; downstream changes require review proposals.

### Identifier collision or relationship confusion

Threat: duplicate IDs, dangling references, or unsafe merge behavior corrupt relationships.

Controls: type-prefixed opaque IDs; duplicate-ID rejection; local-reference validation; explicit merge survivor and provenance; validated supersession links.

### Malformed or oversized engagement records

Threat: deeply nested, oversized, unsupported, or prototype-polluting records cause denial of service or unsafe state.

Controls: strict JSON parser; unknown-key rejection; bounded collections, strings, and relationship counts; archive limits; validation before state mutation; generic user-facing errors for untrusted input.

### Misleading next-work output

Threat: deterministic summaries are mistaken for compliance or readiness conclusions.

Controls: inputs are limited to factual record states and dates; rules are explicit and ordered; no practice/evidence scoring inputs are used; qualification text is visible; tests reject readiness, compliance, certification, evidence-sufficiency, and Met/Not Met wording.

### Migration ambiguity

Threat: v0.2 identity fields are lost, duplicated, or treated as high-authority conclusions.

Controls: deterministic mapping; preserve valid project and engagement IDs; create migration checkpoint and event; initialize new collections empty; infer no scope, practice, evidence, or responsibility records; next save uses v0.3 application identity.

### Browser and endpoint compromise

Threat: unlocked content is exposed by a compromised browser, extension, endpoint, memory snapshot, or local user.

Controls and limitations: ADR-0007 encrypted-at-rest controls remain; lock reload clears active document and key references on a best-effort basis; no runtime network access; restrictive CSP; product language states browser limitations.

## Misuse cases

- importing real client, FCI, or CUI content despite the synthetic-only boundary;
- treating presentation profiles as security roles;
- sharing a full project file as a client-safe export;
- accepting every candidate without source review;
- using target level or blocker severity as an assessment conclusion;
- embedding sensitive contact information in public fixtures or CI evidence;
- assuming encrypted recovery is a password-reset mechanism.

## Required verification

- strict schema and semantic tests;
- profile leakage tests including counts and inspector state;
- projection immutability tests;
- candidate non-mutation and explicit-decision tests;
- migration identity and history tests;
- malformed and oversized input rejection;
- encrypted save/open/recovery/lock regression;
- Linux and Windows `file://`, axe-core, zero-network, CSP, deterministic build, and public-hygiene gates;
- complete existing standalone and integrated-suite non-regression.

## Residual risk

v0.3 does not protect an unlocked project from endpoint compromise, does not provide authenticated identities or access control, and does not authorize production/client/FCI/CUI use. Presentation filtering is a usability and distribution aid, not an authorization boundary inside the complete project file.
