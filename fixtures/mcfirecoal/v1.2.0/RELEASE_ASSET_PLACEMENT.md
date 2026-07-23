# GitHub Placement and Publication Instructions

## Current repository status

- Metadata reconciliation PR **#30** is already squash-merged at `e146f23536daf61db7052cb423a9a658368a4caa`.
- Fixture registration PR **#32 — Register McFirecoal toolchain fixture v1.2.0** is open as a draft.
- SSP backup-schema defect issue **#31** remains open and SSP-owned.

## A. Complete fixture registration PR #32

1. Open repository `SteadyEddieCF/L2G_Toolchain`.
2. Open Pull Request **#32 — Register McFirecoal toolchain fixture v1.2.0**.
3. Confirm the diff contains only these five small files:
   - `fixtures/mcfirecoal/current.json`
   - `fixtures/mcfirecoal/v1.2.0/README.md`
   - `fixtures/mcfirecoal/v1.2.0/fixture-set-manifest.json`
   - `fixtures/mcfirecoal/v1.2.0/EXPECTED_RESULTS.md`
   - `fixtures/mcfirecoal/v1.2.0/RELEASE_ASSET_PLACEMENT.md`
4. Confirm no application runtime, workflow, or binary ZIP appears in the diff.
5. Confirm **Validate L2G Toolchain**, **Playwright QA**, visual regression, and Windows `file://` smoke are green.
6. Click **Ready for review**.
7. Choose **Squash and merge**.
8. Confirm the squash merge.
9. Click **Delete branch** for `fixtures/mcfirecoal-v1.2.0`.

## B. Create the private fixture Release

Do not unzip or commit the fixture ZIPs into normal Git history.

1. Open the repository’s **Code** page.
2. Select **Releases** in the right sidebar or release area.
3. Click **Draft a new release**.
4. Click **Choose a tag**.
5. Enter exactly: `test-fixture-mcfirecoal-v1.2.0`
6. Choose **Create new tag on publish**.
7. Set the target to the protected `main` commit produced by the squash merge of PR #32.
8. Enter release title: `McFirecoal Toolchain Test Fixture v1.2.0`
9. Mark the release as **Pre-release** so it is distinct from product releases.
10. Paste this description:

   `Synthetic CMMC Level 2 toolchain regression fixture. No real CUI, PII, credentials, secrets, or client data. Process in order: Part 1, Part 2, Part 3. Parts 1 and 2 preserve the clean 104-file baseline. Part 3 contains intentionally malformed and adversarial cases. All parts remain below the 90-entry untrusted-ZIP cap. Do not weaken safeguards.`

11. Drag these exact files into **Attach binaries by dropping them here or selecting them**:
    - `McFirecoal_Toolchain_Test_Fixture_v1.2.0_Part_1_Scoping_Governance.zip`
    - `McFirecoal_Toolchain_Test_Fixture_v1.2.0_Part_2_Technical_Provider_Evidence.zip`
    - `McFirecoal_Toolchain_Test_Fixture_v1.2.0_Part_3_Adversarial_Integration.zip`
    - `McFirecoal_Toolchain_Test_Fixture_v1.2.0_Set_Documentation.zip`
12. Before publishing, compare every uploaded filename and size against `fixtures/mcfirecoal/v1.2.0/fixture-set-manifest.json`.
13. Click **Publish release**.
14. Copy the published Release URL.
15. Add that URL as a comment on PR #32 if it remains open, or record it in a later metadata-only update to `fixtures/mcfirecoal/current.json` if #32 is already merged.
