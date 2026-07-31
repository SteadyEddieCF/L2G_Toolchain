#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent
ALLOWED = {
    "package_kind",
    "package_version",
    "handoff_schema_enhancements_version",
    "schema_trusted",
    "contract_manifest",
    "package_integrity",
}


class DuplicateKey(ValueError):
    pass


def pairs(items):
    out = {}
    for key, value in items:
        if key in out:
            raise DuplicateKey(key)
        out[key] = value
    return out


def load(path):
    return json.loads(path.read_text(encoding="utf-8"), object_pairs_hook=pairs)


def validate_current(data):
    errors = []

    def require(path, value, expected):
        if value != expected:
            errors.append(f"{path}: expected {expected!r}, got {value!r}")

    require("package_kind", data.get("package_kind"), "l2g_workbook_handoff_v1")
    require("package_version", data.get("package_version"), "1.0")
    require(
        "handoff_schema_enhancements_version",
        data.get("handoff_schema_enhancements_version"),
        "1.7",
    )
    require("schema_trusted", data.get("schema_trusted"), True)

    manifest = data.get("contract_manifest") if isinstance(data.get("contract_manifest"), dict) else {}
    require("contract_manifest.contract_name", manifest.get("contract_name"), "l2g_workbook_handoff_v1")
    require("contract_manifest.contract_release", manifest.get("contract_release"), "1.7")

    required_identity = (
        manifest.get("required_package_identity")
        if isinstance(manifest.get("required_package_identity"), dict)
        else {}
    )
    require(
        "contract_manifest.required_package_identity.package_kind",
        required_identity.get("package_kind"),
        "l2g_workbook_handoff_v1",
    )
    require(
        "contract_manifest.required_package_identity.package_version",
        required_identity.get("package_version"),
        "1.0",
    )

    integrity = data.get("package_integrity") if isinstance(data.get("package_integrity"), dict) else {}
    require("package_integrity.contract_release", integrity.get("contract_release"), "1.7")

    unknown = sorted(set(data) - ALLOWED)
    if unknown:
        errors.append("unknown top-level fields: " + ", ".join(unknown))
    return errors


def main():
    expected = {
        "canonical_current.json": True,
        "legacy_1_6_explicit.json": False,
        "invalid_wire_package_1_7.json": False,
        "invalid_unknown_enhancement_1_8.json": False,
        "invalid_missing_package_version.json": False,
        "invalid_embedded_identity_mismatch.json": False,
        "invalid_unknown_top_level_property.json": False,
        "invalid_duplicate_key.json.txt": False,
    }
    failed = []
    for name, want_valid_current in expected.items():
        path = ROOT / "fixtures" / name
        try:
            data = load(path)
            valid_current = not validate_current(data)
        except (json.JSONDecodeError, DuplicateKey):
            valid_current = False
        print(f"{name}: {'valid-current' if valid_current else 'rejected-current'}")
        if valid_current != want_valid_current:
            failed.append(name)
    if failed:
        raise SystemExit("unexpected fixture result: " + ", ".join(failed))
    print("Workbook Handoff identity fixture validation passed.")


if __name__ == "__main__":
    main()
