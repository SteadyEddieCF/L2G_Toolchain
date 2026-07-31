# Security and Offline Operation Report — SSP v1.9.17

- All processing remains inside the local browser; no network route, upload, remote identity service, or external notification was added.
- JSON size is capped at 2 MB; DOCX size is capped at 35 MB; expanded package content is capped at 80 MB; package part count is capped at 600.
- Duplicate JSON keys are rejected before object creation. Unknown versions and extra properties are rejected.
- DOCX bytes, filename, and byte length are exact-bound to the sidecar. Open XML paths are checked for traversal/absolute-drive forms. Required parts are enforced.
- Active/embedded content and external relationships are rejected. Embedded manifest XML and UTF-8 JSON are strictly parsed.
- Every imported string is escaped before HTML rendering. Script-like and markup-like fixture strings remain inert text.
- Preview and rejected imports do not mutate SSP data. Explicit local action is required before history append.
- Locally entered identifiers are labelled unauthenticated and unsigned. No digital-signature or identity-authentication claim is made.
- Contract and QA-profile identities are frozen constants and recomputed locally.
- The existing CSP/no-network posture is preserved; candidate local browser tests observed zero external requests, page errors, or unexpected console errors.
