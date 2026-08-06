from __future__ import annotations

import io
import json
import os
import stat
import sys
import unittest
import zipfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from hypothesis import given, settings, strategies as st

HYPOTHESIS_EXAMPLES = int(os.environ.get("L2G_HYPOTHESIS_EXAMPLES", "150"))

from l2g_quality.safety import (
    ArchiveLimits,
    SafetyError,
    canonical_json,
    classify_file_signature,
    export_csv,
    import_csv,
    inspect_zip_bytes,
    load_json_strict,
    normalize_archive_path,
    normalize_filename,
    sanitize_spreadsheet_cell,
    sha256_json,
)


def make_zip(entries: list[tuple[str, bytes, int | None]]) -> bytes:
    output = io.BytesIO()
    with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for name, payload, mode in entries:
            info = zipfile.ZipInfo(name)
            info.compress_type = zipfile.ZIP_DEFLATED
            if mode is not None:
                info.create_system = 3
                info.external_attr = mode << 16
            archive.writestr(info, payload)
    return output.getvalue()


class JsonSafetyTests(unittest.TestCase):
    def test_duplicate_and_prototype_keys_fail_closed(self) -> None:
        with self.assertRaisesRegex(SafetyError, "duplicate JSON key"):
            load_json_strict('{"id":1,"id":2}')
        for key in ("__proto__", "prototype", "constructor"):
            with self.subTest(key=key), self.assertRaisesRegex(SafetyError, "prototype-pollution"):
                load_json_strict(json.dumps({"safe": {key: "synthetic"}}))

    def test_malformed_empty_invalid_encoding_and_non_finite_json(self) -> None:
        bad_values = [b"", b"{", b'\xff\xfe{"id":1}', b'{"number":NaN}']
        for value in bad_values:
            with self.subTest(value=value), self.assertRaises(SafetyError):
                load_json_strict(value)

    def test_canonical_json_is_stable_without_mutation(self) -> None:
        source = {"z": [3, 2, 1], "a": {"unicode": "Å"}}
        before = json.loads(json.dumps(source))
        first = canonical_json(source)
        second = canonical_json({"a": {"unicode": "Å"}, "z": [3, 2, 1]})
        self.assertEqual(first, second)
        self.assertEqual(source, before)
        self.assertEqual(sha256_json(source), sha256_json(source))


class SpreadsheetSafetyTests(unittest.TestCase):
    def test_formula_prefixes_are_neutralized_and_round_trip(self) -> None:
        raw = ["=SUM(A1:A2)", "+cmd", "-1+2", "@IMPORTXML", "safe", "'already-text"]
        exported = export_csv([[value] for value in raw])
        encoded_rows = exported.splitlines()
        for index in range(4):
            self.assertTrue(encoded_rows[index].startswith("'"), encoded_rows[index])
        restored = [row[0] for row in import_csv(exported)]
        self.assertEqual(restored, raw)

    def test_csv_limits_and_nul_fail_closed(self) -> None:
        with self.assertRaisesRegex(SafetyError, "NUL"):
            import_csv("a,\x00b")
        with self.assertRaisesRegex(SafetyError, "row count"):
            import_csv("a\nb\n", max_rows=1)
        with self.assertRaisesRegex(SafetyError, "column count"):
            import_csv("a,b\n", max_columns=1)

    @given(st.text(max_size=200))
    @settings(max_examples=HYPOTHESIS_EXAMPLES, deadline=None, derandomize=True)
    def test_csv_single_cell_round_trip_property(self, value: str) -> None:
        if "\x00" in value:
            return
        restored = import_csv(export_csv([[value]]))[0][0]
        self.assertEqual(restored, value)

    @given(st.sampled_from(["=", "+", "-", "@"]), st.text(max_size=100))
    @settings(max_examples=HYPOTHESIS_EXAMPLES, deadline=None, derandomize=True)
    def test_formula_property(self, prefix: str, tail: str) -> None:
        encoded = sanitize_spreadsheet_cell(prefix + tail)
        self.assertTrue(encoded.startswith("'" + prefix))


class ArchiveSafetyTests(unittest.TestCase):
    def test_path_traversal_absolute_drive_unc_and_case_collision(self) -> None:
        payload = make_zip(
            [
                ("../escape.txt", b"x", None),
                ("/absolute.txt", b"x", None),
                ("C:\\drive.txt", b"x", None),
                ("safe/A.txt", b"x", None),
                ("safe/a.txt", b"x", None),
            ]
        )
        codes = {finding.code for finding in inspect_zip_bytes(payload).findings}
        self.assertIn("unsafe-path", codes)
        self.assertIn("case-collision", codes)

    def test_duplicate_normalized_path_symlink_macro_and_external_link(self) -> None:
        payload = make_zip(
            [
                ("safe/one.txt", b"1", None),
                ("safe/./one.txt", b"2", None),
                ("safe/link", b"target", stat.S_IFLNK | 0o777),
                ("word/vbaProject.bin", b"macro", None),
                ("xl/externalLinks/externalLink1.xml", b"external", None),
            ]
        )
        codes = {finding.code for finding in inspect_zip_bytes(payload).findings}
        self.assertTrue({"duplicate-path", "symlink-entry", "office-macro", "office-external-link"}.issubset(codes))

    def test_entry_count_size_depth_and_compression_ratio_limits(self) -> None:
        payload = make_zip(
            [
                ("a/b/c/d/e/f.txt", b"A" * 50_000, None),
                ("second.txt", b"2", None),
            ]
        )
        limits = ArchiveLimits(
            max_entries=1,
            max_entry_bytes=10_000,
            max_total_bytes=20_000,
            max_compression_ratio=5.0,
            max_path_depth=3,
        )
        codes = {finding.code for finding in inspect_zip_bytes(payload, limits).findings}
        self.assertTrue({"entry-count", "entry-size", "expanded-size", "compression-ratio", "path-depth"}.issubset(codes))

    def test_empty_truncated_and_invalid_archives_fail_closed(self) -> None:
        for payload in (b"", b"PK\x03\x04", b"not-a-zip"):
            with self.subTest(payload=payload):
                self.assertFalse(inspect_zip_bytes(payload).safe)

    @given(
        st.lists(
            st.text(
                alphabet=st.characters(blacklist_categories=("Cs",), blacklist_characters="\x00/\\"),
                min_size=1,
                max_size=20,
            ),
            min_size=1,
            max_size=6,
        )
    )
    @settings(max_examples=HYPOTHESIS_EXAMPLES, deadline=None, derandomize=True)
    def test_normalized_safe_paths_never_escape_property(self, parts: list[str]) -> None:
        safe_parts = [part for part in parts if part not in {".", ".."} and not part.endswith(":")]
        if not safe_parts:
            return
        candidate = "/".join(safe_parts)
        try:
            normalized = normalize_archive_path(candidate)
        except SafetyError:
            return
        self.assertFalse(normalized.startswith("/"))
        self.assertNotIn("../", normalized)
        self.assertNotIn("\\", normalized)


class FilenameAndSignatureTests(unittest.TestCase):
    def test_filename_sanitization_is_bounded_and_idempotent(self) -> None:
        values = ["../Client:Name?.json", "  report   final .pdf ", "\x00bad.txt", "A" * 400 + ".json"]
        for value in values:
            with self.subTest(value=value):
                normalized = normalize_filename(value)
                self.assertEqual(normalized, normalize_filename(normalized))
                self.assertLessEqual(len(normalized), 180)
                self.assertNotRegex(normalized, r'[<>:"/\\|?*\x00-\x1f]')

    def test_file_signatures_reject_misleading_extensions(self) -> None:
        valid = {
            "synthetic.pdf": b"%PDF-1.7\n%%EOF",
            "synthetic.png": b"\x89PNG\r\n\x1a\nbody",
            "synthetic.docx": b"PK\x03\x04body",
            "synthetic.txt": "synthetic text".encode(),
            "synthetic.md": "# Synthetic".encode(),
            "synthetic.json": b'{"synthetic":true}',
        }
        for name, payload in valid.items():
            with self.subTest(name=name):
                self.assertTrue(classify_file_signature(name, payload))
        for name, payload in (("malicious.pdf", b"MZbinary"), ("fake.png", b"GIF89a"), ("empty.txt", b"")):
            with self.subTest(name=name), self.assertRaises(SafetyError):
                classify_file_signature(name, payload)

    @given(st.text(max_size=400))
    @settings(max_examples=HYPOTHESIS_EXAMPLES, deadline=None, derandomize=True)
    def test_filename_property(self, value: str) -> None:
        normalized = normalize_filename(value)
        self.assertTrue(normalized)
        self.assertLessEqual(len(normalized), 180)
        self.assertEqual(normalized, normalize_filename(normalized))


if __name__ == "__main__":
    unittest.main()
