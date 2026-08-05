from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
RELEASE = json.loads((ROOT / "release" / "release.json").read_text(encoding="utf-8"))
artifact = DIST / RELEASE["artifact_name"]
manifest_path = DIST / "release-manifest.json"

if not artifact.is_file() or not manifest_path.is_file():
    raise SystemExit("Build the v0.6 candidate before validation.")
html = artifact.read_text(encoding="utf-8")
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
sha = hashlib.sha256(artifact.read_bytes()).hexdigest()
if manifest.get("sha256") != sha:
    raise SystemExit("Release manifest SHA-256 does not match the portable HTML.")
if manifest.get("version") != "0.6.0" or RELEASE.get("version") != "0.6.0":
    raise SystemExit("Release version identity is not v0.6.0.")
if manifest.get("scope_schema_kind") != "l2g_scope_v1" or manifest.get("scope_projection_kind") != "l2g_scope_projection_v1":
    raise SystemExit("Scope schema/projection identity is missing from the manifest.")
if "v0.6.0 — Scope Vertical Slice" not in html or "l2g_scope_v1" not in html or "domains/scope.json" not in html:
    raise SystemExit("Portable HTML does not expose the v0.6 Scope identity and archive path.")
required_runtime_markers = {
    "Scope workbench": "Objects describe the environment; Scope-owned decisions establish accepted authority.",
    "atomic Scope decision adapter": "Accepted Scope decision was not preserved after validation.",
    "source-to-Scope adapter": "Scope publication requires an exact source record identifier and version.",
    "historical diagram validation": "references a missing or invalid historical Scope version",
    "Scope import authority": "Applied a reviewed Scope package subset atomically as low-authority candidates."
}
missing_runtime = [label for label, marker in required_runtime_markers.items() if marker not in html]
if missing_runtime:
    raise SystemExit("Portable HTML omitted required v0.6 runtime layers: " + ", ".join(missing_runtime))
if any(token in html for token in ("__L2G_STYLE__", "__L2G_CSP__", "__L2G_SCRIPT__", "__L2G_RELEASE_JSON__")):
    raise SystemExit("Portable HTML contains an unreplaced build placeholder.")
if "connect-src 'none'" not in html or "default-src 'none'" not in html:
    raise SystemExit("Portable HTML CSP is not restrictive enough.")
if re.search(r"<(?:script|link|img|iframe)[^>]+(?:src|href)=['\"]https?://", html, re.I):
    raise SystemExit("Portable HTML contains a remote runtime dependency.")
for schema_name, kind in (("l2g_scope_v1.schema.json", "l2g_scope_v1"), ("l2g_scope_projection_v1.schema.json", "l2g_scope_projection_v1")):
    schema_path = DIST / schema_name
    if not schema_path.is_file():
        raise SystemExit(f"Missing release schema: {schema_name}")
    schema = json.loads(schema_path.read_text(encoding="utf-8"))
    if kind not in json.dumps(schema, sort_keys=True):
        raise SystemExit(f"Schema identity is invalid: {schema_name}")
for required in ("sbom.spdx.json", "RELEASE_NOTES.md", "SHA256SUMS.txt"):
    if not (DIST / required).is_file():
        raise SystemExit(f"Missing release artifact: {required}")
if manifest.get("runtime_network_dependencies") != 0 or manifest.get("synthetic_only") is not True or manifest.get("production_data_authorized") is not False:
    raise SystemExit("Release safety metadata is invalid.")
print(json.dumps({"artifact": artifact.name, "sha256": sha, "scope_schema": "l2g_scope_v1@1.0", "scope_projection": "l2g_scope_projection_v1@1.0", "runtime_layers": sorted(required_runtime_markers), "offline": True}, sort_keys=True))
