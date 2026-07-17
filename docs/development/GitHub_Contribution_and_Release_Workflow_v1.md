# GitHub Contribution and Release Workflow v1

## Web ChatGPT connector

1. Verify access to `SteadyEddieCF/L2G_Toolchain`.
2. Create a bounded branch from `main`.
3. Modify only the assigned module plus directly related contracts, fixtures, tests, or suite snapshot entries.
4. Commit UTF-8 source, Markdown, JSON, YAML, scripts, and tests.
5. Open a pull request containing the release scope, contract impact, test results, limitations, binary assets, and rollback path.
6. Inspect GitHub Actions and correct or explain failures.
7. Do not merge without user approval or an approved auto-merge policy.

## Desktop Codex or GitHub Desktop

Use a local clone for large single-file HTML applications and binary deliverables:

```text
git clone https://github.com/SteadyEddieCF/L2G_Toolchain.git
```

Check out the branch created by the development chat, copy the release files to the prescribed module path, run repository and module tests, commit, push, and return to the pull request.

## Large-file policy

Keep source and governance in git. Complete ZIP bundles, screenshots, XLSX/DOCX/PDF fixtures, and other generated binaries should normally be GitHub Release assets or GitHub Actions artifacts rather than repeated in git history.
