# Validation Rule Catalog — v1.8.4

- Exactly 110 requirement records per active module.
- CRM row identity must resolve to one module-requirement pair.
- Authoritative source resolution follows only same-requirement eligible inheritance chains.
- Derived CRM fields cannot be imported as editable truth.
- Existing non-empty governed values cannot be automatically replaced.
- Unknown module/record identities are invalid.
- Source and report fingerprints use canonical FNV-1a 64-bit identifiers.
- Reconciliation summaries are bounded to 100 entries.
- No CRM operation creates an assessment, certification, or approval conclusion.
