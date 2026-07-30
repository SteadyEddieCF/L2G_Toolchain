#!/usr/bin/env python3
from __future__ import annotations
import argparse, copy, hashlib, json
from pathlib import Path
from typing import Any

def reject_duplicate_keys(pairs:list[tuple[str,Any]])->dict[str,Any]:
    out={}
    for key,value in pairs:
        if key in out: raise ValueError(f"duplicate JSON key: {key}")
        out[key]=value
    return out

def canonical(obj:Any)->bytes:
    return json.dumps(obj,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode("utf-8")

def digest(obj:Any)->str: return hashlib.sha256(canonical(obj)).hexdigest()

def lineage_key(obj:dict[str,Any])->str:
    return digest({"package_kind":obj["package_kind"],"package_version":obj["package_version"],"scope":obj["scope"],"document_version":obj["source"]["document_version"],"qa_profile":{"id":obj["qa_profile"]["id"],"version":obj["qa_profile"]["version"]}})

def sidecar_id(obj:dict[str,Any])->str:
    clone=copy.deepcopy(obj);clone.pop("sidecar_id",None);clone.pop("package_fingerprint",None)
    return "sha256:"+digest(clone)

def package_fingerprint(obj:dict[str,Any])->str:
    clone=copy.deepcopy(obj);clone.pop("package_fingerprint",None)
    return digest(clone)

def main()->int:
    ap=argparse.ArgumentParser();ap.add_argument("paths",nargs="+");ap.add_argument("--write",action="store_true")
    args=ap.parse_args(); failed=False
    for name in args.paths:
        path=Path(name);obj=json.loads(path.read_text("utf-8"),object_pairs_hook=reject_duplicate_keys)
        lk=lineage_key(obj);sid=sidecar_id(obj);pf=package_fingerprint(obj)
        print(f"{path}: lineage declared={obj.get('lineage',{}).get('lineage_key')} calculated={lk} match={obj.get('lineage',{}).get('lineage_key')==lk}")
        print(f"{path}: sidecar declared={obj.get('sidecar_id')} calculated={sid} match={obj.get('sidecar_id')==sid}")
        print(f"{path}: package declared={obj.get('package_fingerprint')} calculated={pf} match={obj.get('package_fingerprint')==pf}")
        if args.write:
            obj.setdefault("lineage",{})["lineage_key"]=lk;obj["sidecar_id"]=sid;obj["package_fingerprint"]=package_fingerprint(obj)
            path.write_text(json.dumps(obj,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
        else:
            failed |= obj.get('lineage',{}).get('lineage_key')!=lk or obj.get('sidecar_id')!=sid or obj.get('package_fingerprint')!=pf
    return 1 if failed else 0
if __name__=="__main__": raise SystemExit(main())
