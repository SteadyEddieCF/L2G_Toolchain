from __future__ import annotations

import hashlib
import json
import re
import zipfile
from pathlib import Path

APP_ROOT = Path(__file__).resolve().parents[1]
DIST = APP_ROOT / "dist"
BUILD = APP_ROOT / "build"
RELEASE = json.loads((APP_ROOT / "release" / "release.json").read_text())


def fail(message: str) -> None:
    raise SystemExit(message)


def main() -> None:
    html_files = sorted(DIST.glob("*.html"))
    if [path.name for path in html_files] != [RELEASE["artifact_name"]]:
        fail(f"Expected exactly one HTML artifact, found {[p.name for p in html_files]}")
    artifact = html_files[0]
    data = artifact.read_bytes()
    text = data.decode("utf-8")
    manifest = json.loads((DIST / "release-manifest.json").read_text())
    if hashlib.sha256(data).hexdigest() != manifest["sha256"]:
        fail("Release manifest SHA-256 does not match the HTML artifact.")
    if manifest["size"] != len(data):
        fail("Release manifest size does not match the HTML artifact.")
    if "connect-src 'none'" not in text or "default-src 'none'" not in text:
        fail("Restrictive CSP is missing.")
    if re.search(r"https?://", text, re.I):
        fail("Runtime HTML contains an HTTP(S) dependency.")
    for forbidden in ("<script src=", "<link rel=", "<iframe", "<object", "<form action="):
        if forbidden in text.lower():
            fail(f"Forbidden runtime construct present: {forbidden}")
    for marker in (
        "Overview", "Pre-Engagement", "Evidence", "Scope", "Practice Review",
        "SSP", "Deliverables", "Reviews & Actions", "Presentation profile only",
        "l2g_project_v1", RELEASE["product_runtime_compatibility_baseline"],
    ):
        if marker not in text:
            fail(f"Required runtime marker missing: {marker}")
    sbom = json.loads((DIST / "sbom.spdx.json").read_text())
    if sbom.get("spdxVersion") != "SPDX-2.3":
        fail("SPDX SBOM is invalid.")

    release_dir = APP_ROOT / "releases" / f"v{RELEASE['version']}"
    release_artifact = release_dir / RELEASE["artifact_name"]
    if release_artifact.read_bytes() != data:
        fail("Generated release artifact does not match the deterministic dist artifact.")
    if (release_dir / "release-manifest.json").read_bytes() != (DIST / "release-manifest.json").read_bytes():
        fail("Generated release manifest does not match the deterministic dist manifest.")
    if (release_dir / "sbom.spdx.json").read_bytes() != (DIST / "sbom.spdx.json").read_bytes():
        fail("Generated SBOM does not match the deterministic dist SBOM.")
    pointer = json.loads((APP_ROOT / "current_release.json").read_text())
    if pointer["version"] != RELEASE["version"] or pointer["sha256"] != manifest["sha256"]:
        fail("Current release candidate pointer does not match the deterministic artifact.")
    checksums = {}
    for line in (release_dir / "SHA256SUMS.txt").read_text().splitlines():
        digest, name = line.split("  ", 1)
        checksums[name] = digest
    for name, digest in checksums.items():
        if hashlib.sha256((release_dir / name).read_bytes()).hexdigest() != digest:
            fail(f"Release checksum mismatch: {name}")

    fixture = BUILD / "fixtures" / "synthetic-foundation-project.l2g"
    with zipfile.ZipFile(fixture) as archive:
        names = sorted(archive.namelist())
        expected = sorted([
            "manifest.json", "domains/engagement.json", "domains/reviews-actions.json",
            "history/events.ndjson", "history/checkpoints.json",
            "compatibility/current-registry.json", "integrity/sha256-manifest.json",
        ])
        if names != expected:
            fail(f"Fixture path set mismatch: {names}")
        integrity = json.loads(archive.read("integrity/sha256-manifest.json"))
        for record in integrity["entries"]:
            payload = archive.read(record["path"])
            if record["size"] != len(payload) or record["sha256"] != hashlib.sha256(payload).hexdigest():
                fail(f"Fixture integrity mismatch: {record['path']}")
    print(json.dumps({"validated": True, "artifact": artifact.name, "sha256": manifest["sha256"]}))


if __name__ == "__main__":
    main()
