#!/usr/bin/env python3
from pathlib import Path
import hashlib, subprocess, sys

HERE = Path(__file__).resolve().parent
BASE_DIR = HERE.parent / "v79"
BASE = BASE_DIR / "cmmc_l2_gap_workshop_tool_v79.html"
BASE_BUILD = BASE_DIR / "build_release.py"
OUT = HERE / "cmmc_l2_gap_workshop_tool_v79.1.html"
SOURCE = HERE / "source"
BASE_SHA = "a1f63944d0573587e2a5b7826f72befa16f6d89b849f3129f7f6dbb080da54ca"
OUT_SHA = "361a29613d85a42eb404aabbaec061fb815dbd347d90dc41c089e8024cc95dc1"
OUT_SIZE = 1852954

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def canonical_text(path):
    return path.read_text(encoding="utf-8").replace("\r\n", "\n").replace("\r", "\n")

if not BASE.exists() or digest(BASE) != BASE_SHA:
    subprocess.run([sys.executable, str(BASE_BUILD)], check=True)
if digest(BASE) != BASE_SHA:
    raise SystemExit("Workshop v79 baseline mismatch")

text = canonical_text(BASE)
replacements = [
    ("<title>CMMC L2 Gap Workshop Tool v79</title>", "<title>CMMC L2 Gap Workshop Tool v79.1</title>"),
    ('<h1>CMMC L2 Gap Workshop Tool <span class="small">v79</span></h1>', '<h1>CMMC L2 Gap Workshop Tool <span class="small">v79.1</span></h1>'),
    ('const CRM_TOOL_VERSION = "v79";', 'const CRM_TOOL_VERSION = "v79.1";'),
]
for old, new in replacements:
    if text.count(old) != 1:
        raise SystemExit(f"Expected exactly one replacement: {old}")
    text = text.replace(old, new, 1)

patch = canonical_text(SOURCE / "v79_1_patch.js")
index = text.rfind("</script>")
if index < 0:
    raise SystemExit("Workshop v79 closing script was not found")
text = text[:index] + patch + "\n" + text[index:]
OUT.write_bytes(text.encode("utf-8"))
actual = digest(OUT)
actual_size = OUT.stat().st_size
print(f"Workshop v79.1 candidate: size={actual_size} sha256={actual}")
if actual_size != OUT_SIZE or actual != OUT_SHA:
    raise SystemExit(f"Workshop v79.1 verification failed: size={actual_size} sha256={actual}")
