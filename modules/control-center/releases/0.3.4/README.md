# L2G Control Center v0.3.4

Bounded exact-suite audit and Stage 5 capability synchronization authorized by issue #35.

- Runtime output: `../v0.3.4/L2G_CC_v0.3.4.html`
- Runtime SHA-256: `9eec722499fd5f0a76249ccb6f27547d6fe6fc64059a418b136af48b8edf7a73`
- Exact suite: DocConverter v7.9.5.1, Scoper v3.12, Workshop v76, Builder/Merger v3.8, SSP v1.9.5.1
- Contract registry: 9 stable and 13 optional/read-only contracts
- Next committed feature release: v0.4 Read-only Action and Blocker Overview

`build_release.py` deterministically reconstructs the runtime from three binary-safe gzip parts and materializes the versioned governance evidence from a verified three-part archive. It fails closed on unexpected archive members or SHA-256 mismatch.

The complete deliverables ZIP, browser screenshots, and Windows `file://` artifacts remain release/distribution evidence rather than repeated Git history.
