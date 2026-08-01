#!/usr/bin/env python3
from __future__ import annotations

import base64
import gzip
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
HARNESS = ROOT / "validation/rg4/ssp-history-harness"
FIXTURES = HARNESS / "fixtures"
UNSUPPORTED_EXPECTED = "73121ab9a8160c84f28aeff2b8d61969392b7c2eac1a83d8de5966595f48d780"
HANDOFF_ENCODED_EXPECTED = "6a56bbebce04e7da659447c4d22ad2515894b106c46df8456b0d7f08a0ef0247"
HANDOFF_DECODED_EXPECTED = "81ca3171e14e3f2ff8caed17b70a031f50e0bcd3c75a69cb5367e221bb073947"
CANONICAL_IDS = [
    "WKS-RG4-001",
    "WKS-RG4-002",
    "WKS-RG4-003",
    "WKS-RG4-004",
    "WKS-RG4-005",
    "RG4-ROUNDTRIP-006",
]


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(message)


parts = sorted(FIXTURES.glob("RG4_Workshop_v79_SSP_Handoff_1.0.json.gz.b64.part*"))
require(len(parts) == 5, f"expected 5 Workshop Handoff fixture parts, observed {len(parts)}")
encoded_handoff = b"".join(b"".join(path.read_bytes().split()) for path in parts)
require(len(encoded_handoff) == 8596, "combined base64 size mismatch")
require(sha256_bytes(encoded_handoff) == HANDOFF_ENCODED_EXPECTED, "combined base64 SHA-256 mismatch")
handoff_bytes = gzip.decompress(base64.b64decode(encoded_handoff, validate=True))
require(sha256_bytes(handoff_bytes) == HANDOFF_DECODED_EXPECTED, "decoded Handoff SHA-256 mismatch")
require(len(handoff_bytes) == 160234, "decoded Handoff size mismatch")
handoff = json.loads(handoff_bytes)
require(handoff.get("package_kind") == "l2g_ssp_handoff_v1", "unexpected Handoff package kind")
require(handoff.get("package_version") == "1.0", "unexpected Handoff package version")
require(len(handoff.get("controls", [])) == 110, "Handoff must contain exactly 110 controls")

unsupported_path = FIXTURES / "unsupported_synthetic_history_seed.json"
require(unsupported_path.is_file(), "missing unsupported synthetic history fixture")
require(sha256_bytes(unsupported_path.read_bytes()) == UNSUPPORTED_EXPECTED, "unsupported fixture SHA-256 mismatch")
unsupported = json.loads(unsupported_path.read_text(encoding="utf-8"))
require(not unsupported.get("packageFingerprint"), "unsupported seed unexpectedly has packageFingerprint")
require(not (unsupported.get("sidecar") or {}).get("package_fingerprint"), "unsupported seed unexpectedly has nested package fingerprint")

blockers = json.loads((HARNESS / "CANONICAL_BLOCKER_MAP.json").read_text(encoding="utf-8"))
require([row.get("id") for row in blockers.get("blockers", [])] == CANONICAL_IDS, "canonical blocker ID map mismatch")

matrix = json.loads((HARNESS / "REGRESSION_MATRIX.json").read_text(encoding="utf-8"))
require(matrix.get("runtime_sha256") == "bfd9d10a780809ba259406f0770641da6a40ac2d8a6d1e372b070d6f5273351b", "runtime identity mismatch")
require(matrix.get("working_data_schema") == "1.9.11", "working-data schema mismatch")
require(matrix.get("authoritative_requirements") == 110, "authoritative requirement count mismatch")
require(matrix.get("existing_ssp_v1_9_17_consumer_tests_preserved") is True, "existing SSP consumer tests must remain preserved")

required_files = [
    ROOT / "tests/playwright/ssp-rg4-history-harness-fixture.mjs",
    ROOT / "tests/playwright/ssp-rg4-history-harness.spec.mjs",
    ROOT / "tests/playwright/ssp-rg4-history-file-smoke.spec.mjs",
    ROOT / ".github/workflows/ssp-rg4-history-harness.yml",
]
for path in required_files:
    require(path.is_file(), f"missing harness file: {path.relative_to(ROOT)}")

package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
scripts = package.get("scripts", {})
require("ssp-rg4-history-harness.spec.mjs" in scripts.get("test:qa", ""), "shared Playwright QA registration missing")
require("ssp-rg4-history-file-smoke.spec.mjs" in scripts.get("test:file", ""), "Windows file-origin registration missing")
require("ssp-rg4-history-harness.spec.mjs" in scripts.get("test:rg4-history", ""), "focused Playwright registration missing")

print("SSP RG-4 history harness static validation passed")
print(f"  {HANDOFF_ENCODED_EXPECTED}  combined Workshop Handoff base64")
print(f"  {HANDOFF_DECODED_EXPECTED}  decoded Workshop Handoff JSON")
print(f"  {UNSUPPORTED_EXPECTED}  unsupported synthetic history seed")
