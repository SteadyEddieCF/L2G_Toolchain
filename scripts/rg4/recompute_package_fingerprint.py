#!/usr/bin/env python3
from pathlib import Path
import hashlib, json, sys

def reject_duplicate_keys(pairs):
    out={}
    for key,value in pairs:
        if key in out: raise ValueError(f"duplicate JSON key: {key}")
        out[key]=value
    return out

def canonical_without_fingerprint(obj):
    obj=dict(obj); obj.pop("package_fingerprint",None)
    return json.dumps(obj,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode("utf-8")

for name in sys.argv[1:]:
    path=Path(name)
    obj=json.loads(path.read_text(encoding="utf-8"),object_pairs_hook=reject_duplicate_keys)
    actual=hashlib.sha256(canonical_without_fingerprint(obj)).hexdigest()
    print(f"{path.name}: declared={obj.get('package_fingerprint')} calculated={actual} match={obj.get('package_fingerprint')==actual}")
