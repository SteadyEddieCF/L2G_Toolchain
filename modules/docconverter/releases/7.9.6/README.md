# DocConverter-L2G v7.9.6 release candidate

Bounded DocConverter-only release for the OCR Review Workbench and Batch Navigation.

## Reviewable source

- `DocConverter-L2G_v7.9.6_OCR_Workbench_Patch.js`
- `DocConverter-L2G_v7.9.6_Styles.css`
- `build_v796.py`

The deterministic build uses the governed v7.9.5.1 baseline and produces:

- `DocConverter-L2G_v7.9.6.html`
- 7,987,979 bytes
- SHA-256 `a4e1532fbd2ecafd43f50e5c2e9cb86c6ee0b208dc5073a6702a2c267b86a4a5`

The standalone runtime and complete deliverables ZIP are supplied separately. Do not advance the current-release pointer until the runtime is materialized at `modules/docconverter/releases/7.9.6/DocConverter-L2G_v7.9.6.html` and repository QA passes.

## Contract boundary

Intake, scope-context, and meeting-context package kinds remain version `1.0`. No adjacent application code or assessment conclusion is added.

## Disclosed limitation

The full 104-file outer-ZIP attempt did not complete within the managed 720-second timeout and is not claimed as a pass. Real embedded OCR, exact candidate precision, six-file core extraction, package construction, identity, static, and offline tests passed.
