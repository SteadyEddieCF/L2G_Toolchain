from pathlib import Path
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[1]
RELEASE = json.loads((ROOT / "release" / "release.json").read_text(encoding="utf-8"))
ARTIFACT = ROOT / "dist" / RELEASE["artifact_name"]
HTML = ARTIFACT.read_text(encoding="utf-8")
WORKER_CHUNK_POST = bool(
    re.search(
        r"worker\.postMessage\(\{\s*id,\s*file,\s*chunkSize:\s*(?:1048576|1024\s*\*\s*1024)\s*\}\)",
        HTML,
    )
)

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
    ("pre-engagement schema", "l2g_pre_engagement_v1" in HTML),
    ("interview schema", "l2g_interview_sessions_v1" in HTML),
    ("reference-only boundary", "Original files stay outside the project" in HTML),
    ("hash qualification", "byte equality" in HTML and "evidence sufficiency" in HTML),
    ("advisor-only note boundary", "advisor-only" in HTML and "Advisor note" in HTML),
    ("locally asserted confirmation", "locally asserted" in HTML and "confirmation" in HTML.lower()),
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
assert manifest["version"] == "0.5.0"
assert manifest["artifact"] == RELEASE["artifact_name"]
assert manifest["evidence_schema_kind"] == "l2g_evidence_index_v1"
assert manifest["evidence_schema_version"] == "1.0"
assert manifest["pre_engagement_schema_kind"] == "l2g_pre_engagement_v1"
assert manifest["pre_engagement_schema_version"] == "1.0"
assert manifest["interview_schema_kind"] == "l2g_interview_sessions_v1"
assert manifest["interview_schema_version"] == "1.0"
assert manifest["runtime_network_dependencies"] == 0
assert manifest["synthetic_only"] is True
assert manifest["production_data_authorized"] is False

schema_expectations = {
    "l2g_evidence_index_v1.schema.json": "l2g_evidence_index_v1",
    "l2g_pre_engagement_v1.schema.json": "l2g_pre_engagement_v1",
    "l2g_interview_sessions_v1.schema.json": "l2g_interview_sessions_v1",
}
for filename, kind in schema_expectations.items():
    schema = json.loads((ROOT / "dist" / filename).read_text(encoding="utf-8"))
    assert schema["properties"]["schema_kind"]["const"] == kind
    assert schema.get("additionalProperties") is False

sbom = json.loads((ROOT / "dist" / "sbom.spdx.json").read_text(encoding="utf-8"))
assert sbom["spdxVersion"] == "SPDX-2.3"
assert any(package.get("versionInfo") == "0.5.0" for package in sbom["packages"])

release_dir = ROOT / "releases" / "v0.5.0"
assert (release_dir / ARTIFACT.name).read_bytes() == ARTIFACT.read_bytes()
required_files = [
    "release-manifest.json",
    "sbom.spdx.json",
    "RELEASE_NOTES.md",
    "SHA256SUMS.txt",
    *schema_expectations.keys(),
]
for required in required_files:
    assert (release_dir / required).is_file(), required

sum_lines = (release_dir / "SHA256SUMS.txt").read_text(encoding="utf-8").splitlines()
listed = {line.split("  ", 1)[1] for line in sum_lines if "  " in line}
assert set(required_files) - {"SHA256SUMS.txt"} <= listed
assert ARTIFACT.name in listed

print(json.dumps({"sha256": actual, "size": ARTIFACT.stat().st_size, "checks": len(checks), "release_files": len(listed)}))
