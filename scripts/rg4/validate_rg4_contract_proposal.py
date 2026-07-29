#!/usr/bin/env python3
from __future__ import annotations
import hashlib,json
from pathlib import Path
from typing import Any
ROOT=Path(__file__).resolve().parents[2]
FIXTURES=ROOT/"fixtures"/"contracts"/"l2g_ssp_word_qa_sidecar_v1"
VALID={"clean_current.json","stale_valid.json","mismatched_artifact_hash.json","mismatched_manifest_fingerprint.json","adversarial_inert_text_valid.json","retry_superseding_current.json"}
INVALID={"malformed_missing_version.json","adversarial_reject.json"}
def reject_duplicate_keys(pairs:list[tuple[str,Any]])->dict[str,Any]:
 out={}
 for k,v in pairs:
  if k in out: raise ValueError(f"duplicate JSON key: {k}")
  out[k]=v
 return out
def canonical(obj:dict[str,Any])->bytes:
 obj=dict(obj);obj.pop("package_fingerprint",None)
 return json.dumps(obj,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()
def semantic_errors(obj:dict[str,Any])->list[str]:
 e=[];checks=obj.get("checks",[]);ids=[c.get("check_id") for c in checks]
 if len(ids)!=len(set(ids)):e.append("duplicate check_id")
 agg=obj.get("aggregate",{});counts={"pass":sum(c.get("result")=="pass" for c in checks),"fail":sum(c.get("result")=="fail" for c in checks),"needs_human_review":sum(c.get("result")=="needs-human-review" for c in checks),"not_applicable":sum(c.get("result")=="not-applicable" for c in checks)}
 for k,v in counts.items():
  if agg.get(k)!=v:e.append(f"aggregate.{k} expected {v} got {agg.get(k)!r}")
 by_id={c.get("check_id"):c for c in checks}
 for a in obj.get("operator_assertions",[]):
  cid=a.get("check_id")
  if cid not in by_id:e.append(f"assertion references unknown check {cid!r}")
  elif by_id[cid].get("classification")!="human":e.append(f"assertion references non-human check {cid!r}")
 return e
def main()->int:
 failures=[];names={p.name for p in FIXTURES.glob("*.json")}
 if names!=VALID|INVALID:failures.append(f"fixture set mismatch: {sorted(names)}")
 for p in sorted(FIXTURES.glob("*.json")):
  try:obj=json.loads(p.read_text(),object_pairs_hook=reject_duplicate_keys)
  except Exception as exc:failures.append(f"{p.name}: {exc}");continue
  actual=hashlib.sha256(canonical(obj)).hexdigest();declared=obj.get("package_fingerprint")
  if p.name!="malformed_missing_version.json" and actual!=declared:failures.append(f"{p.name}: package fingerprint mismatch")
  if p.name=="malformed_missing_version.json" and actual==declared:failures.append(f"{p.name}: malformed vector has valid fingerprint")
  if p.name in VALID:
   failures.extend(f"{p.name}: {x}" for x in semantic_errors(obj))
 if failures:
  print("RG-4 proposal validation failed:");[print("-",x) for x in failures];return 1
 print("RG-4 proposal fixture fingerprints and semantic invariants passed.")
 print("NOTE: DOCX identities remain synthetic until issue #91 fixture gate is complete.")
 return 0
if __name__=="__main__":raise SystemExit(main())
