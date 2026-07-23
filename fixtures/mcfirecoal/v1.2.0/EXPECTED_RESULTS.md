# McFirecoal Fixture v1.2.0 — Expected Results

## Parts 1 and 2

Parts 1 and 2 are the clean 104-file baseline. Expected outcomes:

- process both ZIPs without increasing the 90-entry cap;
- preserve source IDs, filenames, hashes, and provenance;
- create draft candidates only;
- export stable version-1.0 DocConverter contracts;
- create zero CMMC practice records in Scoper;
- avoid assessment, readiness, evidence-sufficiency, or compliance conclusions;
- remain local/offline with no network requests.

## Part 3

Part 3 is an adversarial and integration corpus, not a clean source package. Expected behavior depends on the fixture category:

- current/superseded scope: retain lineage and require explicit authority selection;
- malformed JSON/XML/YAML/CSV/encoding: reject, quarantine, inventory-only, or require review without crashing;
- stale/future evidence: preserve dates and surface freshness concerns without making compliance conclusions;
- exact/near duplicates: retain deterministic identity and explain duplicate treatment;
- unknown optional sidecars: safely ignore or return review-required;
- tampered stable packages: reject or block Apply;
- valid audit route packages: recognize by package kind/version and preserve fingerprints;
- invalid workbook/SSP packages: reject or require review without mutating state;
- OCR/layout stress: require explicit OCR where normal extraction is insufficient;
- nested/high-compression archives and long/extensionless filenames: enforce existing depth, size, path, and file-count safeguards;
- large JSONL/text: remain responsive and provide deterministic processing status.

No Part 3 fixture authorizes weakening safeguards or automatically accepting malformed content.
