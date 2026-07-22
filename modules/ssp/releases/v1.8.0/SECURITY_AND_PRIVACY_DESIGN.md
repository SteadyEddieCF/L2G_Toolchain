# Security and Privacy Design — v1.8.0

- Local-only execution; no external scripts, stylesheets, telemetry, analytics, or network calls.
- Portfolio data is stored with the SSP workspace and copy-type storage suffix.
- Conversion requires a complete local rollback snapshot and stops on storage failure.
- Imported portfolio text is stripped of HTML/control characters and length-limited.
- Stable IDs use a restrictive grammar; module counts and list sizes are bounded.
- Hierarchy validation rejects duplicate IDs, missing parents, invalid roots, and cycles.
- Existing image MIME/signature/size/SVG sanitization, Word Review security, and CSV protections remain in place.
- Evidence binaries are not added to the portfolio model.
- Exports carry a sensitive-information warning.

Multi-user access, authentication, authorization, cloud storage, and synchronization remain out of scope and require separate architecture and threat-model approval.
