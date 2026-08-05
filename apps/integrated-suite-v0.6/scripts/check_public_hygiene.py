from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEXT_SUFFIXES = {".ts", ".css", ".json", ".md", ".py", ".mjs", ".yml", ".yaml"}
SKIP = {"node_modules", "build", "dist", "releases"}
patterns = {
    "Windows private path": re.compile(r"\b[A-Za-z]:\\(?:Users|Documents and Settings)\\", re.I),
    "Unix private home path": re.compile(r"/(?:home|Users)/[A-Za-z0-9._-]+/"),
    "private key material": re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    "GitHub/OpenAI-like token": re.compile(r"\b(?:gh[pousr]_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9_-]{20,})\b"),
    "AWS access key": re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
}
violations = []
for path in ROOT.rglob("*"):
    if not path.is_file() or path.suffix not in TEXT_SUFFIXES or any(part in SKIP for part in path.parts):
        continue
    text = path.read_text(encoding="utf-8", errors="replace")
    for label, pattern in patterns.items():
        if pattern.search(text):
            violations.append(f"{path.relative_to(ROOT)}: {label}")
    if "client legal name" in text.lower() or "actual cui" in text.lower():
        violations.append(f"{path.relative_to(ROOT)}: non-synthetic engagement marker")
if violations:
    raise SystemExit("Public-hygiene violations:\n" + "\n".join(sorted(violations)))
notes = (ROOT / "release" / "RELEASE_NOTES_v0.6.0.md").read_text(encoding="utf-8")
if "Synthetic-only" not in notes and "synthetic" not in notes.lower():
    raise SystemExit("Release notes do not state the synthetic-only posture.")
print("v0.6 public-hygiene gate passed")
