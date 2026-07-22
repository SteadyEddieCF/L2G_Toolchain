from __future__ import annotations

import base64
import copy
import gzip
import hashlib
import io
import json
import subprocess
import tarfile
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
SOURCE = HERE / "source"
PARTS = sorted(SOURCE.glob("release-source-v1.8.4.tar.gz.b64.part-*"))
BUNDLE_SHA256 = "cf4f2e6d345a15b1082a369b523fb5fbc682761d8bc67f141faac12208cbb22b"
BASE_RELEASE = HERE.parent / "v1.8.3"
BASE = BASE_RELEASE / "CMMC_L2_SSP_Modern_Editable_v1.8.3.html"
BASE_FIXTURES = BASE_RELEASE / "fixtures"
PATCH_B64 = SOURCE / "runtime-v1.8.3-to-v1.8.4.patch.gz.b64"
OUTPUT = HERE / "CMMC_L2_SSP_Modern_Editable_v1.8.4.html"
BASE_SHA256 = "81602cf206a05efb39297dce21bc06d1d3d43ec495465bb8acf97ceed632b2f5"
PATCH_SOURCE_SHA256 = "3d9efef235652abd2743bb4e068621dd3176677b0e24e4259c23f07af80a577f"
OUTPUT_SHA256 = "976251ec10d227844a7b1b4f8131f9dbcb17e2ebb1aa31c5296d711274aeeb6b"


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def extract_bundle() -> None:
    if not PARTS:
        raise SystemExit("Governed v1.8.4 release-source bundle parts are missing.")
    archive = base64.b64decode(b"".join(part.read_bytes() for part in PARTS))
    actual = hashlib.sha256(archive).hexdigest()
    if actual != BUNDLE_SHA256:
        raise SystemExit(f"Governed v1.8.4 release-source bundle hash mismatch: {actual}")
    with tarfile.open(fileobj=io.BytesIO(archive), mode="r:gz") as package:
        root = HERE.resolve()
        for member in package.getmembers():
            destination = (HERE / member.name).resolve()
            if destination != root and root not in destination.parents:
                raise SystemExit(f"Unsafe release bundle path: {member.name}")
        package.extractall(HERE, filter="data")


def migrate_fixture(document: dict) -> dict:
    result = copy.deepcopy(document)
    result["schemaVersion"] = "1.4.0"
    result["crmReconciliations"] = []
    for record in result["moduleRequirements"]:
        record.setdefault("crmSourceIdentifiers", [])
        record.setdefault("crmLegacyIdentifiers", [])
    return result


def generate_fixtures() -> None:
    destination = HERE / "fixtures"
    destination.mkdir(exist_ok=True)
    valid = migrate_fixture(
        json.loads((BASE_FIXTURES / "Portfolio_Impact_McFirecoal_v1.8.3.json").read_text())
    )
    (destination / "Portfolio_CRM_McFirecoal_v1.8.4.json").write_text(
        json.dumps(valid, indent=2) + "\n"
    )

    missing = copy.deepcopy(valid)
    missing.pop("crmReconciliations", None)
    (destination / "Invalid_CRM_Missing_Reconciliations.json").write_text(
        json.dumps(missing, indent=2) + "\n"
    )

    bad_identifier = copy.deepcopy(valid)
    bad_identifier["moduleRequirements"][0]["crmSourceIdentifiers"] = ["ok", 42]
    (destination / "Invalid_CRM_Source_Identifier.json").write_text(
        json.dumps(bad_identifier, indent=2) + "\n"
    )

    bad_summary = copy.deepcopy(valid)
    bad_summary["crmReconciliations"] = [
        {
            "reconciliationId": "reconciliation-invalid-summary",
            "importedAt": "2026-07-22T12:00:00Z",
            "sourceFileName": "invalid.csv",
            "sourceFingerprint": "bad-fingerprint",
            "importFormat": "modular-crm-v1",
            "targetModuleId": "",
            "totalRows": 1,
            "safeRows": 0,
            "unchangedRows": 0,
            "conflictRows": 1,
            "invalidRows": 0,
            "appliedRows": 0,
            "reportFingerprint": "fnv1a64-0000000000000000",
        }
    ]
    (destination / "Invalid_CRM_Reconciliation_Fingerprint.json").write_text(
        json.dumps(bad_summary, indent=2) + "\n"
    )

    for old_name in [
        "Invalid_Impact_Field.json",
        "Invalid_Impact_Fingerprint.json",
        "Invalid_Impact_Without_Rationale.json",
    ]:
        migrated = migrate_fixture(json.loads((BASE_FIXTURES / old_name).read_text()))
        new_name = old_name.replace(".json", "_v1.8.4.json")
        (destination / new_name).write_text(json.dumps(migrated, indent=2) + "\n")


def normalize_repository_manifest() -> None:
    path = HERE / "CMMC_L2_SSP_v1.8.4_Release_Manifest.json"
    manifest = json.loads(path.read_text())
    manifest["governedSource"]["packageFallbackBaseline"] = (
        "Complete deliverables package only; repository materialization uses sibling v1.8.3."
    )
    manifest["fixtures"] = sorted(path.name for path in (HERE / "fixtures").iterdir())
    path.write_text(json.dumps(manifest, indent=2) + "\n")


def materialize_runtime() -> None:
    if digest(BASE) != BASE_SHA256:
        raise SystemExit("Authoritative v1.8.3 runtime hash mismatch.")
    patch = gzip.decompress(base64.b64decode(PATCH_B64.read_text().strip()))
    if hashlib.sha256(patch).hexdigest() != PATCH_SOURCE_SHA256:
        raise SystemExit("Governed v1.8.4 patch source hash mismatch.")
    OUTPUT.write_bytes(BASE.read_bytes())
    with tempfile.NamedTemporaryFile(suffix=".patch") as handle:
        handle.write(patch)
        handle.flush()
        subprocess.run(
            ["patch", "--batch", "--forward", str(OUTPUT), handle.name], check=True
        )
    actual = digest(OUTPUT)
    if actual != OUTPUT_SHA256:
        raise SystemExit(
            f"Materialized runtime hash mismatch: expected {OUTPUT_SHA256}, got {actual}"
        )


def write_result() -> None:
    result = {
        "release": "v1.8.4",
        "baseline": "v1.8.3",
        "baselineSha256": BASE_SHA256,
        "bundleSha256": BUNDLE_SHA256,
        "patchSourceSha256": PATCH_SOURCE_SHA256,
        "runtimeSha256": digest(OUTPUT),
        "status": "materialized",
    }
    (HERE / "materialization-result.json").write_text(
        json.dumps(result, indent=2) + "\n"
    )


def main() -> None:
    extract_bundle()
    generate_fixtures()
    normalize_repository_manifest()
    materialize_runtime()
    write_result()
    print(f"Materialized {OUTPUT.name}\nSHA-256: {digest(OUTPUT)}")


if __name__ == "__main__":
    main()
