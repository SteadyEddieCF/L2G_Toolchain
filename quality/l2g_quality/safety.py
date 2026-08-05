"""Deterministic quality/security primitives for repository-controlled tests.

These helpers are deliberately dependency-light and are not a replacement for the
validated application parsers. They define common test oracles for archive, text,
spreadsheet, filename, and deterministic-output boundaries.
"""
from __future__ import annotations

import csv
import hashlib
import io
import json
import ntpath
import posixpath
import re
import stat
import unicodedata
import zipfile
from dataclasses import dataclass, field
from pathlib import PurePosixPath
from typing import Any, Iterable, Mapping, Sequence

DANGEROUS_SPREADSHEET_PREFIXES = ("=", "+", "-", "@")
PROTOTYPE_KEYS = {"__proto__", "prototype", "constructor"}
REMOTE_SCHEMES = ("http://", "https://", "ftp://", "file://", "data:", "javascript:")
OFFICE_MACRO_PATHS = {
    "word/vbaproject.bin",
    "xl/vbaproject.bin",
    "ppt/vbaproject.bin",
}
OFFICE_EXTERNAL_LINK_PREFIXES = (
    "word/externallinks/",
    "xl/externallinks/",
    "ppt/externallinks/",
)


class SafetyError(ValueError):
    """Raised when an untrusted boundary fails closed."""


@dataclass(frozen=True)
class ArchiveLimits:
    max_entries: int = 500
    max_entry_bytes: int = 25 * 1024 * 1024
    max_total_bytes: int = 100 * 1024 * 1024
    max_compression_ratio: float = 100.0
    max_path_depth: int = 16
    max_filename_chars: int = 240


@dataclass(frozen=True)
class ArchiveFinding:
    code: str
    entry: str
    detail: str


@dataclass(frozen=True)
class ArchiveInspection:
    entries: int
    compressed_bytes: int
    expanded_bytes: int
    findings: tuple[ArchiveFinding, ...] = field(default_factory=tuple)

    @property
    def safe(self) -> bool:
        return not self.findings


def canonical_json(value: Any) -> str:
    """Return deterministic JSON without mutating the source value."""
    reject_prototype_keys(value)
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False)


def sha256_json(value: Any) -> str:
    return hashlib.sha256(canonical_json(value).encode("utf-8")).hexdigest()


def reject_prototype_keys(value: Any, path: str = "$") -> None:
    if isinstance(value, Mapping):
        for key, child in value.items():
            key_text = str(key)
            if key_text in PROTOTYPE_KEYS:
                raise SafetyError(f"prototype-pollution key rejected at {path}.{key_text}")
            reject_prototype_keys(child, f"{path}.{key_text}")
    elif isinstance(value, Sequence) and not isinstance(value, (str, bytes, bytearray)):
        for index, child in enumerate(value):
            reject_prototype_keys(child, f"{path}[{index}]")


def load_json_strict(data: bytes | str) -> Any:
    try:
        text = data.decode("utf-8-sig", errors="strict") if isinstance(data, bytes) else data
    except UnicodeDecodeError as exc:
        raise SafetyError("JSON is not valid UTF-8") from exc
    if not text.strip():
        raise SafetyError("empty JSON input")

    def no_duplicates(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
        result: dict[str, Any] = {}
        for key, value in pairs:
            if key in result:
                raise SafetyError(f"duplicate JSON key: {key}")
            result[key] = value
        return result

    try:
        value = json.loads(
            text,
            object_pairs_hook=no_duplicates,
            parse_constant=lambda token: (_ for _ in ()).throw(SafetyError(f"non-finite JSON number: {token}")),
        )
    except json.JSONDecodeError as exc:
        raise SafetyError(f"malformed JSON at line {exc.lineno}, column {exc.colno}") from exc
    reject_prototype_keys(value)
    return value


def sanitize_spreadsheet_cell(value: Any) -> str:
    """Prevent formula execution while preserving deterministic round trips."""
    text = "" if value is None else str(value)
    if text.startswith(DANGEROUS_SPREADSHEET_PREFIXES):
        return "'" + text
    return text


def restore_sanitized_spreadsheet_cell(value: str) -> str:
    if len(value) >= 2 and value[0] == "'" and value[1] in DANGEROUS_SPREADSHEET_PREFIXES:
        return value[1:]
    return value


def export_csv(rows: Iterable[Iterable[Any]]) -> str:
    output = io.StringIO(newline="")
    writer = csv.writer(output, lineterminator="\n")
    for row in rows:
        writer.writerow([sanitize_spreadsheet_cell(value) for value in row])
    return output.getvalue()


def import_csv(text: str, *, max_rows: int = 100_000, max_columns: int = 1_000) -> list[list[str]]:
    if "\x00" in text:
        raise SafetyError("CSV contains NUL bytes")
    rows: list[list[str]] = []
    try:
        for index, row in enumerate(csv.reader(io.StringIO(text, newline="")), start=1):
            if index > max_rows:
                raise SafetyError(f"CSV row count exceeds {max_rows}")
            if len(row) > max_columns:
                raise SafetyError(f"CSV column count exceeds {max_columns}")
            rows.append([restore_sanitized_spreadsheet_cell(value) for value in row])
    except csv.Error as exc:
        raise SafetyError(f"malformed CSV: {exc}") from exc
    return rows


def normalize_filename(name: str, *, replacement: str = "_") -> str:
    text = unicodedata.normalize("NFKC", name).strip()
    text = re.sub(r"[\x00-\x1f\x7f]", replacement, text)
    text = re.sub(r"[<>:\"/\\|?*]", replacement, text)
    text = re.sub(r"\s+", " ", text).strip(" .")
    text = re.sub(re.escape(replacement) + r"+", replacement, text)
    if not text or text in {".", ".."}:
        text = "unnamed"
    if len(text) > 180:
        stem, dot, suffix = text.rpartition(".")
        if dot and len(suffix) <= 16:
            text = stem[: 179 - len(suffix)] + "." + suffix
        else:
            text = text[:180]
    return text


def normalize_archive_path(name: str) -> str:
    if not isinstance(name, str) or not name:
        raise SafetyError("archive entry path is empty")
    if "\x00" in name:
        raise SafetyError("archive entry path contains NUL")
    raw = unicodedata.normalize("NFKC", name).replace("\\", "/")
    drive, _ = ntpath.splitdrive(raw)
    if drive:
        raise SafetyError("drive-letter or UNC archive path rejected")
    if raw.startswith("/") or raw.startswith("//"):
        raise SafetyError("absolute archive path rejected")
    normalized = posixpath.normpath(raw)
    if normalized in {"", ".", ".."} or normalized.startswith("../"):
        raise SafetyError("archive path traversal rejected")
    parts = PurePosixPath(normalized).parts
    if any(part in {"", ".", ".."} for part in parts):
        raise SafetyError("invalid archive path segment")
    return "/".join(parts)


def _zip_entry_is_symlink(info: zipfile.ZipInfo) -> bool:
    mode = (info.external_attr >> 16) & 0o177777
    return stat.S_ISLNK(mode)


def inspect_zip_bytes(data: bytes, limits: ArchiveLimits = ArchiveLimits()) -> ArchiveInspection:
    findings: list[ArchiveFinding] = []
    if not data:
        return ArchiveInspection(0, 0, 0, (ArchiveFinding("empty-archive", "", "archive is empty"),))
    try:
        archive = zipfile.ZipFile(io.BytesIO(data), "r")
    except (zipfile.BadZipFile, OSError) as exc:
        return ArchiveInspection(0, 0, 0, (ArchiveFinding("invalid-zip", "", str(exc)),))

    infos = archive.infolist()
    if len(infos) > limits.max_entries:
        findings.append(ArchiveFinding("entry-count", "", f"{len(infos)} > {limits.max_entries}"))

    seen_exact: set[str] = set()
    seen_folded: dict[str, str] = {}
    total_compressed = 0
    total_expanded = 0
    for info in infos:
        raw_name = info.filename
        try:
            normalized = normalize_archive_path(raw_name.rstrip("/"))
        except SafetyError as exc:
            findings.append(ArchiveFinding("unsafe-path", raw_name, str(exc)))
            continue
        if len(normalized) > limits.max_filename_chars:
            findings.append(ArchiveFinding("path-length", raw_name, f"path exceeds {limits.max_filename_chars} characters"))
        if len(PurePosixPath(normalized).parts) > limits.max_path_depth:
            findings.append(ArchiveFinding("path-depth", raw_name, f"path depth exceeds {limits.max_path_depth}"))
        if normalized in seen_exact:
            findings.append(ArchiveFinding("duplicate-path", raw_name, normalized))
        seen_exact.add(normalized)
        folded = normalized.casefold()
        prior = seen_folded.get(folded)
        if prior is not None and prior != normalized:
            findings.append(ArchiveFinding("case-collision", raw_name, f"collides with {prior}"))
        seen_folded[folded] = normalized
        if _zip_entry_is_symlink(info):
            findings.append(ArchiveFinding("symlink-entry", raw_name, "symbolic links are not allowed"))
        total_compressed += max(0, info.compress_size)
        total_expanded += max(0, info.file_size)
        if info.file_size > limits.max_entry_bytes:
            findings.append(ArchiveFinding("entry-size", raw_name, f"{info.file_size} > {limits.max_entry_bytes}"))
        denominator = max(1, info.compress_size)
        ratio = info.file_size / denominator
        if ratio > limits.max_compression_ratio:
            findings.append(ArchiveFinding("compression-ratio", raw_name, f"{ratio:.1f} > {limits.max_compression_ratio:.1f}"))
        lower = normalized.casefold()
        if lower in OFFICE_MACRO_PATHS or lower.endswith("/vbaproject.bin"):
            findings.append(ArchiveFinding("office-macro", raw_name, "macro-bearing Office entry rejected"))
        if any(lower.startswith(prefix) for prefix in OFFICE_EXTERNAL_LINK_PREFIXES):
            findings.append(ArchiveFinding("office-external-link", raw_name, "external Office link rejected"))

    if total_expanded > limits.max_total_bytes:
        findings.append(ArchiveFinding("expanded-size", "", f"{total_expanded} > {limits.max_total_bytes}"))
    archive.close()
    return ArchiveInspection(len(infos), total_compressed, total_expanded, tuple(findings))


def assert_safe_zip(data: bytes, limits: ArchiveLimits = ArchiveLimits()) -> ArchiveInspection:
    inspection = inspect_zip_bytes(data, limits)
    if not inspection.safe:
        details = "; ".join(f"{item.code}:{item.entry}:{item.detail}" for item in inspection.findings)
        raise SafetyError(details)
    return inspection


def classify_file_signature(filename: str, data: bytes) -> str:
    """Return a bounded signature classification, rejecting misleading extensions."""
    suffix = PurePosixPath(filename).suffix.casefold()
    if not data:
        raise SafetyError("empty file")
    signatures = {
        ".pdf": (b"%PDF-", "pdf"),
        ".png": (b"\x89PNG\r\n\x1a\n", "png"),
        ".jpg": (b"\xff\xd8\xff", "jpeg"),
        ".jpeg": (b"\xff\xd8\xff", "jpeg"),
        ".gif": (b"GIF8", "gif"),
        ".zip": (b"PK", "zip"),
        ".docx": (b"PK", "docx"),
        ".xlsx": (b"PK", "xlsx"),
        ".pptx": (b"PK", "pptx"),
    }
    expected = signatures.get(suffix)
    if expected and not data.startswith(expected[0]):
        raise SafetyError(f"file signature does not match extension {suffix}")
    if expected:
        return expected[1]
    try:
        data[:4096].decode("utf-8", errors="strict")
        return "text"
    except UnicodeDecodeError:
        return "binary"


def contains_remote_reference(text: str) -> bool:
    lowered = text.casefold()
    return any(scheme in lowered for scheme in REMOTE_SCHEMES)


def contains_formula(value: str) -> bool:
    return value.startswith(DANGEROUS_SPREADSHEET_PREFIXES)
