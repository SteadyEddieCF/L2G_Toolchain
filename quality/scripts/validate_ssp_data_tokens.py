#!/usr/bin/env python3
"""Validate generated SSP ``data-token`` attributes before Gitleaks allowlisting.

Historical SSP releases use ``data-token`` as a local, non-secret indexing
attribute. Gitleaks' generic API-key rule flags the whole attribute because the
name contains ``token``. This validator keeps the exception narrow by requiring
all current values to be identifier-shaped, bounded, and free of secret or URL
signatures.
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SSP_RELEASES = ROOT / "modules" / "ssp" / "releases"
ATTRIBUTE_RE = re.compile(r'data-token="([^"]*)"')
IDENTIFIER_RE = re.compile(r"^[A-Z][A-Z0-9_]*(?:[.:-][A-Z0-9_]+)*$")
TEMPLATE_VALUES = {
    "${escapeCss(token)}",
    "REVIEWER_NOTES_${escapeCss(suffix)}",
}
FORBIDDEN_PREFIXES = (
    "AKIA",
    "ASIA",
    "ghp_",
    "gho_",
    "ghu_",
    "ghs_",
    "ghr_",
    "sk-",
    "xoxb-",
    "xoxa-",
    "xoxp-",
    "xoxr-",
    "-----BEGIN",
)
FORBIDDEN_SCHEMES = ("http:", "https:", "data:", "javascript:", "file:", "ftp:")


def main() -> int:
    failures: list[str] = []
    values: set[str] = set()
    files = 0
    attributes = 0

    for path in sorted(SSP_RELEASES.rglob("*.html")):
        files += 1
        text = path.read_text(encoding="utf-8", errors="strict")
        for match in ATTRIBUTE_RE.finditer(text):
            attributes += 1
            value = match.group(1)
            values.add(value)
            relative = path.relative_to(ROOT).as_posix()
            line = text.count("\n", 0, match.start()) + 1
            if not value or len(value) > 160:
                failures.append(f"{relative}:{line}: empty or overlength data-token")
                continue
            lowered = value.casefold()
            if lowered.startswith(FORBIDDEN_SCHEMES):
                failures.append(f"{relative}:{line}: URL-like data-token rejected")
                continue
            if value.startswith(FORBIDDEN_PREFIXES):
                failures.append(f"{relative}:{line}: credential-like data-token prefix rejected")
                continue
            if value not in TEMPLATE_VALUES and not IDENTIFIER_RE.fullmatch(value):
                failures.append(f"{relative}:{line}: invalid data-token identifier shape: {value!r}")

    if files == 0 or attributes == 0:
        failures.append("no SSP release HTML data-token attributes were found")

    if failures:
        print(f"SSP data-token validation failed with {len(failures)} finding(s).")
        for failure in failures[:50]:
            print(f"- {failure}")
        if len(failures) > 50:
            print(f"- ... {len(failures) - 50} additional finding(s) omitted")
        return 1

    print(
        "SSP data-token validation passed: "
        f"{attributes} attributes, {len(values)} unique identifiers, {files} HTML files."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
