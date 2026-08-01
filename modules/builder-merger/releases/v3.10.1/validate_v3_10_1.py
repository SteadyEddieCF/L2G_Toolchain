#!/usr/bin/env python3
from __future__ import annotations
import hashlib, json, re, subprocess, sys
from pathlib import Path
HERE=Path(__file__).resolve().parent
RUNTIME=HERE/'L2G-BM_v3.10.1.html'
EXPECTED_SHA='2879ee0a933b74c9f27b3c94c0034eafd06f13bc0a8e2d52ba064467b19bfd93'
EXPECTED_SIZE=832972
subprocess.run([sys.executable,str(HERE/'materialize.py')],check=True)
data=RUNTIME.read_bytes();text=data.decode('utf-8')
checks={
 'runtime_size':len(data)==EXPECTED_SIZE,
 'runtime_sha256':hashlib.sha256(data).hexdigest()==EXPECTED_SHA,
 'nested_extension_path':'workbook_source.workshop_governance_preservation_v1' in text,
 'no_top_level_emission':'delete plan.packageObj.workshop_governance_preservation_v1' in text,
 'schema_1_0':"schema_version:'1.0'" in text,
 'sha256_records':'v3101Sha256Value' in text and 'source_record_fingerprint' in text,
 'canonical_source_sha_in_workbook':"'Canonical SHA-256 fingerprint'" in text and 'canonical_sha256_fingerprint:v3101CanonicalHandoffFingerprint(raw)' in text,
 'source_linkage_check':'source Handoff fingerprint mismatch' in text,
 'three_guardrails':all(x in text for x in ['reconciliation_assertion_only:true','no_automatic_create_update_delete:true','missing_or_mismatch_blocks_trusted_apply:true']),
 'merge_1_1':"merge_package_version:'1.1'" in text,
 'word_qa_route_preserved':'async function wqaBuildSidecar' in text and 'l2g_ssp_word_qa_sidecar_v1' in text,
 'no_developer_paths':'/mnt/data' not in text and 'v3101_work' not in text,
 'offline_static':not re.search(r'fetch\s*\(|new\s+XMLHttpRequest|sendBeacon\s*\(',text,re.I),
}
result={'all_passed':all(checks.values()),'runtime_sha256':hashlib.sha256(data).hexdigest(),'runtime_size_bytes':len(data),'checks':checks}
print(json.dumps(result,indent=2))
raise SystemExit(0 if result['all_passed'] else 1)
