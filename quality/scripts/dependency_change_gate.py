#!/usr/bin/env python3
"""Require audit coverage for dependency files changed by a pull request.

GitHub Dependency Review depends on the repository Dependency Graph setting.
This gate keeps the policy repository-controlled: every changed dependency
manifest or lockfile must be mapped to an audit job, and npm dependency changes
must update the sibling lockfile. The normal npm/pip audit jobs remain the
vulnerability source of truth.
"""
from __future__ import annotations

import argparse
import fnmatch
import json
import subprocess
from dataclasses import dataclass, asdict
from pathlib import Path, PurePosixPath
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
CONFIG_PATH = ROOT / "quality" / "dependency-audit-coverage.json"
REPORT_PATH = ROOT / "quality-reports" / "dependency-change-gate.json"

EXACT_DEPENDENCY_NAMES = {
    "package.json",
    "package-lock.json",
    "npm-shrinkwrap.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "bun.lock",
    "bun.lockb",
    "pyproject.toml",
    "poetry.lock",
    "Pipfile",
    "Pipfile.lock",
    "uv.lock",
    "Cargo.toml",
    "Cargo.lock",
    "go.mod",
    "go.sum",
    "pom.xml",
    "Gemfile",
    "Gemfile.lock",
    "composer.json",
    "composer.lock",
}
DEPENDENCY_GLOBS = (
    "requirements*.txt",
    "build.gradle",
    "build.gradle.kts",
    "gradle.lockfile",
    "*.csproj",
    "packages.lock.json",
)
NPM_DEPENDENCY_KEYS = (
    "dependencies",
    "devDependencies",
    "optionalDependencies",
    "peerDependencies",
    "overrides",
    "resolutions",
)


@dataclass(frozen=True)
class Finding:
    code: str
    path: str
    detail: str


def run_git(*args: str, allow_failure: bool = False) -> str:
    result = subprocess.run(
        ["git", *args],
        cwd=ROOT,
        check=False,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    if result.returncode and not allow_failure:
        raise RuntimeError(f"git {' '.join(args)} failed: {result.stderr.strip()}")
    return result.stdout


def is_dependency_file(path: str) -> bool:
    name = PurePosixPath(path).name
    return name in EXACT_DEPENDENCY_NAMES or any(fnmatch.fnmatch(name, pattern) for pattern in DEPENDENCY_GLOBS)


def load_json_from_ref(ref: str, path: str) -> dict[str, Any] | None:
    text = run_git("show", f"{ref}:{path}", allow_failure=True)
    if not text:
        return None
    try:
        value = json.loads(text)
    except json.JSONDecodeError as exc:
        raise RuntimeError(f"{path} at {ref} is invalid JSON: {exc}") from exc
    if not isinstance(value, dict):
        raise RuntimeError(f"{path} at {ref} must contain a JSON object")
    return value


def npm_dependency_view(value: dict[str, Any] | None) -> dict[str, Any]:
    if value is None:
        return {}
    return {key: value.get(key, {}) for key in NPM_DEPENDENCY_KEYS}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", help="Base commit SHA for pull-request comparison")
    parser.add_argument("--head", help="Head commit SHA for pull-request comparison")
    args = parser.parse_args()

    config = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    findings: list[Finding] = []
    if config.get("kind") != "l2g_dependency_audit_coverage_v1" or config.get("version") != "1.0":
        findings.append(Finding("coverage-identity", CONFIG_PATH.relative_to(ROOT).as_posix(), "unexpected kind/version"))

    entries = config.get("covered_files")
    if not isinstance(entries, list) or not entries:
        findings.append(Finding("coverage-empty", CONFIG_PATH.relative_to(ROOT).as_posix(), "covered_files must be a non-empty list"))
        entries = []

    covered: set[str] = set()
    for index, entry in enumerate(entries):
        if not isinstance(entry, dict):
            findings.append(Finding("coverage-shape", CONFIG_PATH.relative_to(ROOT).as_posix(), f"entry {index} is not an object"))
            continue
        path = str(entry.get("path", ""))
        if not path or not entry.get("ecosystem") or not entry.get("audit_job"):
            findings.append(Finding("coverage-shape", CONFIG_PATH.relative_to(ROOT).as_posix(), f"entry {index} is incomplete"))
            continue
        if path in covered:
            findings.append(Finding("coverage-duplicate", path, "dependency file is listed more than once"))
        covered.add(path)
        if not (ROOT / path).is_file():
            findings.append(Finding("coverage-missing-file", path, "configured dependency file does not exist"))

    changed: list[str] = []
    dependency_changes: list[str] = []
    if bool(args.base) != bool(args.head):
        findings.append(Finding("comparison-arguments", "", "--base and --head must be supplied together"))
    elif args.base and args.head:
        try:
            changed = [
                line.strip()
                for line in run_git("diff", "--name-only", "--diff-filter=ACMRT", args.base, args.head).splitlines()
                if line.strip()
            ]
        except RuntimeError as exc:
            findings.append(Finding("comparison-failed", "", str(exc)))
        dependency_changes = sorted(path for path in changed if is_dependency_file(path))
        for path in dependency_changes:
            if path not in covered:
                findings.append(Finding("uncovered-dependency-file", path, "changed dependency manifest or lockfile has no configured audit job"))

        changed_set = set(changed)
        for path in dependency_changes:
            if PurePosixPath(path).name != "package.json" or path not in covered:
                continue
            try:
                base_value = load_json_from_ref(args.base, path)
                head_value = load_json_from_ref(args.head, path)
            except RuntimeError as exc:
                findings.append(Finding("package-json-invalid", path, str(exc)))
                continue
            if npm_dependency_view(base_value) == npm_dependency_view(head_value):
                continue
            lock_path = str(PurePosixPath(path).with_name("package-lock.json"))
            if lock_path not in changed_set:
                findings.append(Finding("npm-lockfile-not-updated", path, f"dependency sections changed without {lock_path}"))
            if lock_path not in covered:
                findings.append(Finding("npm-lockfile-uncovered", lock_path, "sibling lockfile is not mapped to an audit job"))

    report = {
        "kind": "l2g_dependency_change_gate_report_v1",
        "status": "fail" if findings else "pass",
        "base": args.base,
        "head": args.head,
        "configured_files": sorted(covered),
        "changed_files": changed,
        "dependency_changes": dependency_changes,
        "findings": [asdict(finding) for finding in findings],
    }
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps(report, sort_keys=True))
    return 1 if findings else 0


if __name__ == "__main__":
    raise SystemExit(main())
