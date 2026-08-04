from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def replace_once(path: Path, old: str, new: str) -> None:
    text = path.read_text(encoding="utf-8")
    if new in text:
        return
    if old not in text:
        raise SystemExit(f"Expected repair target not found in {path}")
    path.write_text(text.replace(old, new, 1), encoding="utf-8", newline="\n")


replace_once(
    ROOT / "src" / "project.ts",
    'const reviews = isRecord(stateRaw.reviews_actions) ? stateRaw.reviews_actions as unknown as ReviewsActionsRecord : { schema_version: "reviews_actions_v1", examples: [] };',
    'const reviews: ReviewsActionsRecord = isRecord(stateRaw.reviews_actions) ? stateRaw.reviews_actions as unknown as ReviewsActionsRecord : { schema_version: "reviews_actions_v1", examples: [] };',
)

app = ROOT / "src" / "app.ts"
text = app.read_text(encoding="utf-8")
if 'function promptValue(values:Record<string,string>,name:string):string{return values[name]??"";}' not in text:
    for name in ["confirm", "detail", "label", "passphrase", "rationale", "supersede", "target", "title", "type"]:
        text = text.replace(f"values.{name}", f'promptValue(values,"{name}")')
    marker = 'interface PromptField {name:string;label:string;type?:"text"|"password"|"textarea";value?:string}\n'
    if marker not in text:
        raise SystemExit("Prompt-field marker not found")
    text = text.replace(marker, marker + '  function promptValue(values:Record<string,string>,name:string):string{return values[name]??"";}\n', 1)
    app.write_text(text, encoding="utf-8", newline="\n")

replace_once(
    ROOT / "src" / "evidence.ts",
    '    const cleanRationale = sanitizePlainText(rationale, 8000); if (!cleanRationale.trim()) throw new Error("Revision rationale is required.");\n    const timestamp = nowIso();',
    '    const cleanRationale = sanitizePlainText(rationale, 8000); if (!cleanRationale.trim()) throw new Error("Revision rationale is required.");\n    if (supersede && prior.duplicate_group_ref) {\n      const group = domain.duplicate_groups.find(item => item.duplicate_group_id === prior.duplicate_group_ref);\n      const member = group?.members.find(item => item.source_ref === prior.evidence_id);\n      const otherActive = group?.members.some(item => item.source_ref !== prior.evidence_id && item.disposition !== "excluded" && domain.sources.some(source => source.evidence_id === item.source_ref && source.lifecycle === "active"));\n      if (group?.state === "resolved" && member?.disposition === "primary" && otherActive) throw new Error("Select and review a replacement duplicate-group primary before superseding this source.");\n    }\n    const timestamp = nowIso();',
)

replace_once(
    ROOT / "src" / "evidence.ts",
    '        origin_kind: "legacy-package-record", media_type: firstText(raw, ["media_type","mime_type","type"]) || "application/octet-stream", extension: (/\\.[A-Za-z0-9]{1,16}$/.exec(name)?.[0] ?? "").toLowerCase(),',
    '        origin_kind: validDigest ? "legacy-package-record" : "external-reference", media_type: firstText(raw, ["media_type","mime_type","type"]) || "application/octet-stream", extension: (/\\.[A-Za-z0-9]{1,16}$/.exec(name)?.[0] ?? "").toLowerCase(),',
)

replace_once(
    ROOT / "tsconfig.json",
    '"noUncheckedIndexedAccess": false',
    '"noUncheckedIndexedAccess": true',
)

print("Applied exact v0.4 source repairs.")
