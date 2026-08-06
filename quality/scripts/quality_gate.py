#!/usr/bin/env python3
"""Repository-controlled quality and security baseline for the L2G Toolchain.

The script intentionally uses the Python standard library so the policy/orchestration
layer is runnable on a clean checkout. Hypothesis is used separately for bounded
property tests.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
from dataclasses import asdict, dataclass
from html.parser import HTMLParser
from pathlib import Path
from typing import Any, Iterable

ROOT = Path(__file__).resolve().parents[2]
REPORT_DIR = ROOT / "quality-reports"
BASELINE_PATH = ROOT / "quality" / "baseline.json"

TEXT_SUFFIXES = {
    ".c", ".cc", ".conf", ".cpp", ".css", ".csv", ".html", ".ini", ".js", ".json",
    ".jsx", ".md", ".mjs", ".py", ".sh", ".toml", ".ts", ".tsx", ".txt", ".xml",
    ".yaml", ".yml",
}
IGNORED_DIRS = {".git", "node_modules", "dist", "test-results", "playwright-report", "quality-reports"}
PINNED_ACTION_RE = re.compile(r"^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+(?:/[A-Za-z0-9_.-]+)*@[0-9a-f]{40}(?:\s*#.*)?$")
REMOTE_ASSET_RE = re.compile(
    r"<(?:script|link|img|iframe|audio|video|source)[^>]+(?:src|href)\s*=\s*['\"]https?://",
    re.IGNORECASE,
)
NETWORK_API_RE = re.compile(
    r"\b(?:fetch\s*\(|XMLHttpRequest\s*\(|new\s+WebSocket\s*\(|new\s+EventSource\s*\(|sendBeacon\s*\()",
    re.IGNORECASE,
)
TELEMETRY_RE = re.compile(
    r"\b(?:google-analytics|googletagmanager|segment\.io|sentry\.io|mixpanel|amplitude|hotjar|fullstory)\b",
    re.IGNORECASE,
)
SECRET_PATTERNS = {
    "private-key": re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----"),
    "aws-access-key": re.compile(r"\b(?:AKIA|ASIA)[0-9A-Z]{16}\b"),
    "github-token": re.compile(r"\bgh[pousr]_[A-Za-z0-9_]{30,255}\b"),
    "openai-key": re.compile(r"\bsk-(?:proj-)?[A-Za-z0-9_-]{24,}\b"),
    "slack-token": re.compile(r"\bxox[baprs]-[A-Za-z0-9-]{20,}\b"),
    "ssn": re.compile(r"(?<!\d)(?!000|666|9\d\d)\d{3}-(?!00)\d{2}-(?!0000)\d{4}(?!\d)"),
}
SYNTHETIC_SECRET_ALLOWLIST = {
    "ghp_SYNTHETIC_NOT_A_SECRET_000000000000000000",
    "sk-SYNTHETIC-NOT-A-SECRET-000000000000",
}


@dataclass(frozen=True)
class Finding:
    severity: str
    code: str
    path: str
    detail: str


@dataclass
class GateResult:
    gate: str
    findings: list[Finding]
    metadata: dict[str, Any]

    @property
    def blocking(self) -> list[Finding]:
        return [finding for finding in self.findings if finding.severity == "blocking"]

    def to_dict(self) -> dict[str, Any]:
        return {
            "gate": self.gate,
            "status": "fail" if self.blocking else "pass",
            "blocking_count": len(self.blocking),
            "advisory_count": len(self.findings) - len(self.blocking),
            "findings": [asdict(finding) for finding in self.findings],
            "metadata": self.metadata,
        }


class SemanticHTMLParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: dict[str, int] = {}
        self.labels_for: list[str] = []
        self.controls: list[tuple[str, dict[str, str]]] = []
        self.landmarks: dict[str, int] = {"main": 0, "nav": 0}
        self.dialogs: list[dict[str, str]] = []
        self.aria_references: list[tuple[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = {key.casefold(): (value or "") for key, value in attrs}
        identifier = attributes.get("id")
        if identifier:
            self.ids[identifier] = self.ids.get(identifier, 0) + 1
        if tag == "label" and attributes.get("for"):
            self.labels_for.append(attributes["for"])
        if tag in {"input", "select", "textarea", "button"}:
            self.controls.append((tag, attributes))
        role = attributes.get("role", "").casefold()
        if tag == "main" or role == "main":
            self.landmarks["main"] += 1
        if tag == "nav" or role == "navigation":
            self.landmarks["nav"] += 1
        if tag == "dialog" or role in {"dialog", "alertdialog"}:
            self.dialogs.append(attributes)
        for attr in ("aria-labelledby", "aria-describedby", "aria-controls", "aria-owns"):
            if attributes.get(attr):
                for value in attributes[attr].split():
                    self.aria_references.append((attr, value))


def _relative(path: Path) -> str:
    try:
        return path.relative_to(ROOT).as_posix()
    except ValueError:
        return path.as_posix()


def _iter_text_files(paths: Iterable[Path]) -> Iterable[Path]:
    for start in paths:
        if start.is_file() and start.suffix.casefold() in TEXT_SUFFIXES:
            yield start
            continue
        if not start.exists():
            continue
        for path in start.rglob("*"):
            if not path.is_file() or path.suffix.casefold() not in TEXT_SUFFIXES:
                continue
            if any(part in IGNORED_DIRS for part in path.parts):
                continue
            if path.stat().st_size > 5 * 1024 * 1024:
                continue
            yield path


def _read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="strict")


def _write_report(result: GateResult) -> None:
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    path = REPORT_DIR / f"{result.gate}.json"
    path.write_text(json.dumps(result.to_dict(), indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps(result.to_dict(), sort_keys=True))


def _load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def validate_baseline() -> GateResult:
    findings: list[Finding] = []
    required_top = {"kind", "version", "blocking", "advisory", "current_scope", "residual_manual_checks"}
    try:
        baseline = _load_json(BASELINE_PATH)
    except Exception as exc:
        return GateResult("baseline", [Finding("blocking", "baseline-invalid", _relative(BASELINE_PATH), str(exc))], {})
    missing = sorted(required_top - set(baseline))
    if missing:
        findings.append(Finding("blocking", "baseline-required-fields", _relative(BASELINE_PATH), f"missing: {', '.join(missing)}"))
    if baseline.get("kind") != "l2g_repository_quality_baseline_v1" or baseline.get("version") != "1.0":
        findings.append(Finding("blocking", "baseline-identity", _relative(BASELINE_PATH), "unexpected baseline kind/version"))
    for classification in ("blocking", "advisory"):
        values = baseline.get(classification, [])
        if not isinstance(values, list) or not values or len(values) != len(set(values)):
            findings.append(Finding("blocking", "baseline-classification", _relative(BASELINE_PATH), f"{classification} must be a non-empty unique list"))
    return GateResult("baseline", findings, {"blocking": baseline.get("blocking", []), "advisory": baseline.get("advisory", [])})


def contracts_gate() -> GateResult:
    findings: list[Finding] = []
    pointer_path = ROOT / "apps" / "integrated-suite" / "current_release.json"
    registry_path = ROOT / "contracts" / "registry.json"
    pointer = _load_json(pointer_path)
    registry = _load_json(registry_path)
    if pointer.get("kind") != "l2g_integrated_suite_current_release_v1" or pointer.get("status") != "current":
        findings.append(Finding("blocking", "current-release-pointer", _relative(pointer_path), "current pointer identity/status is invalid"))
    version = str(pointer.get("version", ""))
    source_dir = ROOT / f"apps/integrated-suite-v{version.rsplit('.', 1)[0]}"
    if version == "0.6.0":
        source_dir = ROOT / "apps" / "integrated-suite-v0.6"
    if not source_dir.is_dir():
        findings.append(Finding("blocking", "current-release-source", _relative(source_dir), f"source tree missing for {version}"))
    schema_pairs = [
        ("engagement_schema_kind", "engagement_schema_version"),
        ("evidence_schema_kind", "evidence_schema_version"),
        ("pre_engagement_schema_kind", "pre_engagement_schema_version"),
        ("interview_schema_kind", "interview_schema_version"),
        ("scope_schema_kind", "scope_schema_version"),
    ]
    projection_pairs = [
        ("evidence_projection_kind", "evidence_projection_version"),
        ("pre_engagement_projection_kind", "pre_engagement_projection_version"),
        ("interview_projection_kind", "interview_projection_version"),
        ("scope_projection_kind", "scope_projection_version"),
    ]
    available_schema_text = ""
    schema_dirs = sorted(path for path in (ROOT / "apps").glob("integrated-suite-v*/schemas") if path.is_dir())
    foundation_schema_dir = ROOT / "apps" / "integrated-suite" / "schemas"
    if foundation_schema_dir.is_dir():
        schema_dirs.append(foundation_schema_dir)
    schema_files: list[Path] = []
    for schema_dir in schema_dirs:
        for schema_path in sorted(schema_dir.glob("*.json")):
            schema_files.append(schema_path)
            try:
                content = _load_json(schema_path)
                available_schema_text += json.dumps(content, sort_keys=True)
            except Exception as exc:
                findings.append(Finding("blocking", "schema-json", _relative(schema_path), str(exc)))
    for kind_key, version_key in schema_pairs:
        kind = pointer.get(kind_key)
        schema_version = pointer.get(version_key)
        if kind and kind not in available_schema_text:
            findings.append(Finding("blocking", "schema-kind-missing", "apps/integrated-suite*/schemas", f"{kind}@{schema_version} not found in governed schemas"))
    governed_projection_text = available_schema_text
    promoted_artifact = ROOT / str(pointer.get("artifact", ""))
    if not promoted_artifact.is_file():
        findings.append(Finding("blocking", "current-release-artifact", _relative(promoted_artifact), "promoted current artifact is missing"))
    else:
        governed_projection_text += _read_text(promoted_artifact)
    for metadata_path in sorted(source_dir.rglob("*.json")) if source_dir.is_dir() else []:
        if any(part in IGNORED_DIRS for part in metadata_path.parts):
            continue
        try:
            governed_projection_text += _read_text(metadata_path)
        except (UnicodeDecodeError, OSError):
            continue
    for kind_key, version_key in projection_pairs:
        kind = pointer.get(kind_key)
        projection_version = pointer.get(version_key)
        if kind and kind not in governed_projection_text:
            findings.append(Finding("blocking", "projection-kind-missing", _relative(promoted_artifact), f"{kind}@{projection_version} not found in governed current source/artifact"))
    contracts = registry.get("contracts")
    if not isinstance(contracts, list) or not contracts:
        findings.append(Finding("blocking", "contract-registry-empty", _relative(registry_path), "contracts must be a non-empty list"))
        contracts = []
    seen: set[tuple[str, str]] = set()
    for index, contract in enumerate(contracts):
        identity = (str(contract.get("package_kind", "")), str(contract.get("version", "")))
        if not all(identity) or not contract.get("producer") or not isinstance(contract.get("consumers"), list):
            findings.append(Finding("blocking", "contract-shape", _relative(registry_path), f"contract index {index} is incomplete"))
        if identity in seen:
            findings.append(Finding("blocking", "contract-duplicate", _relative(registry_path), f"duplicate {identity[0]}@{identity[1]}"))
        seen.add(identity)
    return GateResult(
        "contracts",
        findings,
        {"current_version": version, "schema_count": len(schema_files), "contract_count": len(contracts)},
    )


def offline_gate(artifact: Path) -> GateResult:
    findings: list[Finding] = []
    if not artifact.is_file():
        return GateResult("offline", [Finding("blocking", "artifact-missing", _relative(artifact), "build the current release before offline validation")], {})
    html = _read_text(artifact)
    if "default-src 'none'" not in html or "connect-src 'none'" not in html:
        findings.append(Finding("blocking", "csp", _relative(artifact), "default-src and connect-src must both be 'none'"))
    for match in REMOTE_ASSET_RE.finditer(html):
        findings.append(Finding("blocking", "remote-runtime-asset", _relative(artifact), match.group(0)[:240]))
    for match in NETWORK_API_RE.finditer(html):
        context = html[max(0, match.start() - 80): match.end() + 120].replace("\n", " ")
        findings.append(Finding("advisory", "network-api-token", _relative(artifact), context[:300]))
    for match in TELEMETRY_RE.finditer(html):
        findings.append(Finding("blocking", "telemetry", _relative(artifact), match.group(0)))
    active_external = re.findall(r"<(?:a|form)[^>]+(?:href|action)=['\"](https?://[^'\"]+)", html, re.IGNORECASE)
    for url in active_external:
        findings.append(Finding("advisory", "user-initiated-external-link", _relative(artifact), url[:240]))
    return GateResult(
        "offline",
        findings,
        {"artifact": _relative(artifact), "sha256": hashlib.sha256(artifact.read_bytes()).hexdigest(), "bytes": artifact.stat().st_size},
    )


def html_gate(artifact: Path) -> GateResult:
    findings: list[Finding] = []
    if not artifact.is_file():
        return GateResult("html", [Finding("blocking", "artifact-missing", _relative(artifact), "build the current release before HTML validation")], {})
    parser = SemanticHTMLParser()
    try:
        parser.feed(_read_text(artifact))
        parser.close()
    except Exception as exc:
        findings.append(Finding("blocking", "html-parse", _relative(artifact), str(exc)))
    for identifier, count in sorted(parser.ids.items()):
        if count > 1:
            findings.append(Finding("blocking", "duplicate-id", _relative(artifact), f"{identifier}: {count}"))
    known_ids = set(parser.ids)
    for target in parser.labels_for:
        if target not in known_ids:
            findings.append(Finding("blocking", "label-target", _relative(artifact), f"label for missing id: {target}"))
    for attr, target in parser.aria_references:
        if target not in known_ids:
            findings.append(Finding("blocking", "aria-reference", _relative(artifact), f"{attr} references missing id: {target}"))
    for tag, attributes in parser.controls:
        control_type = attributes.get("type", "").casefold()
        if tag == "input" and control_type in {"hidden", "submit", "button", "reset", "image"}:
            continue
        identifier = attributes.get("id")
        has_name = bool(attributes.get("aria-label") or attributes.get("aria-labelledby") or attributes.get("title"))
        has_label = bool(identifier and identifier in parser.labels_for)
        if not has_name and not has_label and tag != "button":
            findings.append(Finding("advisory", "control-name", _relative(artifact), f"{tag} lacks a static accessible name: id={identifier or '<none>'}"))
    if parser.landmarks["main"] == 0:
        findings.append(Finding("advisory", "main-landmark", _relative(artifact), "no static main landmark found"))
    if parser.landmarks["main"] > 1:
        findings.append(Finding("advisory", "main-landmark", _relative(artifact), f"{parser.landmarks['main']} static main landmarks found"))
    for dialog in parser.dialogs:
        if not dialog.get("aria-label") and not dialog.get("aria-labelledby"):
            findings.append(Finding("advisory", "dialog-name", _relative(artifact), f"dialog lacks accessible name: id={dialog.get('id', '<none>')}"))
    return GateResult(
        "html",
        findings,
        {"ids": len(parser.ids), "controls": len(parser.controls), "labels": len(parser.labels_for), "dialogs": len(parser.dialogs), "landmarks": parser.landmarks},
    )


def privacy_gate() -> GateResult:
    findings: list[Finding] = []
    scan_roots = [ROOT / "fixtures", ROOT / "quality", ROOT / "tests", ROOT / "apps", ROOT / "modules"]
    scanned = 0
    for path in _iter_text_files(scan_roots):
        scanned += 1
        try:
            text = _read_text(path)
        except UnicodeDecodeError as exc:
            findings.append(Finding("blocking", "invalid-utf8", _relative(path), str(exc)))
            continue
        for label, pattern in SECRET_PATTERNS.items():
            for match in pattern.finditer(text):
                token = match.group(0)
                if token in SYNTHETIC_SECRET_ALLOWLIST:
                    continue
                findings.append(Finding("blocking", label, _relative(path), f"match at character {match.start()}"))
        if path.is_relative_to(ROOT / "fixtures"):
            lowered = text.casefold()
            if path.suffix.casefold() in {".json", ".md", ".txt", ".csv"} and not any(marker in lowered for marker in ("synthetic", "mcfirecoal", "example", "adversarial")):
                findings.append(Finding("advisory", "fixture-synthetic-marker", _relative(path), "fixture text has no explicit synthetic/example/adversarial marker"))
    return GateResult("privacy", findings, {"text_files_scanned": scanned, "roots": [_relative(path) for path in scan_roots]})


def workflow_gate() -> GateResult:
    findings: list[Finding] = []
    workflow_dir = ROOT / ".github" / "workflows"
    workflows = sorted([*workflow_dir.glob("*.yml"), *workflow_dir.glob("*.yaml")])
    for path in workflows:
        text = _read_text(path)
        lines = text.splitlines()
        if re.search(r"(?m)^\s*pull_request_target\s*:", text):
            findings.append(Finding("blocking", "pull-request-target", _relative(path), "pull_request_target is prohibited without a separately reviewed exception"))
        if re.search(r"(?m)^\s*permissions\s*:\s*write-all\s*$", text):
            findings.append(Finding("blocking", "write-all", _relative(path), "write-all permissions are prohibited"))
        for number, line in enumerate(lines, start=1):
            stripped = line.strip()
            if stripped.startswith("uses:") or stripped.startswith("- uses:"):
                value = stripped.split("uses:", 1)[1].strip()
                if value.startswith("./") or value.startswith("docker://"):
                    continue
                if not PINNED_ACTION_RE.match(value):
                    findings.append(Finding("advisory", "unpinned-action", _relative(path), f"line {number}: {value}"))
            if "run:" in line and "${{ github.event." in line:
                findings.append(Finding("blocking", "unsafe-interpolation", _relative(path), f"line {number}: event data interpolated directly into shell"))
        if "persist-credentials: true" in text:
            findings.append(Finding("advisory", "checkout-credentials", _relative(path), "checkout persists credentials explicitly"))
    return GateResult("workflows", findings, {"workflow_count": len(workflows)})


def package_gate(dist: Path) -> GateResult:
    findings: list[Finding] = []
    required = ["release-manifest.json", "sbom.spdx.json", "SHA256SUMS.txt", "RELEASE_NOTES.md"]
    for name in required:
        if not (dist / name).is_file():
            findings.append(Finding("blocking", "release-file-missing", _relative(dist / name), "required release artifact missing"))
    manifest_path = dist / "release-manifest.json"
    manifest: dict[str, Any] = {}
    if manifest_path.is_file():
        try:
            manifest = _load_json(manifest_path)
        except Exception as exc:
            findings.append(Finding("blocking", "manifest-json", _relative(manifest_path), str(exc)))
    artifact_name = manifest.get("artifact_name") or manifest.get("artifact")
    if artifact_name:
        artifact = dist / str(artifact_name)
        if not artifact.is_file():
            findings.append(Finding("blocking", "manifest-artifact", _relative(artifact), "manifest artifact missing"))
        else:
            digest = hashlib.sha256(artifact.read_bytes()).hexdigest()
            if manifest.get("sha256") != digest:
                findings.append(Finding("blocking", "manifest-sha256", _relative(artifact), "manifest SHA-256 mismatch"))
    sbom_path = dist / "sbom.spdx.json"
    if sbom_path.is_file():
        try:
            sbom = _load_json(sbom_path)
            if sbom.get("spdxVersion") != "SPDX-2.3" or not isinstance(sbom.get("packages"), list):
                findings.append(Finding("blocking", "sbom-shape", _relative(sbom_path), "SBOM must be SPDX 2.3 with a packages array"))
        except Exception as exc:
            findings.append(Finding("blocking", "sbom-json", _relative(sbom_path), str(exc)))
    sums_path = dist / "SHA256SUMS.txt"
    if sums_path.is_file():
        for number, line in enumerate(_read_text(sums_path).splitlines(), start=1):
            if not line.strip():
                continue
            match = re.fullmatch(r"([0-9a-f]{64})\s+\*?(.+)", line.strip())
            if not match:
                findings.append(Finding("blocking", "checksum-format", _relative(sums_path), f"line {number}"))
                continue
            expected, filename = match.groups()
            target = dist / filename
            if not target.is_file():
                findings.append(Finding("blocking", "checksum-target", _relative(target), f"referenced on line {number}"))
            elif hashlib.sha256(target.read_bytes()).hexdigest() != expected:
                findings.append(Finding("blocking", "checksum-mismatch", _relative(target), f"line {number}"))
    return GateResult("package", findings, {"dist": _relative(dist), "files": sorted(path.name for path in dist.iterdir()) if dist.is_dir() else []})


def run_gate(name: str, artifact: Path, dist: Path) -> GateResult:
    gates = {
        "baseline": validate_baseline,
        "contracts": contracts_gate,
        "offline": lambda: offline_gate(artifact),
        "html": lambda: html_gate(artifact),
        "privacy": privacy_gate,
        "workflows": workflow_gate,
        "package": lambda: package_gate(dist),
    }
    return gates[name]()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("gate", choices=["baseline", "contracts", "offline", "html", "privacy", "workflows", "package", "all"])
    parser.add_argument(
        "--artifact",
        type=Path,
        default=ROOT / "apps" / "integrated-suite-v0.6" / "dist" / "L2G_Integrated_Suite_Scope_v0.6.0.html",
    )
    parser.add_argument("--dist", type=Path, default=ROOT / "apps" / "integrated-suite-v0.6" / "dist")
    parser.add_argument("--advisory", action="store_true", help="never return non-zero; reports still classify blocking findings")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    names = ["baseline", "contracts", "offline", "html", "privacy", "workflows", "package"] if args.gate == "all" else [args.gate]
    results: list[GateResult] = []
    for name in names:
        result = run_gate(name, args.artifact.resolve(), args.dist.resolve())
        results.append(result)
        _write_report(result)
    combined = GateResult(
        "all",
        [finding for result in results for finding in result.findings],
        {"gates": {result.gate: result.to_dict()["status"] for result in results}},
    )
    if args.gate == "all":
        _write_report(combined)
    return 0 if args.advisory or not combined.blocking else 1


if __name__ == "__main__":
    raise SystemExit(main())
