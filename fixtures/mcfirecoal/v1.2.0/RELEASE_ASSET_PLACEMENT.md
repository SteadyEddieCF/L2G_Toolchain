# GitHub Placement and Publication Instructions

## A. Merge the metadata reconciliation first

1. Open repository `SteadyEddieCF/L2G_Toolchain`.
2. Open Pull Request **#30 — Reconcile active toolchain baseline for SSP v1.9.5 audit**.
3. Confirm it remains mergeable and all checks are green.
4. Click **Ready for review**.
5. Choose **Squash and merge**.
6. Confirm the squash merge.
7. Click **Delete branch** for `audit/toolchain-baseline-reconciliation-2026-07-23`.

This PR changes metadata and audit documentation only. It does not contain the fixture ZIPs.

## B. Merge the fixture registration PR

This fixture registration contains only small documentation and manifests under `fixtures/mcfirecoal/v1.2.0/`, plus `fixtures/mcfirecoal/current.json`.

After PR #30 is merged:

1. Refresh the fixture registration PR from `main` if GitHub reports that it is behind.
2. Confirm no runtime, workflow, or binary ZIP is in the diff.
3. Confirm repository validation is green.
4. Mark it ready.
5. Squash-merge it.
6. Delete its branch.

## C. Create the private fixture Release

Do not unzip or commit the fixture ZIPs into normal Git history.

1. Open the repository.
2. Select **Releases**.
3. Click **Draft a new release**.
4. Click **Choose a tag**.
5. Enter exactly `test-fixture-mcfirecoal-v1.2.0`.
6. Choose **Create new tag on publish**.
7. Target the latest protected `main` after the fixture registration PR is merged.
8. Enter release title `McFirecoal Toolchain Test Fixture v1.2.0`.
9. Mark the release as **Pre-release**.
10. State that the assets contain synthetic test data only; no real CUI, PII, credentials, secrets, or client data.
11. State the upload/process order: Part 1, Part 2, Part 3.
12. State that Parts 1 and 2 preserve the clean 104-file baseline and Part 3 contains intentionally malformed/adversarial cases.
13. State that all parts remain below the 90-entry ZIP safety cap and safeguards must not be weakened.
14. Attach these four files:
    - `McFirecoal_Toolchain_Test_Fixture_v1.2.0_Part_1_Scoping_Governance.zip`
    - `McFirecoal_Toolchain_Test_Fixture_v1.2.0_Part_2_Technical_Provider_Evidence.zip`
    - `McFirecoal_Toolchain_Test_Fixture_v1.2.0_Part_3_Adversarial_Integration.zip`
    - `McFirecoal_Toolchain_Test_Fixture_v1.2.0_Set_Documentation.zip`
15. Compare filenames and file sizes with `fixture-set-manifest.json`.
16. Publish the release.
17. Add the final Release URL to a repository comment or update this document in a later metadata-only PR.
