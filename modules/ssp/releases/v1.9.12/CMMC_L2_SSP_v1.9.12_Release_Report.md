# Release Report — CMMC L2 SSP v1.9.12

## Scope

Issue #70 authorizes only compact responsive workspace chrome over the promoted v1.9.11 runtime. No governed-data, profile, package, adjacent-tool, or authority change is included.

## UX changes

- Shortened product identity and workspace-mode labels.
- Compact primary toolbar with completion metrics reduced to inline counts.
- Objective navigation moved into a one-line document-state strip.
- Long browser-local persistence warning moved behind **State details**.
- Hidden portfolio scope controls remain hidden and cannot be forced visible by responsive CSS.
- Authoring guidance reduced to one line and suppressed automatically on short-height viewports.
- Undo, redo, and print menu mirrors preserve access when corresponding toolbar controls are hidden.
- Responsive behavior covers 1366×768, 1440×900, 1536×864, 1668×1030, and 1920×1080.

## Local measurements

| Viewport | Toolbar chrome | Document top |
|---|---:|---:|
| 1366×768 | 104 px | 204 px |
| 1440×900 | 104 px | 204 px |
| 1668×1030 | 112 px | 212 px |
| 1920×1080 | 112 px | 212 px |

The Single-System state strip remained one row at 46 px in these checks.

## Compatibility

- Baseline runtime SHA-256: `4e2db5ccf4a520519a0f6845d36ec7f543febf3b45b9a9934cf48ce4d61bc3f6`.
- Candidate runtime SHA-256: `1980bcff89633b13d20e17ba8862bda660afdaf06c0afd2f1e968a9b26eb0a6c`.
- Working-data schema remains v1.9.11 SHA-256 `7d1ed6c95415360ad5f805cf103e3c777fd9ef52dc1e4bedecbb2cf30c223251`.
- Built-in profile registry and registry schema are byte-identical.
- Exactly 110 authoritative requirements remain present.
- RG-1, RG-2, UX-3, RG-3, Word Review, backup, import/export, and migration behavior remain available.
- No package kind, route, payload, or cross-tool contract changes.

## Limitations

- Extremely narrow mobile widths continue to prioritize primary controls and may suppress secondary toolbar controls.
- This release does not redesign modal workspaces or SSP document-page content.
- Final Word QA remains outside SSP.

## QA posture

Local verification passed JavaScript parsing, exact hash reconstruction, unchanged schema/registry identities, 110-control count, viewport measurement targets, one-row state strip, semantic hidden-state preservation, dark mode, constrained-height behavior, print suppression, zero captured page/console errors, and zero external requests. Repository validation, Playwright/axe, visual regression, and Windows Chromium `file://` must pass on the exact final PR head before merge.

## Roadmap and handshake

No handshake is required for v1.9.12. After promotion, the next workstream is **RG-4 Builder/Merger final Word-QA sidecar**, which must begin as a separately authorized joint SSP/Builder-Merger handshake release.
