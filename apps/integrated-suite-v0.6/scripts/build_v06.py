from __future__ import annotations

import re
from pathlib import Path

original = Path(__file__).with_name("build.py")
source = original.read_text(encoding="utf-8")

schema_replacement = '''schema_files = sorted((BASE / "releases" / "v0.5.0").glob("*.schema.json")) + [
    ROOT / "schemas" / "l2g_scope_v1.schema.json",
    ROOT / "schemas" / "l2g_scope_projection_v1.schema.json",
]
for schema in schema_files:'''
source, schema_count = re.subn(
    r"schema_files = \[.*?\]\nfor schema in schema_files:",
    schema_replacement,
    source,
    count=1,
    flags=re.S,
)
if schema_count != 1:
    raise SystemExit("Unable to patch the v0.6 schema inheritance block.")

style_needle = '''    (ROOT / "src" / "scope.css").read_text(encoding="utf-8").strip(),
])'''
style_replacement = '''    (ROOT / "src" / "scope.css").read_text(encoding="utf-8").strip(),
    (ROOT / "src" / "scope-v061.css").read_text(encoding="utf-8").strip(),
])'''
if style_needle not in source:
    raise SystemExit("Unable to locate the v0.6 style bundle boundary.")
source = source.replace(style_needle, style_replacement, 1)

compile_needle = 'compile_typescript()\nscript = (BUILD / "app.js").read_text(encoding="utf-8").strip()'
compile_replacement = """compile_typescript()
compiled_path = BUILD / "app.js"
compiled = compiled_path.read_text(encoding="utf-8")
legacy_pre_interview = compiled.count("Pre-Engagement & Interviews")
legacy_evidence_core = compiled.count("Evidence Catalog Core")
if legacy_pre_interview < 1 or legacy_evidence_core < 1:
    raise SystemExit("Unable to reconcile inherited release labels for the v0.6 shell.")
compiled = compiled.replace("Pre-Engagement & Interviews", "Scope Vertical Slice")
compiled = compiled.replace("Evidence Catalog Core", "Scope Vertical Slice")
observer_needle = '''        const badge = document.querySelector(".release-badge");
        if (badge)
            badge.textContent = `v${window.__L2G_RELEASE__.version} · Scope Vertical Slice`;'''
observer_replacement = '''        const badge = document.querySelector(".release-badge");
        const desiredBadge = `v${window.__L2G_RELEASE__.version} · Scope Vertical Slice`;
        if (badge && badge.textContent !== desiredBadge)
            badge.textContent = desiredBadge;'''
if compiled.count(observer_needle) != 1:
    raise SystemExit("Unable to apply the idempotent v0.6 shell-observer patch.")
compiled = compiled.replace(observer_needle, observer_replacement, 1)
compiled_path.write_text(compiled, encoding="utf-8", newline="\\n")
script = compiled.strip()"""
if compile_needle not in source:
    raise SystemExit("Unable to locate the v0.6 TypeScript compilation boundary.")
source = source.replace(compile_needle, compile_replacement, 1)

namespace = {"__file__": str(original), "__name__": "__main__"}
exec(compile(source, str(original), "exec"), namespace)
