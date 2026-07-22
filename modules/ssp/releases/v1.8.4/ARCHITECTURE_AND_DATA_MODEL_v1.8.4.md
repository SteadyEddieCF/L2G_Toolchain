# Architecture and Data Model — v1.8.4

Portfolio schema 1.4.0 keeps module requirements as the source of truth. CRM rows are derived views, not duplicate authoritative records. Each row resolves its authoritative source through the same-requirement inheritance chain, records the immediate inherited base, and emits explicit counting/evidence dispositions. Two optional arrays preserve imported CRM source and legacy identifiers. A bounded `crmReconciliations` history stores source/report fingerprints and counts, not imported file contents.
