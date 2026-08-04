from pathlib import Path
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[1]
RELEASE = json.loads((ROOT / "release" / "release.json").read_text(encoding="utf-8"))
ARTIFACT = ROOT / "dist" / RELEASE["artifact_name"]
HTML = ARTIFACT.read_text(encoding="utf-8")
WORKER_CHUNK_POST = bool(re.search(r"worker\.postMessage\(\{\s*id,\s*file,\s*chunkSize:\s*(?:1048576|1024\s*\*\s*1024)\s*\}\)", HTML))

checks = [
    ("single app root", HTML.count('id="app"') == 1),
    ("CSP blocks network", "default-src 'none'" in HTML and "connect-src 'none'" in HTML),
    ("blob worker bounded", "worker-src blob:" in HTML and "new Worker" in HTML and WORKER_CHUNK_POST),
    ("AES-GCM present", "AES-GCM" in HTML),
    ("PBKDF2 profile", "600000" in HTML and "PBKDF2" in HTML),
    ("encrypted recovery", "l2g_encrypted_recovery_v1" in HTML),
    ("outer envelope", "l2g_encrypted_project_v1" in HTML),
    ("engagement schema", "l2g_engagement_v1" in HTML),
    ("evidence schema", "l2g_evidence_index_v1" in HTML),
    ("evidence projection", "l2g_evidence_projection_v1" in HTML),
    ("reference-only boundary", "Original files stay outside the project" in HTML),
    ("hash qualification", "byte equality" in HTML and "evidence sufficiency" in HTML),
    ("no remote URLs", not re.search(r"https?://", HTML)),
    ("no telemetry SDK", not re.search(r"sentry(?:\.io)?|segment\.io|google-analytics|mixpanel|amplitude\(", HTML, re.I)),
    ("no source map", "sourceMappingURL" not in HTML),
]
failed = [name for name, ok in checks if not ok]
if failed:
    raise SystemExit("Validation failed: " + ", ".join(failed))

manifest = json.loads((ROOT / "dist" / "release-manifest.json").read_text(encoding="utf-8"))
actual = hashlib.sha256(ARTIFACT.read_bytes()).hexdigest()
assert manifest["sha256"] == actual
assert manifest["version"] == "0.4.0"
assert manifest["evidence_schema_kind"] == "l2g_evidence_index_v1"
assert manifest["evidence_schema_version"] == "1.0"
assert manifest["runtime_network_dependencies"] == 0
assert manifest["synthetic_only"] is True
assert manifest["production_data_authorized"] is False
schema = json.loads((ROOT / "dist" / "l2g_evidence_index_v1.schema.json").read_text(encoding="utf-8"))
assert schema["properties"]["schema_kind"]["const"] == "l2g_evidence_index_v1"
sbom = json.loads((ROOT / "dist" / "sbom.spdx.json").read_text(encoding="utf-8"))
assert sbom["spdxVersion"] == "SPDX-2.3"
release_dir = ROOT / "releases" / "v0.4.0"
assert (release_dir / ARTIFACT.name).read_bytes() == ARTIFACT.read_bytes()
for required in ["release-manifest.json", "sbom.spdx.json", "RELEASE_NOTES.md", "SHA256SUMS.txt", "l2g_evidence_index_v1.schema.json"]:
    assert (release_dir / required).is_file(), required
print(json.dumps({"sha256": actual, "size": ARTIFACT.stat().st_size, "checks": len(checks)}))
