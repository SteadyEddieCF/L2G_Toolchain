# Release Report — CMMC L2 SSP v1.9.14

## Scope

Issue #76 authorizes only command-surface and modal-chrome consolidation over promoted v1.9.13. The release changes SSP presentation and responsive command placement; it does not change working data, review profiles, review decisions, package contracts, adjacent tools, or authority boundaries.

## Implemented corrections

- Replaced the Import and Export text triggers with 42 × 42 icon menu controls with accessible names and titles.
- Kept Undo and Redo as persistent top-toolbar icon controls and removed their duplicate Actions-menu entries.
- Removed Import from Actions. Actions now contains document lifecycle, advanced/portfolio, recovery, appearance, and destructive functions only.
- Moved Deliver into the Export menu while preserving the existing Deliver command handler and focus behavior.
- Used the reclaimed toolbar width to right-align the command cluster with a consistent 10 px edge gap at all tested desktop widths.
- Compacted Review, Needs Attention, State details, and Deliver headers while retaining required authority text.
- Replaced visible dialog-closing text controls with 36 × 36 × icon buttons carrying descriptive `aria-label` and `title` values.
- Hid decorative internal scrollbars while preserving overflow scrolling behavior when content requires it.
- Applied SSP light/dark button and surface styling consistently to Deliver and State details.

## Measured results

| Viewport | Right edge gap | Horizontal overflow | Undo/Redo | Import/Export |
|---|---:|---:|---|---|
| 1366×768 | 10 px | 0 px | Visible | 42 px icon controls |
| 1440×900 | 10 px | 0 px | Visible | 42 px icon controls |
| 1536×864 | 10 px | 0 px | Visible | 42 px icon controls |
| 1668×1030 | 10 px | 0 px | Visible | 42 px icon controls |
| 1920×1080 | 10 px | 0 px | Visible | 42 px icon controls |

Modal header heights at 1668×1030 are approximately 89 px for Review, State details, and Deliver, and 105 px for Needs Attention. Deliver and State details content fit their bodies without active internal overflow at that viewport. All tested modal scrollbars report `scrollbar-width: none`.

## Compatibility

- Baseline runtime SHA-256: `1b36a7c2664df97ae468ef85ea1ac0d8ddcf8426433e8a7e5a12ef603836a3da`.
- Candidate runtime SHA-256: `8edd518e9b34b36c2d4795890e54412a12724ee54d758f97574f64764578d45e`.
- Working-data schema remains v1.9.11.
- Built-in profile registry and registry schema remain byte-identical.
- Exactly 110 authoritative requirements remain present.
- Existing command targets, package kinds, filenames, confirmation flows, keyboard shortcuts, and no-network behavior remain intact.

## Handshake boundary

No cross-tool handshake is required for v1.9.14. RG-4 Builder/Merger final Word-QA sidecar remains the next mandatory joint SSP/Builder-Merger handshake release after promotion.
