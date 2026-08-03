from pathlib import Path
import hashlib, json, re

ROOT = Path(__file__).resolve().parents[1]
RELEASE = json.loads((ROOT / "release" / "release.json").read_text())
ARTIFACT = ROOT / "dist" / RELEASE["artifact_name"]
HTML = ARTIFACT.read_text()

checks = [
    ("single app root", HTML.count('id="app"') == 1),
    ("CSP blocks network", "connect-src 'none'" in HTML),
    ("AES-GCM present", "AES-GCM" in HTML),
    ("PBKDF2 profile", "600000" in HTML and "PBKDF2" in HTML),
    ("encrypted recovery", "l2g_encrypted_recovery_v1" in HTML),
    ("outer envelope", "l2g_encrypted_project_v1" in HTML),
    ("synthetic boundary", "synthetic-only" in HTML.lower()),
    ("no remote URLs", not re.search(r"https?://", HTML)),
]
failed = [name for name, ok in checks if not ok]
if failed:
    raise SystemExit("Validation failed: " + ", ".join(failed))
manifest = json.loads((ROOT / "dist" / "release-manifest.json").read_text())
actual = hashlib.sha256(ARTIFACT.read_bytes()).hexdigest()
assert manifest["sha256"] == actual
print(json.dumps({"sha256": actual, "size": ARTIFACT.stat().st_size, "checks": len(checks)}))
