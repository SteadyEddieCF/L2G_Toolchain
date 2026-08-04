from __future__ import annotations

import base64
import hashlib
import json
import os
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]
BUILD = ROOT / "build"
DIST = ROOT / "dist"
RELEASE_DIR = ROOT / "releases" / "v0.4.0"
RELEASE = json.loads((ROOT / "release" / "release.json").read_text(encoding="utf-8"))
REGISTRY = json.loads((REPO / "apps" / "integrated-suite-v0.2" / "contracts" / "registry.json").read_text(encoding="utf-8"))


def compile_typescript() -> None:
    local = ROOT / "node_modules" / ".bin" / ("tsc.cmd" if os.name == "nt" else "tsc")
    compiler = str(local) if local.exists() else shutil.which("tsc")
    if not compiler:
        raise SystemExit("TypeScript compiler is unavailable. Run npm ci in apps/integrated-suite-v0.4.")
    subprocess.run([compiler, "-p", str(ROOT / "tsconfig.build.json")], cwd=ROOT, check=True)


for directory in (BUILD, DIST, RELEASE_DIR):
    if directory.exists():
        shutil.rmtree(directory)
    directory.mkdir(parents=True, exist_ok=True)

compile_typescript()
script = (BUILD / "app.js").read_text(encoding="utf-8").strip()
style = (ROOT / "src" / "styles.css").read_text(encoding="utf-8").strip()
template = (ROOT / "src" / "template.html").read_text(encoding="utf-8")
release_json = json.dumps(RELEASE, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
registry_json = json.dumps(REGISTRY, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
bootstrap = f"window.__L2G_RELEASE__={release_json};window.__L2G_CONTRACT_REGISTRY__={registry_json};"

sha_b64 = lambda value: base64.b64encode(hashlib.sha256(value.encode("utf-8")).digest()).decode("ascii")
csp = "; ".join([
    "default-src 'none'",
    f"script-src 'sha256-{sha_b64(bootstrap)}' 'sha256-{sha_b64(script)}'",
    f"style-src 'sha256-{sha_b64(style)}'",
    "connect-src 'none'",
    "img-src data:",
    "font-src 'none'",
    "object-src 'none'",
    "frame-src 'none'",
    "child-src blob:",
    "worker-src blob:",
    "form-action 'none'",
    "base-uri 'none'",
    "media-src 'none'",
])

html = template.replace("__L2G_STYLE__", style).replace("__L2G_CSP__", csp)
html = html.replace("window.__L2G_RELEASE__=__L2G_RELEASE_JSON__;window.__L2G_CONTRACT_REGISTRY__=__L2G_REGISTRY_JSON__;", bootstrap)
html = html.replace("__L2G_SCRIPT__", script)
placeholder_tokens = ["__L2G_STYLE__", "__L2G_CSP__", "__L2G_RELEASE_JSON__", "__L2G_REGISTRY_JSON__", "__L2G_SCRIPT__"]
remaining = [token for token in placeholder_tokens if token in html]
if remaining:
    raise SystemExit("Unreplaced build placeholder remains: " + ", ".join(remaining))

artifact = DIST / RELEASE["artifact_name"]
artifact.write_text(html, encoding="utf-8", newline="\n")
sha = hashlib.sha256(artifact.read_bytes()).hexdigest()
manifest = {
    "kind": "l2g_integrated_suite_release_v1",
    "application": RELEASE["application"],
    "version": RELEASE["version"],
    "artifact": artifact.name,
    "sha256": sha,
    "size": artifact.stat().st_size,
    "content_security_policy": csp,
    "project_kind": RELEASE["project_kind"],
    "envelope_kind": RELEASE["envelope_kind"],
    "engagement_schema_kind": RELEASE["engagement_schema_kind"],
    "engagement_schema_version": RELEASE["engagement_schema_version"],
    "evidence_schema_kind": RELEASE["evidence_schema_kind"],
    "evidence_schema_version": RELEASE["evidence_schema_version"],
    "product_runtime_compatibility_baseline": RELEASE["product_runtime_compatibility_baseline"],
    "runtime_network_dependencies": 0,
    "synthetic_only": True,
    "production_data_authorized": False,
    "inherited_validated_primitives": [
        "apps/integrated-suite-v0.2/src/util.ts",
        "apps/integrated-suite-v0.2/src/zip.ts",
        "apps/integrated-suite-v0.3/src/encryption.ts",
    ],
}
(DIST / "release-manifest.json").write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n", encoding="utf-8")

schema = ROOT / "schemas" / "l2g_evidence_index_v1.schema.json"
sbom = {
    "spdxVersion": "SPDX-2.3",
    "dataLicense": "CC0-1.0",
    "SPDXID": "SPDXRef-DOCUMENT",
    "name": "L2G Integrated Suite Evidence Catalog v0.4.0",
    "documentNamespace": f"https://l2g.local/spdx/integrated-suite-v0.4.0/{sha}",
    "creationInfo": {"created": "2026-08-04T00:00:00Z", "creators": ["Tool: deterministic-build.py"]},
    "packages": [
        {"name": "L2G Integrated Suite", "SPDXID": "SPDXRef-Package-L2G", "versionInfo": "0.4.0", "downloadLocation": "NOASSERTION", "filesAnalyzed": True, "checksums": [{"algorithm": "SHA256", "checksumValue": sha}], "licenseConcluded": "NOASSERTION", "licenseDeclared": "NOASSERTION", "copyrightText": "NOASSERTION"},
        {"name": "TypeScript", "SPDXID": "SPDXRef-Package-TypeScript", "versionInfo": "5.8.3", "downloadLocation": "https://registry.npmjs.org/typescript/-/typescript-5.8.3.tgz", "filesAnalyzed": False, "licenseConcluded": "Apache-2.0", "licenseDeclared": "Apache-2.0", "copyrightText": "NOASSERTION"},
    ],
    "relationships": [{"spdxElementId": "SPDXRef-DOCUMENT", "relationshipType": "DESCRIBES", "relatedSpdxElement": "SPDXRef-Package-L2G"}],
}
(DIST / "sbom.spdx.json").write_text(json.dumps(sbom, indent=2, sort_keys=True) + "\n", encoding="utf-8")
notes = (ROOT / "release" / "RELEASE_NOTES_v0.4.0.md").read_text(encoding="utf-8")
(DIST / "RELEASE_NOTES.md").write_text(notes, encoding="utf-8")
shutil.copy2(schema, DIST / schema.name)

for file in sorted(DIST.iterdir()):
    shutil.copy2(file, RELEASE_DIR / file.name)
sha_lines = []
for file in sorted(RELEASE_DIR.iterdir()):
    if file.name == "SHA256SUMS.txt":
        continue
    sha_lines.append(f"{hashlib.sha256(file.read_bytes()).hexdigest()}  {file.name}")
(RELEASE_DIR / "SHA256SUMS.txt").write_text("\n".join(sha_lines) + "\n", encoding="utf-8")
shutil.copy2(RELEASE_DIR / "SHA256SUMS.txt", DIST / "SHA256SUMS.txt")
print(json.dumps(manifest, sort_keys=True))
