from __future__ import annotations

import re
from pathlib import Path

original = Path(__file__).with_name("build.py")
source = original.read_text(encoding="utf-8")
replacement = '''schema_files = sorted((BASE / "releases" / "v0.5.0").glob("*.schema.json")) + [
    ROOT / "schemas" / "l2g_scope_v1.schema.json",
    ROOT / "schemas" / "l2g_scope_projection_v1.schema.json",
]
for schema in schema_files:'''
source, count = re.subn(r"schema_files = \[.*?\]\nfor schema in schema_files:", replacement, source, count=1, flags=re.S)
if count != 1:
    raise SystemExit("Unable to patch the v0.6 schema inheritance block.")
namespace = {"__file__": str(original), "__name__": "__main__"}
exec(compile(source, str(original), "exec"), namespace)
