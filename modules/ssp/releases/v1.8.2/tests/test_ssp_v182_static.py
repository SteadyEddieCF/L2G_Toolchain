from __future__ import annotations

import hashlib
import json
import re
import subprocess
import tempfile
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "build/CMMC_L2_SSP_v1.8.1/CMMC_L2_SSP_Modern_Editable_v1.8.1.html"
RUNTIME = ROOT / "build/CMMC_L2_SSP_v1.8.2/CMMC_L2_SSP_Modern_Editable_v1.8.2.html"
RESULT = ROOT / "build/CMMC_L2_SSP_v1.8.2/CMMC_L2_SSP_v1.8.2_Static_Regression.json"


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

record("Runtime title identifies v1.8.2", "Modern Editable v1.8.2</title>" in text)
record("Application meta identifies 1.8.2", '<meta content="1.8.2" name="application-version"/>' in text)
record("Application constant identifies 1.8.2", "const APP_VERSION='1.8.2'" in text)
record("Backup schema identifies v1.8.2", "const SCHEMA='cmmc-l2-ssp-modern-v1.8.2'" in text)
record("v1.8.1 backup migration retained", "'cmmc-l2-ssp-modern-v1.8.1'" in text)
record("v1.8.1 image migration retained", "cmmc-l2-ssp-modern-v1.8.1-images" in text)
record("v1.8.1 Word queue migration retained", "cmmc-l2-ssp-modern-v1.8.1-word-review-queue" in text)
record("v1.8.1 rollback namespace recognized", "cmmc-l2-ssp-modern-v1.8.1-portfolio-rollback" in text)
record("All 110 controls retained", text.count('<article class="control-card"') == 110, text.count('<article class="control-card"'))
record("All 110 reviewer panels retained", text.count('class="review-panel workspace-guidance no-print"') == 110)
record("No duplicate element identifiers", len(inspector.ids) == len(set(inspector.ids)), len(inspector.ids) - len(set(inspector.ids)))
record("No external script or stylesheet dependency", not inspector.external_assets, inspector.external_assets)
record("No telemetry or analytics integration", not re.search(r"\b(?:gtag|google-analytics|mixpanel|segment\.io|telemetry)\b", text, re.I))
record("Single-System remains explicit default", "Single-System remains the default" in text)
record("Portfolio schema advances to 1.2.0", "PORTFOLIO_SCHEMA_VERSION='1.2.0'" in text)
record("v1.8.1 portfolio schema is migratable", "['1.0.0','1.1.0',PORTFOLIO_SCHEMA_VERSION]" in text)
record("Deterministic canonical fingerprint exists", "function portfolioFingerprint(" in text and "fnv1a64-canonical-v1" in text)
record("Fingerprint uses a fixed canonical payload", "function portfolioInheritancePayload(" in text)
record("Only ancestors and active shared services are eligible", "function portfolioSourceEligible(" in text and "source.moduleType==='shared-service'" in text)
record("Same-requirement source resolution exists", "function portfolioSourceRecord(" in text and "candidate.requirementId===record.requirementId" in text)
record("Inheritance graph validation exists", "function portfolioValidateInheritance(" in text)
record("Circular inheritance rejection exists", "Circular requirement inheritance detected" in text)
record("Stale-parent detection exists", "portfolioInheritanceStatusFor" in text and "?'current':'stale'" in text)
record("Source changes never silently overwrite", "they never overwrite local work silently" in text)
record("Deterministic inherited field allowlist exists", "function portfolioApplyInheritance(" in text)
record("Local supplement fields exist", all(token in text for token in ["supplementNarrative", "supplementOwnerIds", "supplementEvidenceIds"]))
record("Governed local override fields exist", all(token in text for token in ["local-override", "overrideRationale", "overrideFields"]))
record("Override rationale is mandatory", "governed local override requires a rationale" in text)
record("Stale filter and statistics exist", 'id="portfolioRequirementInheritanceFilter"' in text and 'id="portfolioRequirementStale"' in text)
record("Module deletion protects inheritance sources", "Reassign ${inheritedRefs.length} inherited requirement source" in text)
record("Portfolio export includes stale and override counts", "staleInheritance:" in text and "localOverrides:" in text)
record("Portfolio package advances to 1.2", "package_version:'1.2'" in text)
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
record("Authoritative v1.8.1 baseline hash is correct", hashlib.sha256(BASE.read_bytes()).hexdigest() == "f1142a23378780afc544348b84ad62cd965fe1fe353f0c3d6f6adfb3318fb640")
record("Runtime contains no local workspace path", "/workspace/" not in text and "C:\\Users\\" not in text)

summary = {
    "release": "v1.8.2",
    "suite": "static-contract-inheritance-regression",
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
