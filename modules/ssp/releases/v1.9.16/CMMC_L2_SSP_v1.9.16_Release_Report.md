# Release Report — CMMC L2 SSP v1.9.16

## Scope
Issue #87 authorizes only Review Workspace compact-header parity over promoted v1.9.15.

## Corrections
- Adds an accessible **Review setup & summary** control with synchronized `aria-expanded`.
- Moves the local authority boundary, profile-adoption preview, output/scope/identity/artifact setup into a collapsible panel.
- Defaults the panel collapsed at 1366×768, 1440×900, and 1536×864; defaults expanded at 1668×1030 and 1920×1080.
- Preserves an explicit browser-session override.
- Keeps a compact always-visible summary of active profile/version, scope, output profile, adoption availability, and progression/blockers.
- Reclaims height for stage navigation, stage instructions, review items, corrective actions, and sign-off.
- Hides decorative native scrollbars while preserving functional overflow.

## Measured local results
| Viewport | Default setup state | Header | Summary | Review body |
|---|---|---:|---:|---:|
| 1366×768 | collapsed | 51 px | 45 px | 598 px |
| 1440×900 | collapsed | 51 px | 45 px | 727 px |
| 1536×864 | collapsed | 51 px | 45 px | 692 px |
| 1668×1030 | expanded | 75 px | 45 px | 524 px |
| 1920×1080 | expanded | 75 px | 45 px | 524 px |

## Identity and compatibility
- Baseline v1.9.15 runtime SHA-256: `5e3a628556fc63db777fbef813eee8df9e2d8a1405a81bd87c058012503f2361`.
- Candidate v1.9.16 runtime SHA-256: `f463f01d8b24ec3865467261659f8e90222b23bb9875282e665f04bec778a765`.
- Working-data schema remains v1.9.11.
- Built-in profile registry and registry schema remain exact.
- Exactly 110 authoritative requirements remain.
- No package or cross-tool contract changes.

## Boundary
No handshake is required for v1.9.16. RG-4 remains separately authorized future SSP/Builder-Merger work.
