#!/usr/bin/env python3
from __future__ import annotations

import gzip
import hashlib
import io
import tarfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
SOURCE = HERE / "source"
GOVERNANCE = HERE / "governance"
RUNTIME_OUTPUT = HERE.parent / "v0.3.4" / "L2G_CC_v0.3.4.html"
RUNTIME_SHA256 = "9eec722499fd5f0a76249ccb6f27547d6fe6fc64059a418b136af48b8edf7a73"
GOVERNANCE_SHA256 = "1e85444d4ba4aec2663e3343d73f7fff9791f691f228ae6651db8e71e623359e"
EXPECTED_GOVERNANCE = {
    "L2G_CC_Roadmap_v0.3.4.md",
    "L2G_CC_v0.3.4_Accessibility_QA.json",
    "L2G_CC_v0.3.4_Compatibility_Rules.json",
    "L2G_CC_v0.3.4_Default_Module_Manifest.json",
    "L2G_CC_v0.3.4_Regression.json",
    "L2G_CC_v0.3.4_Release_Report.md",
    "L2G_CC_v0.3.4_Static_QA.json",
    "L2G_CC_v0.3.4_Suite_Evidence_Snapshot.json",
    "L2G_CC_v0.3.4_Visual_QA.json",
}


def join_parts(directory: Path, pattern: str, expected_count: int) -> bytes:
    parts = sorted(directory.glob(pattern))
    if len(parts) != expected_count:
        raise SystemExit(
            f"Expected {expected_count} parts matching {directory / pattern}, found {len(parts)}"
        )
    return b"".join(path.read_bytes() for path in parts)


def verify_sha(data: bytes, expected: str, label: str) -> None:
    actual = hashlib.sha256(data).hexdigest()
    if actual != expected:
        raise SystemExit(f"{label} SHA-256 mismatch: expected {expected}, got {actual}")


runtime_gzip = join_parts(SOURCE, "L2G_CC_v0.3.4.html.gz.part*.bin", 3)
runtime_html = gzip.decompress(runtime_gzip)
verify_sha(runtime_html, RUNTIME_SHA256, "Runtime")
RUNTIME_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
RUNTIME_OUTPUT.write_bytes(runtime_html)

governance_archive = join_parts(
    GOVERNANCE, "L2G_CC_v0.3.4_governance.tar.gz.part*.bin", 3
)
verify_sha(governance_archive, GOVERNANCE_SHA256, "Governance archive")

with tarfile.open(fileobj=io.BytesIO(governance_archive), mode="r:gz") as archive:
    members = archive.getmembers()
    names = {member.name for member in members}
    if names != EXPECTED_GOVERNANCE:
        missing = sorted(EXPECTED_GOVERNANCE - names)
        unexpected = sorted(names - EXPECTED_GOVERNANCE)
        raise SystemExit(
            f"Governance archive inventory mismatch; missing={missing}, unexpected={unexpected}"
        )
    for member in members:
        if not member.isfile() or Path(member.name).name != member.name:
            raise SystemExit(f"Unsafe governance member: {member.name}")
        extracted = archive.extractfile(member)
        if extracted is None:
            raise SystemExit(f"Unable to read governance member: {member.name}")
        (HERE / member.name).write_bytes(extracted.read())

print(
    f"Built {RUNTIME_OUTPUT} ({len(runtime_html)} bytes, sha256={RUNTIME_SHA256}) "
    f"and materialized {len(EXPECTED_GOVERNANCE)} governance files"
)
