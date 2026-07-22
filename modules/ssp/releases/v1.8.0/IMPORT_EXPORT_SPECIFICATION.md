# Import and Export Specification — v1.8.0

## Accepted imports

- Existing SSP JSON backup schemas through v1.7.1.
- v1.8.0 SSP JSON backup with `portfolioFoundation`.
- `cmmc_l2_ssp_portfolio_foundation_v1` package containing `foundation` and `anchorWorkspace`.
- Existing CRM CSV, Word Review DOCX, and L2G Workshop handoff contracts remain unchanged.

Imports validate the SSP schema, portfolio schema/version, stable IDs, root module, duplicate IDs, missing parents, and cycles before applying data. HTML is stripped from imported metadata before display.

## Exports

- v1.8.0 complete SSP data backup JSON.
- Complete portfolio foundation JSON with anchor workspace, classification warning, and limitations.
- Selected module foundation JSON; non-anchor modules contain metadata only.
- Existing CRM CSV, Word Review, HTML, print/PDF, and L2G return outputs.

Consolidated/module-specific CRM and module-specific Word Review packages are deliberately deferred.
