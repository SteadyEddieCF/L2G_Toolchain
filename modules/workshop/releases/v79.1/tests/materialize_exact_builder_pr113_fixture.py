#!/usr/bin/env python3
from __future__ import annotations

import base64
import hashlib
import json
import os
import urllib.request
import zipfile
from io import BytesIO
from pathlib import Path

REPOSITORY = "SteadyEddieCF/L2G_Toolchain"
ARTIFACT_ID = 8811712583
SOURCE_RUN = 30679432233
SOURCE_HEAD = "bbc8d3bea308a1655567780bea002bc8ef834d8a"
EXPECTED_SIZE = 683_940
EXPECTED_SHA256 = "efde24c5a0c401c8e1ef9075eb751675359e0dd09419de7a9dae0a34c69c02af"
OUT = Path(__file__).resolve().parent / "fixtures" / "builder_v3_10_1_pr113_exact_merge.json"


def find_attachment(value):
    if isinstance(value, dict):
        if value.get("name") == "v3101-merge.json" and isinstance(value.get("body"), str):
            return value["body"]
        for child in value.values():
            found = find_attachment(child)
            if found is not None:
                return found
    elif isinstance(value, list):
        for child in value:
            found = find_attachment(child)
            if found is not None:
                return found
    return None


def main() -> None:
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if not token:
        raise SystemExit("GITHUB_TOKEN or GH_TOKEN is required to retrieve the exact PR #113 artifact")
    request = urllib.request.Request(
        f"https://api.github.com/repos/{REPOSITORY}/actions/artifacts/{ARTIFACT_ID}/zip",
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "workshop-v79.1-exact-builder-fixture",
        },
    )
    with urllib.request.urlopen(request) as response:
        archive = response.read()
    with zipfile.ZipFile(BytesIO(archive)) as zf:
        report = json.loads(zf.read("playwright-results.json"))
    encoded = find_attachment(report)
    if encoded is None:
        raise SystemExit("v3101-merge.json attachment was not found in PR #113 artifact")
    payload = base64.b64decode(encoded, validate=True)
    actual = hashlib.sha256(payload).hexdigest()
    if len(payload) != EXPECTED_SIZE or actual != EXPECTED_SHA256:
        raise SystemExit(
            f"Exact PR #113 Merge identity mismatch: size={len(payload)} sha256={actual}"
        )
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_bytes(payload)
    print(
        json.dumps(
            {
                "source_run": SOURCE_RUN,
                "source_head": SOURCE_HEAD,
                "artifact_id": ARTIFACT_ID,
                "output": str(OUT),
                "size_bytes": len(payload),
                "sha256": actual,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
