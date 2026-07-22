from __future__ import annotations

import hashlib
import json
import re
import subprocess
import tempfile
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "build/CMMC_L2_SSP_v1.8.2/CMMC_L2_SSP_Modern_Editable_v1.8.2.html"
RUNTIME = ROOT / "build/CMMC_L2_SSP_v1.8.3/CMMC_L2_SSP_Modern_Editable_v1.8.3.html"
RESULT = ROOT / "build/CMMC_L2_SSP_v1.8.3/CMMC_L2_SSP_v1.8.3_Static_Regression.json"


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

record("Runtime title identifies v1.8.3", "Modern Editable v1.8.3</title>" in text)
record("Application meta identifies 1.8.3", '<meta content="1.8.3" name="application-version"/>' in text)
record("Application constant identifies 1.8.3", "const APP_VERSION='1.8.3'" in text)
record("Backup schema identifies v1.8.3", "const SCHEMA='cmmc-l2-ssp-modern-v1.8.3'" in text)
record("v1.8.2 backup migration retained", "'cmmc-l2-ssp-modern-v1.8.2'" in text)
record("v1.8.2 image migration retained", "cmmc-l2-ssp-modern-v1.8.2-images" in text)
record("v1.8.2 Word queue migration retained", "cmmc-l2-ssp-modern-v1.8.2-word-review-queue" in text)
record("v1.8.2 rollback namespace recognized", "cmmc-l2-ssp-modern-v1.8.2-portfolio-rollback" in text)
record("All 110 controls retained", text.count('<article class="control-card"') == 110, text.count('<article class="control-card"'))
record("All 110 reviewer panels retained", text.count('class="review-panel workspace-guidance no-print"') == 110)
record("No duplicate element identifiers", len(inspector.ids) == len(set(inspector.ids)), len(inspector.ids) - len(set(inspector.ids)))
record("No external script or stylesheet dependency", not inspector.external_assets, inspector.external_assets)
record("No telemetry or analytics integration", not re.search(r"\b(?:gtag|google-analytics|mixpanel|segment\.io|telemetry)\b", text, re.I))
record("Single-System remains explicit default", "Single-System remains the default" in text)
record("Portfolio schema advances to 1.3.0", "PORTFOLIO_SCHEMA_VERSION='1.3.0'" in text)
record("v1.8.2 portfolio schema is migratable", "['1.0.0','1.1.0','1.2.0',PORTFOLIO_SCHEMA_VERSION]" in text)
record("Impact review center exists", all(token in text for token in ['id="portfolioImpactCenter"', 'id="portfolioImpactGroups"', 'id="portfolioImpactDetail"']))
record("Stale impacts group by source", "function portfolioImpactQueue(" in text and "sourceModuleId" in text)
record("Field-level before and after diff exists", "function portfolioImpactDiff(" in text and "Child snapshot" in text and "Current source" in text)
record("Explicit four-decision workflow exists", all(token in text for token in ['data-impact-decision="refresh"', 'data-impact-decision="preserve"', 'data-impact-decision="defer"', 'data-impact-decision="escalate"']))
record("Impact decisions are rationale governed", "requires a decision rationale" in text)
record("Refresh clears override explicitly", "overrideState:'none',overrideRationale:'',overrideFields:[]" in text)
record("Conflict escalation creates open records", "conflictType:'parent-change-local-override'" in text and "status:'open'" in text)
record("Impact decisions enter change history", "changeType:`parent-change-${decision}`" in text)
record("New source changes reopen reviewed impacts", "record.impactSourceFingerprint!==impact.sourceFingerprint" in text)
record("No silent parent propagation guardrail present", "No source value propagates without an explicit refresh" in text)
record("Portfolio export advances to 1.3", "package_version:'1.3'" in text)
record("Impact and open-conflict counts export", all(token in text for token in ["pendingImpacts:", "deferredImpacts:", "preservedImpacts:", "escalatedImpacts:", "openConflicts:"]))
record("Module export includes related conflicts", "conflicts=portfolioState.conflicts.filter" in text)
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
record("Authoritative v1.8.2 baseline hash is correct", hashlib.sha256(BASE.read_bytes()).hexdigest() == "d43294c9121aa968bed5ec983c174b2cc5edfbea7b695f9d323707ae95419d19")
record("Runtime contains no local workspace path", "/workspace/" not in text and "C:\\Users\\" not in text)

summary = {
    "release": "v1.8.3",
    "suite": "static-contract-impact-review-regression",
    "status": "passed",
    "passed": sum(bool(check["passed"]) for check in checks),
    "total": len(checks),
    "baseline_sha256": hashlib.sha256(BASE.read_bytes()).hexdigest(),
    "runtime_sha256": hashlib.sha256(RUNTIME.read_bytes()).hexdigest(),
    "requirement_model_sha256": new_digest,
    "checks": checks,
}
RESULT.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"passed": summary["passed"], "total": summary["total"], "status": summary["status"]}))
