# L2G Integrated Suite v0.3.0 — Validation Report

## Candidate identity

- Release: **L2G Integrated Suite v0.3.0 — Engagement Spine**
- Governing issue: **#126**
- Promotion pull request: **#129**
- Accepted design baseline: `c65fee2dd893e23a0adaf339c8efbc7a7f929dde`
- Validated candidate head: `c7c26fc01148614fc709c6822e24fb60b7858dd7`
- Product/runtime compatibility baseline: `85d6e783a250b373cd4b9ea356e4c341336f9259`
- Engagement schema: `l2g_engagement_v1` version `1.0`
- Encrypted envelope: `l2g_encrypted_project_v1` version `1.0`

## Deterministic release artifact

- Artifact: `L2G_Integrated_Suite_Engagement_Spine_v0.3.0.html`
- SHA-256: `d4fe85feddf08b0e069546c04b40f3bb6e063da8fdba485b047beb879e847c2a`
- Size: `136306` bytes
- Fixed encrypted-project vector SHA-256: `0091fb76fa5ee058b4072aa8e9d236942604851e65efdb68b1ea03758b3a5535`
- Fixed encrypted-project vector size: `18182` bytes
- Legacy v0.2 encrypted migration fixture SHA-256: `46f620e1de5bd8ec543f26c9c80007db2b3fc8251077608d449c83eed7f480e8`

The application artifact rebuilt deterministically to the same SHA-256 on the validated candidate head. Runtime project encryption remained intentionally nondeterministic through fresh salt and IV generation.

## Exact candidate-head validation runs

| Gate | Run | Result |
|---|---:|---|
| Integrated Suite Engagement Spine v0.3 | `30926876220` | Passed on Linux and Windows |
| Playwright QA | `30926877185` | Passed runtime, axe-core, governed routes, Windows file origin, and visual regression |
| RG-4 Merged-Main Six-Tool Validation | `30926876034` | Passed static identities, joint runtime, and Windows file origin |
| Validate L2G Toolchain | `30926876422` | Passed |

All inherited SSP materializers triggered for the candidate head also passed.

## Dedicated evidence artifacts

### Linux

- Artifact ID: `8899489095`
- Workflow artifact digest: `sha256:4ed1b91281dfc6bdf9978c05229c7b1ef992f501e412d562a2b5b769aff9d3ba`

### Windows native file origin

- Artifact ID: `8899489478`
- Workflow artifact digest: `sha256:41f973e8d028e78015e3f13ad1e24ce062e46041e0f09c7f91092604b76f354a`

## Validated behaviors

- strict TypeScript compilation;
- deterministic portable-HTML packaging, release manifest, SHA set, and SPDX SBOM;
- restrictive CSP including `default-src 'none'` and `connect-src 'none'`;
- zero runtime network requests and no remote assets or telemetry SDKs;
- eight-workspace shell under HTTP test serving and native Windows `file://` origin;
- canonical Engagement authority for identity, participants, organizations, assumptions, decisions, open questions, constraints, milestones, blockers, and candidates;
- candidate Accept, Modify, Reject, and Supersede commands with rationale and provenance retention;
- accepted state unchanged before an explicit candidate decision;
- duplicate identifiers, dangling references, unsupported states, unknown fields, and malformed packages rejected;
- deterministic factual next-work ordering without readiness, compliance, scoring, certification, evidence-sufficiency, risk, or Met/Not Met conclusions;
- deep-cloned and deeply frozen workspace projections;
- Client View filtering before render, including no advisor-only records, candidates, candidate counts, provenance, or inspector leakage;
- Advisor candidate acceptance with Undo and Redo;
- encrypted portable save/open, encrypted browser recovery, project locking, checkpoints, and append-oriented history;
- wrong passphrase, tampering, and envelope-purpose replay rejected without changing governed state;
- deterministic migration of valid v0.2 encrypted and v0.1 synthetic projects into `l2g_engagement_v1`, with migration checkpoint and history event;
- current standalone tools, governed routes, visual baselines, and RG-4 matrix unchanged.

## Promotion procedure

This report records the exact green **candidate head**. The current-release pointer is updated only after this evidence exists. Because that metadata update creates a new final head, the complete required matrix must pass again on that exact final head before PR #129 may leave draft or merge. Final-head run IDs and review evidence are recorded in PR #129 and issue #126 without altering the validated application artifact.

## Release boundary

This release remains **synthetic-only**. It does not authorize production, client, FCI, or CUI data. Encryption does not convert presentation profiles into security roles. The holder of a complete decrypted project can access the project contents. Evidence, Scope, Practice Review, SSP, Deliverables, Builder/Merger, DocConverter, and Control Center authority migration remain excluded. No readiness, compliance, certification, scoring, evidence sufficiency, risk, or Met/Not Met conclusion is established.
