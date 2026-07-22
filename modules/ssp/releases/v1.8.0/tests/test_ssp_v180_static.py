from __future__ import annotations

import hashlib
import json
import re
import subprocess
import tempfile
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "review/ssp_v1.7.1_uploaded/CMMC_L2_SSP_Modern_Editable_v1.7.1.html"
RUNTIME = ROOT / "build/CMMC_L2_SSP_v1.8.0/CMMC_L2_SSP_Modern_Editable_v1.8.0.html"
RESULT = ROOT / "build/CMMC_L2_SSP_v1.8.0/CMMC_L2_SSP_v1.8.0_Static_Regression.json"


class Inspector(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.external_assets: list[tuple[str, str]] = []
        self.scripts_with_src = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if values.get("id"):
            self.ids.append(str(values["id"]))
        if tag == "script" and values.get("src"):
            self.scripts_with_src += 1
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

record("Runtime title identifies v1.8.0", "Modern Editable v1.8.0</title>" in text)
record("Application meta identifies 1.8.0", '<meta content="1.8.0" name="application-version"/>' in text)
record("Application constant identifies 1.8.0", "const APP_VERSION='1.8.0'" in text)
record("Backup schema identifies v1.8.0", "const SCHEMA='cmmc-l2-ssp-modern-v1.8.0'" in text)
record("v1.7.1 backup migration retained", "'cmmc-l2-ssp-modern-v1.7.1'" in text)
record("v1.7.1 image migration retained", "cmmc-l2-ssp-modern-v1.7.1-images" in text)
record("v1.7.1 Word queue migration retained", "cmmc-l2-ssp-modern-v1.7.1-word-review-queue" in text)
record("All 110 controls retained", text.count('<article class="control-card"') == 110, text.count('<article class="control-card"'))
record("All 110 reviewer panels retained", text.count('class="review-panel workspace-guidance no-print"') == 110)
record("No duplicate element identifiers", len(inspector.ids) == len(set(inspector.ids)), len(inspector.ids) - len(set(inspector.ids)))
record("No external script or stylesheet dependency", not inspector.external_assets, inspector.external_assets)
record("No telemetry or analytics integration", not re.search(r"\b(?:gtag|google-analytics|mixpanel|segment\.io|telemetry)\b", text, re.I))
record("Optional portfolio action exists", 'id="portfolioSetupBtn"' in text)
record("Portfolio controls start hidden", '<section hidden id="portfolioModularPanel">' in text)
record("Migration preview exists", 'id="portfolioMigrationPreview"' in text)
record("Pre-conversion rollback storage exists", "PORTFOLIO_ROLLBACK_KEY" in text)
record("Portfolio foundation schema is versioned", "cmmc-l2-ssp-portfolio-foundation-v1" in text and "PORTFOLIO_SCHEMA_VERSION='1.0.0'" in text)
record("Stable portfolio and module identifiers are generated", "portfolioNewId('portfolio')" in text and "portfolioNewId('module')" in text)
record("Circular hierarchy prevention is implemented", "Circular module relationship detected" in text)
record("Orphan hierarchy prevention is implemented", "references a missing parent" in text)
record("Single-system backup includes portfolio foundation", "portfolioFoundation:portfolioCloneState(portfolioState)" in text)
record("Complete foundation package is importable", "input?.package_kind==='cmmc_l2_ssp_portfolio_foundation_v1'" in text)
record("Foundation and module exports include classification warning or limitation", "classification_warning" in text and "foundation metadata only" in text)
record("Module shells do not infer requirement records", "moduleRequirements:[]" in text and "no child module implementation is inferred" in text.lower())
record("Known initial-release boundary is visible", "Known v1.8.0 boundary" in text)
record("Workshop handoff identity remains stable", "const L2G_HANDOFF_KIND='l2g_ssp_handoff_v1'" in text)
record("Workshop return identity remains stable", "L2G_RETURN_KIND='l2g_ssp_return_package_v1'" in text)
record("Word Review format remains stable", "const WORD_REVIEW_FORMAT='cmmc-l2-ssp-word-review-v1'" in text)
record("Protected requirement text remains excluded from handoff mapping", "REQUIREMENT_TEXT_" not in re.search(r"const L2G_CONTROL_FIELDS=\[(.*?)\];", text, re.S).group(1))

model_pattern = re.compile(r'<script id="sspModel" type="application/json">(.*?)</script>', re.S)
base_model = json.loads(model_pattern.search(baseline).group(1))
new_model = json.loads(model_pattern.search(text).group(1))
base_digest = hashlib.sha256(json.dumps(base_model, sort_keys=True, separators=(",", ":")).encode()).hexdigest()
new_digest = hashlib.sha256(json.dumps(new_model, sort_keys=True, separators=(",", ":")).encode()).hexdigest()
record("Authoritative 110-requirement model is byte-semantically unchanged", base_digest == new_digest, new_digest)
record("Embedded model retains 110 controls", new_model.get("controlCount") == 110)

app = text[text.rfind("<script>") + len("<script>") : text.rfind("</script>")]
with tempfile.NamedTemporaryFile("w", suffix=".js", encoding="utf-8") as handle:
    handle.write(app)
    handle.flush()
    proc = subprocess.run(["node", "--check", handle.name], capture_output=True, text=True)
record("Application JavaScript syntax passes", proc.returncode == 0, proc.stderr[:400])

record("Authoritative v1.7.1 baseline hash is correct", hashlib.sha256(BASE.read_bytes()).hexdigest() == "8d1e7bd57808b4af216918bf8f692611f27b41ddf222a99cb47a848aec23a1b3")
record("Runtime contains no local workspace path", "/workspace/" not in text and "C:\\Users\\" not in text)

summary = {
    "release": "v1.8.0",
    "suite": "static-and-contract-regression",
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
