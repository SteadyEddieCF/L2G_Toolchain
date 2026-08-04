from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGETS = [ROOT / "dist", ROOT / "releases" / "v0.5.0", ROOT / "build" / "fixtures"]
FORBIDDEN_BYTE_PATTERNS = {
    "Windows user profile path": re.compile(rb"[A-Za-z]:\\Users\\[^\\\r\n]+", re.I),
    "macOS user profile path": re.compile(rb"/Users/[^/\r\n]+", re.I),
    "Linux home path": re.compile(rb"/home/[^/\r\n]+", re.I),
    "private key block": re.compile(rb"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    "AWS access key": re.compile(rb"AKIA[0-9A-Z]{16}"),
    "OpenAI-style secret": re.compile(rb"sk-(?:proj-)?[A-Za-z0-9_-]{20,}"),
    "GitHub token": re.compile(rb"gh[pousr]_[A-Za-z0-9]{20,}"),
}

files: list[Path] = []
for target in TARGETS:
    if not target.exists():
        raise SystemExit(f"Public-hygiene target is missing: {target}")
    files.extend(path for path in target.rglob("*") if path.is_file())

if not files:
    raise SystemExit("No v0.5 candidate files were available for public-hygiene validation.")

failures: list[str] = []
for file in files:
    relative = file.relative_to(ROOT)
    if "fixtures" in relative.parts and not file.name.startswith("synthetic-"):
        failures.append(f"Non-synthetic fixture name: {relative}")
    data = file.read_bytes()
    for label, pattern in FORBIDDEN_BYTE_PATTERNS.items():
        if pattern.search(data):
            failures.append(f"{label} detected in {relative}")

release_html = ROOT / "dist" / "L2G_Integrated_Suite_Pre_Engagement_Interview_v0.5.0.html"
if not release_html.is_file():
    failures.append("Portable v0.5 HTML is missing from dist")
else:
    html = release_html.read_text(encoding="utf-8")
    if re.search(r"https?://", html):
        failures.append("Remote URL detected in portable v0.5 HTML")
    if "synthetic-only" not in html.lower():
        failures.append("Synthetic-only qualification is missing from portable v0.5 HTML")

if failures:
    raise SystemExit("Public-hygiene validation failed:\n- " + "\n- ".join(sorted(set(failures))))

print(f"Public-hygiene validation passed for {len(files)} v0.5 candidate files.")
