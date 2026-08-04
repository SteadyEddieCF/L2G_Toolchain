from pathlib import Path
import hashlib
import json
import subprocess

ROOT = Path(__file__).resolve().parents[1]
release = json.loads((ROOT / "release" / "release.json").read_text(encoding="utf-8"))
artifact = ROOT / "dist" / release["artifact_name"]
before = hashlib.sha256(artifact.read_bytes()).hexdigest()
subprocess.run(["python", str(ROOT / "scripts" / "build.py")], cwd=ROOT, check=True)
after = hashlib.sha256(artifact.read_bytes()).hexdigest()
if before != after:
    raise SystemExit(f"Deterministic build mismatch: {before} != {after}")
print(after)
