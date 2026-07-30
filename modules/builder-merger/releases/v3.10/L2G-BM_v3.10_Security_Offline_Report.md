# L2G Builder/Merger v3.10 Security and Offline-Operation Report

## Runtime identity

- File: `L2G-BM_v3.10.html`
- Size: 775,189 bytes
- SHA-256: `96ecb1caee5f7ba278c3b46c666d703423e2db40cac22f8431e70485e5d76a17`

## Offline controls

| Check | Result |
|---|---|
| Single standalone HTML | Pass |
| CSP `connect-src 'none'` | Pass |
| Remote script tags | 0 |
| `fetch(` calls | 0 |
| `XMLHttpRequest` calls | 0 |
| `sendBeacon` calls | 0 |
| Telemetry or API-key behavior added | No |
| Cloud upload behavior added | No |
| Local File/Blob APIs only | Pass |

## DOCX package safety

The route checks:

- ZIP/Open XML readability and CRC;
- required package parts;
- malformed XML;
- invalid entry names and path traversal;
- missing/corrupted relationships;
- external relationships;
- macros and active content;
- embedded manifest support and reconciliation;
- unresolved comments;
- tracked insertions, deletions, and move revisions;
- pending field-update artifacts;
- governed unresolved placeholders and replacement tokens.

The source DOCX is read without silent mutation. No repair route is included in v3.10.

## Untrusted content

- User-controlled strings are inserted with text-only rendering.
- Duplicate keys in manifest JSON are rejected.
- Path traversal and malformed packages fail closed.
- Local reviewer names and IDs remain labels only; no authentication or signature claim is made.

## Browser and UI security checks

- Exact runtime HTML executed with zero page errors in the managed Chromium test harness.
- Light and dark theme behavior passed.
- Keyboard focus visibility and constrained viewport behavior passed.
- Added inputs have accessible names.
- The mode tablist role structure was corrected.
- Print summary is available without granting approval authority.

## Environment limitations

Native Windows Chromium `file://` navigation could not be executed in the managed container because administrator policy returned `ERR_BLOCKED_BY_ADMINISTRATOR`. The exact HTML bytes were tested through Chromium `page.set_content`; repository Playwright CI covers served runtime and axe-core scanning. This limitation remains open until a native Windows local or CI environment executes the standalone file directly.
