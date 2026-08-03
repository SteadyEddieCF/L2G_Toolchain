from __future__ import annotations

import base64
import hashlib
import json
import os
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BUILD = ROOT / "build"
DIST = ROOT / "dist"
RELEASE = json.loads((ROOT / "release" / "release.json").read_text(encoding="utf-8"))
REGISTRY = json.loads((ROOT / "contracts" / "registry.json").read_text(encoding="utf-8"))


def normalize(text: str) -> str:
    return text.replace("\r\n", "\n").replace("\r", "\n").rstrip() + "\n"


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def compile_typescript() -> None:
    local = ROOT / "node_modules" / ".bin" / ("tsc.cmd" if os.name == "nt" else "tsc")
    compiler = str(local) if local.exists() else shutil.which("tsc")
    if not compiler:
        raise SystemExit("TypeScript compiler is unavailable. Run npm ci in apps/integrated-suite-v0.2.")
    subprocess.run([compiler, "-p", str(ROOT / "tsconfig.build.json")], cwd=ROOT, check=True)


def main() -> None:
    BUILD.mkdir(exist_ok=True)
    DIST.mkdir(exist_ok=True)
    compile_typescript()
    js = normalize((BUILD / "app.js").read_text(encoding="utf-8"))
    css = normalize((ROOT / "src" / "styles.css").read_text(encoding="utf-8"))
    release_json = json.dumps(RELEASE, sort_keys=True, separators=(",", ":")).replace("<", "\\u003c")
    registry_json = json.dumps(REGISTRY, sort_keys=True, separators=(",", ":")).replace("<", "\\u003c")
    script = normalize(
        f"window.__L2G_RELEASE__=Object.freeze({release_json});\n"
        f"window.__L2G_CONTRACT_REGISTRY__=Object.freeze({registry_json});\n"
        f"{js}"
    )
    script_hash = base64.b64encode(hashlib.sha256(script.encode("utf-8")).digest()).decode("ascii")
    style_hash = base64.b64encode(hashlib.sha256(css.encode("utf-8")).digest()).decode("ascii")
    csp = (
        "default-src 'none'; "
        f"script-src 'sha256-{script_hash}'; "
        f"style-src 'sha256-{style_hash}'; "
        "connect-src 'none'; img-src data:; font-src 'none'; object-src 'none'; "
        "frame-src 'none'; child-src blob:; worker-src blob:; form-action 'none'; "
        "base-uri 'none'; media-src 'none'"
    )
    html = normalize((ROOT / "src" / "template.html").read_text(encoding="utf-8"))
    html = html.replace("__CSP__", csp).replace("__CSS__", css).replace("__JS__", script)
    artifact = DIST / RELEASE["artifact_name"]
    artifact.write_text(html, encoding="utf-8", newline="\n")
    manifest = {
        "kind": "l2g_integrated_suite_release_v1",
        "application": RELEASE["application"],
        "version": RELEASE["version"],
        "artifact": artifact.name,
        "sha256": sha256(artifact.read_bytes()),
        "size": artifact.stat().st_size,
        "envelope_kind": RELEASE["envelope_kind"],
        "project_kind": RELEASE["project_kind"],
        "content_security_policy": csp,
        "product_runtime_compatibility_baseline": RELEASE["product_runtime_compatibility_baseline"],
        "synthetic_only": True,
        "runtime_network_dependencies": 0,
    }
    (DIST / "release-manifest.json").write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n", encoding="utf-8", newline="\n")
    output = ROOT / "releases" / "v0.2.0"
    shutil.rmtree(output, ignore_errors=True)
    output.mkdir(parents=True)
    shutil.copy2(artifact, output / artifact.name)
    shutil.copy2(DIST / "release-manifest.json", output / "release-manifest.json")
    shutil.copy2(ROOT / "release" / "RELEASE_NOTES_v0.2.0.md", output / "RELEASE_NOTES.md")
    names = [artifact.name, "release-manifest.json", "RELEASE_NOTES.md"]
    checksums = [f"{sha256((output / name).read_bytes())}  {name}" for name in sorted(names)]
    (output / "SHA256SUMS.txt").write_text("\n".join(checksums) + "\n", encoding="utf-8", newline="\n")
    print(json.dumps(manifest, sort_keys=True))


if __name__ == "__main__":
    main()
