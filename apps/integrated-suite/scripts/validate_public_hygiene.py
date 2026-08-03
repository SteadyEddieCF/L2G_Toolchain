from __future__ import annotations

import re
from pathlib import Path

APP_ROOT = Path(__file__).resolve().parents[1]
SCAN_ROOTS = [APP_ROOT / "src", APP_ROOT / "schemas", APP_ROOT / "fixtures", APP_ROOT / "release", APP_ROOT / "dist"]
PATTERNS = {
    "private key": re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    "GitHub token": re.compile(r"\bgh[pousr]_[A-Za-z0-9]{20,}\b"),
    "AWS access key": re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
    "Windows user path": re.compile(r"[A-Za-z]:\\Users\\[^\\\s]+", re.I),
    "Unix home path": re.compile(r"/(?:home|Users)/[^/\s]+/"),
    "localhost credential URL": re.compile(r"https?://[^\s:/]+:[^\s/@]+@"),
}

violations: list[str] = []
for root in SCAN_ROOTS:
    if not root.exists():
        continue
    for path in root.rglob("*"):
        if not path.is_file() or path.suffix.lower() in {".png", ".zip", ".l2g"}:
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        for label, pattern in PATTERNS.items():
            if pattern.search(text):
                violations.append(f"{path.relative_to(APP_ROOT)}: {label}")

if violations:
    raise SystemExit("Public-repository hygiene violations:\n" + "\n".join(violations))
print("Public-repository hygiene scan passed.")
