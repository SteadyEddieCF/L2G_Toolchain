from pathlib import Path
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[1]
RELEASE = json.loads((ROOT / "release" / "release.json").read_text(encoding="utf-8"))
ARTIFACT = ROOT / "dist" / RELEASE["artifact_name"]
HTML = ARTIFACT.read_text(encoding="utf-8")

checks = [
    ("single app root", HTML.count('id="app"') == 1),
    ("CSP blocks network", "connect-src 'none'" in HTML and "default-src 'none'" in HTML),
    ("AES-GCM present", "AES-GCM" in HTML),
    ("PBKDF2 profile", "600000" in HTML and "PBKDF2" in HTML),
    ("encrypted recovery", "l2g_encrypted_recovery_v1" in HTML),
    ("outer envelope", "l2g_encrypted_project_v1" in HTML),
    ("engagement schema", "l2g_engagement_v1" in HTML),
    ("projection schema", "l2g_engagement_projection_v1" in HTML),
    ("synthetic boundary", "synthetic-only" in HTML.lower()),
    ("no remote URLs", not re.search(r"https?://", HTML)),
    ("no telemetry markers", not re.search(r"analytics|telemetry|sentry|segment\.io|google-analytics", HTML, re.I)),
]
failed = [name for name, ok in checks if not ok]
if failed:
    raise SystemExit("Validation failed: " + ", ".join(failed))
manifest = json.loads((ROOT / "dist" / "release-manifest.json").read_text(encoding="utf-8"))
actual = hashlib.sha256(ARTIFACT.read_bytes()).hexdigest()
assert manifest["sha256"] == actual
assert manifest["version"] == "0.3.0"
assert manifest["engagement_schema_kind"] == "l2g_engagement_v1"
assert manifest["runtime_network_dependencies"] == 0
assert manifest["synthetic_only"] is True
assert manifest["production_data_authorized"] is False
sbom = json.loads((ROOT / "dist" / "sbom.spdx.json").read_text(encoding="utf-8"))
assert sbom["spdxVersion"] == "SPDX-2.3"
release_dir = ROOT / "releases" / "v0.3.0"
assert (release_dir / ARTIFACT.name).read_bytes() == ARTIFACT.read_bytes()
for required in ["release-manifest.json", "sbom.spdx.json", "RELEASE_NOTES.md", "SHA256SUMS.txt"]:
    assert (release_dir / required).is_file(), required
print(json.dumps({"sha256": actual, "size": ARTIFACT.stat().st_size, "checks": len(checks)}))
