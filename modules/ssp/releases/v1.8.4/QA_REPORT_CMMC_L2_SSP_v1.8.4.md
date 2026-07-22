# QA Report — v1.8.4

Static, JSON Schema, browser DOM/runtime, full-fixture CRM generation, actual CSV download, mixed reconciliation, deterministic repository materialization, extracted-package materialization, and archive-integrity checks passed locally. The McFirecoal fixture produced 440 consolidated rows, 110 selected-module rows, 35 unique authoritative module/requirement sources, 36 inherited/shared/supplement references, 398 pending rows, and one open conflict. The mixed CRM import produced one safe, one conflict, and one invalid row; only the safe row applied.

The local Chromium policy blocks direct `file://` navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`; the browser regression therefore records that policy condition and falls back to the same standalone HTML through `set_content`. Repository Playwright and Windows `file://` smoke remain required draft-PR gates.
