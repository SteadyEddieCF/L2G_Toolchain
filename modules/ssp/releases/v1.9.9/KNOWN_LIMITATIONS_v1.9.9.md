# Known limitations v1.9.9

- All reviewer names, local IDs, roles, attestations, and conflicts are unauthenticated browser-local assertions.
- No digital signature, directory, access enforcement, email, calendar, notification, remote/background workflow, or enterprise approval is provided.
- Human judgments are not automated validations. The tool does not determine technical accuracy, evidence sufficiency, control effectiveness, assessment status, readiness, risk, compliance, certification, or client-release approval.
- Referenced-artifact staleness uses an exact user-supplied SHA-256; the tool does not fetch or hash remote artifacts.
- No preliminary/final Word QA, unified Needs Attention queue, final assembly, delivery packaging, or adjacent-tool mutation is included.
- Direct Windows Chromium `file://` navigation could not be executed in the managed test browser because administrator policy blocks local-file navigation. Equivalent single-file Chromium execution, offline/static inspection, clean restore, and zero-request/error regression passed; independent Windows `file://` acceptance remains required.
