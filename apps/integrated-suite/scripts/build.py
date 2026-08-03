from __future__ import annotations

import base64
import hashlib
import json
import shutil
import subprocess

from build_support import (
    APP_ROOT, BUILD_DIR, DIST_DIR, FIXTURE_DIR, REGISTRY, RELEASE, RELEASE_DIR,
    build_fixtures, compile_typescript, normalize, sha256, stable_json,
)


def main() -> None:
    BUILD_DIR.mkdir(parents=True, exist_ok=True)
    DIST_DIR.mkdir(parents=True, exist_ok=True)
    compile_typescript()
    app_js = normalize((BUILD_DIR / "app.js").read_text(encoding="utf-8"))
    css = normalize("".join((APP_ROOT / "src" / name).read_text(encoding="utf-8") for name in ["styles-tokens.css", "styles-shell.css", "styles-components.css"]))
    release_json = json.dumps({
        "application": RELEASE["application"],
        "version": RELEASE["version"],
        "product_runtime_compatibility_baseline": RELEASE["product_runtime_compatibility_baseline"],
        "synthetic_only": RELEASE["synthetic_only"],
    }, sort_keys=True, separators=(",", ":")).replace("<", "\\u003c")
    registry_json = json.dumps(REGISTRY, sort_keys=True, separators=(",", ":")).replace("<", "\\u003c")
    script = normalize(
        f"window.__L2G_RELEASE__=Object.freeze({release_json});\n"
        f"window.__L2G_CONTRACT_REGISTRY__=Object.freeze({registry_json});\n"
        f"{app_js}"
    )
    script_hash = base64.b64encode(hashlib.sha256(script.encode()).digest()).decode()
    style_hash = base64.b64encode(hashlib.sha256(css.encode()).digest()).decode()
    csp = (
        "default-src 'none'; "
        f"script-src 'sha256-{script_hash}'; "
        f"style-src 'sha256-{style_hash}'; "
        "connect-src 'none'; img-src data:; font-src 'none'; object-src 'none'; "
        "frame-src 'none'; child-src blob:; worker-src blob:; form-action 'none'; "
        "base-uri 'none'; manifest-src 'none'; media-src 'none'"
    )
    template = normalize((APP_ROOT / "src" / "template.html").read_text(encoding="utf-8"))
    html = template.replace("__CSP__", csp).replace("__CSS__", css).replace("__JS__", script)
    artifact = DIST_DIR / RELEASE["artifact_name"]
    artifact.write_text(html, encoding="utf-8", newline="\n")
    artifact_bytes = artifact.read_bytes()

    build_fixtures()
    manifest = {
        "kind": "l2g_integrated_suite_foundation_release_v1",
        "application": RELEASE["application"],
        "version": RELEASE["version"],
        "artifact": artifact.name,
        "sha256": sha256(artifact_bytes),
        "size": len(artifact_bytes),
        "content_security_policy": csp,
        "product_runtime_compatibility_baseline": RELEASE["product_runtime_compatibility_baseline"],
        "implementation_branch_baseline": RELEASE["implementation_branch_baseline"],
        "synthetic_only": True,
        "runtime_network_dependencies": 0,
        "build_inputs": [
            "src/types.ts", "src/security.ts", "src/zip.ts", "src/project.ts",
            "src/store.ts", "src/app-utils.ts", "src/app-core.ts", "src/app.ts",
            "src/styles-tokens.css", "src/styles-shell.css", "src/styles-components.css", "src/template.html",
            "contracts/registry.json", "release/release.json",
        ],
    }
    (DIST_DIR / "release-manifest.json").write_text(stable_json(manifest), encoding="utf-8", newline="\n")
    sbom = {
        "spdxVersion": "SPDX-2.3",
        "dataLicense": "CC0-1.0",
        "SPDXID": "SPDXRef-DOCUMENT",
        "name": "L2G-Integrated-Suite-Foundation-0.1.0",
        "documentNamespace": "https://github.com/SteadyEddieCF/L2G_Toolchain/l2g-integrated-suite-foundation/0.1.0",
        "creationInfo": {"created": "2026-08-03T00:00:00Z", "creators": ["Tool: L2G deterministic build.py"]},
        "packages": [
            {
                "name": "L2G Integrated Suite Foundation",
                "SPDXID": "SPDXRef-Package-L2G",
                "versionInfo": RELEASE["version"],
                "downloadLocation": "NOASSERTION",
                "filesAnalyzed": False,
                "licenseConcluded": "NOASSERTION",
                "licenseDeclared": "NOASSERTION",
                "supplier": "Organization: L2G",
                "externalRefs": [],
            },
            {
                "name": "typescript",
                "SPDXID": "SPDXRef-Package-TypeScript",
                "versionInfo": "5.8.3",
                "downloadLocation": "https://registry.npmjs.org/typescript/-/typescript-5.8.3.tgz",
                "filesAnalyzed": False,
                "licenseConcluded": "Apache-2.0",
                "licenseDeclared": "Apache-2.0",
                "checksums": [{"algorithm": "SHA1", "checksumValue": "92f8a3e5e3cf497356f4178c34cd65a7f5e8440e"}],
            },
        ],
        "relationships": [
            {"spdxElementId": "SPDXRef-DOCUMENT", "relationshipType": "DESCRIBES", "relatedSpdxElement": "SPDXRef-Package-L2G"},
            {"spdxElementId": "SPDXRef-Package-L2G", "relationshipType": "BUILD_DEPENDENCY_OF", "relatedSpdxElement": "SPDXRef-Package-TypeScript"},
        ],
    }
    sbom_path = DIST_DIR / "sbom.spdx.json"
    sbom_path.write_text(stable_json(sbom), encoding="utf-8", newline="\n")

    if RELEASE_DIR.exists():
        shutil.rmtree(RELEASE_DIR)
    RELEASE_DIR.mkdir(parents=True, exist_ok=True)
    release_files = {
        artifact.name: artifact,
        "release-manifest.json": DIST_DIR / "release-manifest.json",
        "sbom.spdx.json": sbom_path,
        "synthetic-foundation-project.l2g": FIXTURE_DIR / "synthetic-foundation-project.l2g",
        "RELEASE_NOTES.md": APP_ROOT / "release" / "RELEASE_NOTES_v0.1.0.md",
    }
    for name, source in release_files.items():
        shutil.copyfile(source, RELEASE_DIR / name)
    checksums = []
    for name in sorted(release_files):
        checksums.append(f"{sha256((RELEASE_DIR / name).read_bytes())}  {name}")
    (RELEASE_DIR / "SHA256SUMS.txt").write_text("\n".join(checksums) + "\n", encoding="utf-8", newline="\n")
    print(json.dumps({"artifact": str(artifact), "sha256": manifest["sha256"], "size": manifest["size"]}))


if __name__ == "__main__":
    try:
        main()
    except subprocess.CalledProcessError as exc:
        raise SystemExit(exc.returncode) from exc
