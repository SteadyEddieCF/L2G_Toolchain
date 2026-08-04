from pathlib import Path
import hashlib
import json
import subprocess

ROOT = Path(__file__).resolve().parents[1]
RELEASE = json.loads((ROOT / "release" / "release.json").read_text(encoding="utf-8"))
ARTIFACT = ROOT / "dist" / RELEASE["artifact_name"]

subprocess.run(["python", "scripts/build.py"], cwd=ROOT, check=True, stdout=subprocess.DEVNULL)
first = hashlib.sha256(ARTIFACT.read_bytes()).hexdigest()
subprocess.run(["python", "scripts/build.py"], cwd=ROOT, check=True, stdout=subprocess.DEVNULL)
second = hashlib.sha256(ARTIFACT.read_bytes()).hexdigest()
assert first == second, (first, second)
print(first)
