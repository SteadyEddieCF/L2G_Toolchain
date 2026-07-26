# Issue #42 Bounded Scope — SSP v1.9.6

## Release

`CMMC L2 SSP Modern Editable v1.9.6 — Editor Clarity and Document-State UX`

## Baselines

- Protected `main` at authorization: `035fe77a3a90d01bef8908229b6a8357a76adcac`
- SSP v1.9.5.1 merge/runtime-source baseline: `fec2396489cbe85a1a1032a9d84b80c8350aa2eb`
- Exact runtime-source SHA-256: `a291b6b1c13b6232ca73e7ed00c9fed40eccdd216ee8bda8ceb4f3dfb59599e8`
- Working-data schema SHA-256: `be2659f848c74e41cfbe47db642efcc3835f5d5b32dc7d3e9054991ad84a8a36`

## Implemented

- persistent document-state summary;
- visible Author, Review Document, and Focused Control labels and explanations while retaining internal `working`, `document`, and `focus` identifiers;
- primary versus advanced toolbar grouping;
- outcome-first Deliver routing over existing exports;
- truthful browser-local persistence and export-attempt language;
- qualified local-governance labels;
- persistent browser-local portfolio scope/module selection;
- direct dashboard/queue navigation with focus restoration and return behavior;
- capped and sanitized browser-local UI preferences excluded from governed exports.

## Explicitly not implemented

- UX-2 full-screen portfolio workspace;
- unified Needs Attention queue;
- review-gate profile or 55-item mapping;
- staged SME, Quality, or Project Director review;
- Word inspection or Builder/Merger sidecar;
- bulk workflows or migration wizard;
- new cross-tool contracts;
- adjacent-tool changes.
