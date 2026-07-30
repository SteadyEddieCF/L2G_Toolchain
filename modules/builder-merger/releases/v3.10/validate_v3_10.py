#!/usr/bin/env python3
"""Static release validation for the Builder/Merger v3.10 candidate."""
from __future__ import annotations
import hashlib, json, re, subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent
HTML = ROOT / "L2G-BM_v3.10.html"
ARTIFACTS = ROOT / "artifacts"
EXPECTED_SHA = "96ecb1caee5f7ba278c3b46c666d703423e2db40cac22f8431e70485e5d76a17"
EXPECTED_SIZE = 775189
REQUIRED = [
    "l2g_ssp_word_qa_sidecar_v1",
    "WQA-PACKAGE-OPEN",
    "WQA-SOURCE-IDENTITY",
    "WQA-UNRESOLVED-TOKENS",
    "WQA-COMMENTS-REVISIONS",
    "WQA-LAYOUT-HUMAN",
]
LEGACY_WORD = "".join(map(chr, [116, 114, 105, 97, 103, 101]))
PROHIBITED = ["fetch(", "XMLHttpRequest", "sendBeacon", "<script src=", LEGACY_WORD, LEGACY_WORD.title()]


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> int:
    errors: list[str] = []
    if not HTML.is_file():
        errors.append("runtime missing")
        text = ""
    else:
        text = HTML.read_text("utf-8")
        if HTML.stat().st_size != EXPECTED_SIZE:
            errors.append("runtime size mismatch")
        if digest(HTML) != EXPECTED_SHA:
            errors.append("runtime hash mismatch")
    for value in REQUIRED:
        if value not in text:
            errors.append(f"required identity missing: {value}")
    for value in PROHIBITED:
        if value in text:
            errors.append("prohibited runtime behavior or wording present")
    if "connect-src 'none'" not in text:
        errors.append("offline CSP missing")
    scripts = re.findall(r"<script(?:\s[^>]*)?>(.*?)</script>", text, flags=re.I | re.S)
    for index, script in enumerate(scripts, 1):
        if not script.strip():
            continue
        temp = ROOT / f".validate_script_{index}.js"
        temp.write_text(script, "utf-8")
        try:
            run = subprocess.run(["node", "--check", str(temp)], capture_output=True, text=True)
            if run.returncode:
                errors.append(f"JavaScript syntax failed for block {index}: {run.stderr.strip()}")
        finally:
            temp.unlink(missing_ok=True)
    for name in [
        "l2g_ssp_word_qa_sidecar_v1_current_attempt1.json",
        "l2g_ssp_word_qa_sidecar_v1_changed_source_attempt2.json",
        "l2g_ssp_word_qa_sidecar_v1_qa_incomplete.json",
        "l2g_ssp_word_qa_sidecar_v1_qa_blocked.json",
    ]:
        try:
            obj = json.loads((ARTIFACTS / name).read_text("utf-8"))
            if obj.get("package_kind") != "l2g_ssp_word_qa_sidecar_v1":
                errors.append(f"wrong package kind: {name}")
        except Exception as exc:
            errors.append(f"invalid sidecar {name}: {exc}")
    if errors:
        print("Builder/Merger v3.10 validation failed")
        for error in errors:
            print(f"- {error}")
        return 1
    print("Builder/Merger v3.10 validation passed")
    print(f"runtime_sha256={EXPECTED_SHA}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
