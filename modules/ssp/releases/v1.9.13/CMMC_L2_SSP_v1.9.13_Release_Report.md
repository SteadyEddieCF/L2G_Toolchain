# Release Report — CMMC L2 SSP v1.9.13

## Scope
Issue #73 authorizes only dark-mode correction for the RG-2 Review Workspace and UX-3 Needs Attention workspace, plus visual alignment and warning-chip truncation correction in the compact toolbar. No governed-data, profile, package, adjacent-tool, or authority change is included.

## Corrections
- RG-2 and UX-3 legacy surface variables are mapped to the SSP theme so dark mode no longer falls back to white cards.
- Modal headings, panels, controls, selected states, borders, and form fields use the SSP dark palette.
- Primary toolbar controls share a 42 px outer height.
- State-strip chips and controls share a 34 px height.
- The visible autosave warning is shortened to `Autosave storage full · create backup`; the full action detail remains in the existing notice and State details.

## Measured results
| Viewport | Primary controls | State-strip controls | Document top |
|---|---:|---:|---:|
| 1366×768 | 42 px | 34 px | 206 px |
| 1440×900 | 42 px | 34 px | 206 px |
| 1668×1030 | 42 px | 34 px | 214 px |
| 1920×1080 | 42 px | 34 px | 214 px |

The autosave warning chip has equal client and scroll widths at every target viewport, so its full concise text is visible.

## Compatibility
- Baseline runtime SHA-256: `34252e7a02e6122700cd2cc845ce53fafdfe42b6bad55ae4b28035914e802d31`.
- Candidate runtime SHA-256: `1b36a7c2664df97ae468ef85ea1ac0d8ddcf8426433e8a7e5a12ef603836a3da`.
- Working-data schema remains v1.9.11.
- Built-in profile registry and registry schema are byte-identical.
- Exactly 110 authoritative requirements remain present.
- No package kind, route, payload, or cross-tool contract changes.

## Handshake
No handshake is required for v1.9.13. RG-4 Builder/Merger final Word-QA sidecar remains the next mandatory joint SSP/Builder-Merger handshake release after promotion.
