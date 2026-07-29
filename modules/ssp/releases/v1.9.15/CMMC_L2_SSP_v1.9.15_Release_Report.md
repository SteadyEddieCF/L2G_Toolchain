# Release Report — CMMC L2 SSP v1.9.15

## Scope
Issue #79 authorizes only adaptive compaction of the Needs Attention workspace above the derived work queue.

## Corrections
- Adds an accessible **Filters & queue summary** control.
- Collapses authority details, filters, search, and metric summaries by default below 960 px viewport height.
- Expands them by default on taller desktop viewports.
- Retains an explicit user choice for the browser session.
- Keeps all six filters on one row where desktop width permits.
- Converts tall metric cards to compact 34 px summary cells.
- Visually shortens the laptop-height header while preserving the complete explanatory DOM text.

## Measured local results
| Viewport | Default tools state | Header | Queue body | Expanded panel |
|---|---|---:|---:|---:|
| 1366×768 | collapsed | 51 px | 700 px | 130 px |
| 1440×900 | collapsed | 51 px | 829 px | 130 px |
| 1668×1030 | expanded | 89 px | 718 px | 130 px |
| 1920×1080 | expanded | 89 px | 718 px | 130 px |

## Compatibility
- Baseline runtime SHA-256: `8edd518e9b34b36c2d4795890e54412a12724ee54d758f97574f64764578d45e`.
- Candidate runtime SHA-256: `5e3a628556fc63db777fbef813eee8df9e2d8a1405a81bd87c058012503f2361`.
- Working-data schema remains v1.9.11.
- Built-in review registry and package contracts are unchanged.
- Exactly 110 authoritative requirements remain.

## Handshake
No handshake is required for v1.9.15. RG-4 is the next planned SSP workstream and requires a joint SSP/Builder-Merger handshake release.
