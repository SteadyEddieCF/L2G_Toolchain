from __future__ import annotations

import hashlib
import json
import re
import subprocess
import tempfile
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "build/CMMC_L2_SSP_v1.8.0/CMMC_L2_SSP_Modern_Editable_v1.8.0.html"
RUNTIME = ROOT / "build/CMMC_L2_SSP_v1.8.1/CMMC_L2_SSP_Modern_Editable_v1.8.1.html"
RESULT = ROOT / "build/CMMC_L2_SSP_v1.8.1/CMMC_L2_SSP_v1.8.1_Static_Regression.json"


class Inspector(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.external_assets: list[tuple[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if values.get("id"):
            self.ids.append(str(values["id"]))
        if tag == "script" and values.get("src"):
            self.external_assets.append(("script", str(values["src"])))
        if tag == "link" and values.get("href"):
            self.external_assets.append(("link", str(values["href"])))


checks: list[dict[str, object]] = []


def record(name: str, passed: bool, detail: object = "") -> None:
    checks.append({"name": name, "passed": bool(passed), "detail": str(detail)})
    if not passed:
        raise AssertionError(f"{name}: {detail}")


text = RUNTIME.read_text(encoding="utf-8")
baseline = BASE.read_text(encoding="utf-8")
inspector = Inspector()
inspector.feed(text)

record("Runtime title identifies v1.8.1", "Modern Editable v1.8.1</title>" in text)
record("Application meta identifies 1.8.1", '<meta content="1.8.1" name="application-version"/>' in text)
record("Application constant identifies 1.8.1", "const APP_VERSION='1.8.1'" in text)
record("Backup schema identifies v1.8.1", "const SCHEMA='cmmc-l2-ssp-modern-v1.8.1'" in text)
record("v1.8.0 backup migration retained", "'cmmc-l2-ssp-modern-v1.8.0'" in text)
record("v1.8.0 image migration retained", "cmmc-l2-ssp-modern-v1.8.0-images" in text)
record("v1.8.0 Word queue migration retained", "cmmc-l2-ssp-modern-v1.8.0-word-review-queue" in text)
record("v1.8.0 rollback namespace recognized", "PREVIOUS_PORTFOLIO_ROLLBACK_KEYS" in text)
record("All 110 controls retained", text.count('<article class="control-card"') == 110, text.count('<article class="control-card"'))
record("All 110 reviewer panels retained", text.count('class="review-panel workspace-guidance no-print"') == 110)
record("No duplicate element identifiers", len(inspector.ids) == len(set(inspector.ids)), len(inspector.ids) - len(set(inspector.ids)))
record("No external script or stylesheet dependency", not inspector.external_assets, inspector.external_assets)
record("No telemetry or analytics integration", not re.search(r"\b(?:gtag|google-analytics|mixpanel|segment\.io|telemetry)\b", text, re.I))
record("Single-System remains explicit default", "Single-System remains the default" in text)
record("Portfolio schema advances to 1.1.0", "PORTFOLIO_SCHEMA_VERSION='1.1.0'" in text)
record("v1.8.0 portfolio schema is migratable", "['1.0.0',PORTFOLIO_SCHEMA_VERSION]" in text)
record("Requirement catalog derives from authoritative controls", "function portfolioRequirementCatalog()" in text and "controls.map" in text)
record("Exactly one requirement default constructor exists", text.count("function portfolioRequirementDefault(") == 1)
record("Missing module requirements are deterministically completed", "function portfolioEnsureRequirementRecords(" in text)
record("Duplicate module requirement pair prevention exists", "Duplicate module requirement record" in text)
record("Orphaned module requirement prevention exists", "references unknown module" in text)
record("All six applicability values are implemented", all(value in text for value in ["pending-decision", "applicable-inherited", "applicable-shared-responsibility", "applicable-locally-implemented", "applicable-inherited-with-local-supplement", "not-applicable"]))
record("Responsibility model values are implemented", all(value in text for value in ["undecided", "organization-led", "module-led", "provider-led"]))
record("Not-applicable rationale is enforced", "Not applicable requires a documented rationale" in text)
record("Declared inheritance requires a source", "requires a source module" in text)
record("Bulk review excludes decisions requiring record-specific support", "Not applicable and inherited applicability are excluded from bulk actions" in text)
record("Unresolved-decision queue exists", 'id="portfolioPendingQueueBtn"' in text)
record("Bulk applicability review exists", 'id="portfolioBulkApplyBtn"' in text)
record("Individual requirement editor exists", 'id="portfolioRequirementEditor"' in text)
record("Module deletion removes requirement records", "portfolioState.moduleRequirements.filter(r=>r.moduleId!==moduleId)" in text)
record("Portfolio export includes requirement counts", "record_counts:{modules:" in text and "moduleRequirements:portfolioState.moduleRequirements.length" in text)
record("Module export includes its 110 decision records", "moduleRequirements:portfolioCloneState(moduleRequirements)" in text)
record("No evidence binaries added to module records", "Stable IDs or references only" in text)
record("Known v1.8.1 boundary is visible", "Known v1.8.1 boundary" in text)
record("Workshop handoff identity remains stable", "const L2G_HANDOFF_KIND='l2g_ssp_handoff_v1'" in text)
record("Workshop return identity remains stable", "L2G_RETURN_KIND='l2g_ssp_return_package_v1'" in text)
record("Word Review format remains stable", "const WORD_REVIEW_FORMAT='cmmc-l2-ssp-word-review-v1'" in text)
record("Protected requirement text remains excluded from handoff mapping", "REQUIREMENT_TEXT_" not in re.search(r"const L2G_CONTROL_FIELDS=\[(.*?)\];", text, re.S).group(1))

model_pattern = re.compile(r'<script id="sspModel" type="application/json">(.*?)</script>', re.S)
base_model = json.loads(model_pattern.search(baseline).group(1))
new_model = json.loads(model_pattern.search(text).group(1))
base_digest = hashlib.sha256(json.dumps(base_model, sort_keys=True, separators=(",", ":")).encode()).hexdigest()
new_digest = hashlib.sha256(json.dumps(new_model, sort_keys=True, separators=(",", ":")).encode()).hexdigest()
record("Authoritative 110-requirement model is semantically unchanged", base_digest == new_digest, new_digest)
record("Embedded model retains 110 controls", new_model.get("controlCount") == 110)

app = text[text.rfind("<script>") + len("<script>") : text.rfind("</script>")]
with tempfile.NamedTemporaryFile("w", suffix=".js", encoding="utf-8") as handle:
    handle.write(app)
    handle.flush()
    proc = subprocess.run(["node", "--check", handle.name], capture_output=True, text=True)
record("Application JavaScript syntax passes", proc.returncode == 0, proc.stderr[:400])
record("Authoritative v1.8.0 baseline hash is correct", hashlib.sha256(BASE.read_bytes()).hexdigest() == "b51cfe17065fd900c6360c3b85c9e4f29600ac8440ff35a5e6b4ba79f719bdff")
record("Runtime contains no local workspace path", "/workspace/" not in text and "C:\\Users\\" not in text)

summary = {
    "release": "v1.8.1",
    "suite": "static-contract-and-applicability-regression",
    "status": "passed",
    "passed": sum(bool(c["passed"]) for c in checks),
    "total": len(checks),
    "baseline_sha256": hashlib.sha256(BASE.read_bytes()).hexdigest(),
    "runtime_sha256": hashlib.sha256(RUNTIME.read_bytes()).hexdigest(),
    "requirement_model_sha256": new_digest,
    "checks": checks,
}
RESULT.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"passed": summary["passed"], "total": summary["total"], "status": summary["status"]}))
