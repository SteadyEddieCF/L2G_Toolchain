# Release Asset Import Checklist

For large HTML or binary release assets:

1. Clone the repository locally.
2. Check out the matching release branch.
3. Copy the standalone module HTML into both the versioned release folder and, after validation, the module `current/` folder.
4. Attach complete ZIP bundles, screenshots, workbooks, documents, and large fixtures to a GitHub Release or retain them as CI artifacts unless there is a specific reason to version them in git.
5. Verify hashes against the release manifest.
6. Run `python scripts/validate_toolchain.py`.
7. Commit, push, and confirm the pull-request checks pass.
