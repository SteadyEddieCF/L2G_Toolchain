from __future__ import annotations

import base64
import io
import shutil
import tarfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[3]
PART_GLOB = "repo-overlay-v1.8.6.tar.xz.b64.part-*"
parts = sorted((HERE / "source").glob(PART_GLOB))
if not parts:
    raise SystemExit("Governed SSP v1.8.6 repository overlay payload parts are missing.")

payload = base64.b64decode("".join(path.read_text().strip() for path in parts))
repo_root = REPO.resolve()
with tarfile.open(fileobj=io.BytesIO(payload), mode="r:xz") as archive:
    for member in archive.getmembers():
        relative = member.name.removeprefix("./")
        if not relative or relative == ".":
            continue
        target = (repo_root / relative).resolve()
        if target != repo_root and repo_root not in target.parents:
            raise SystemExit(f"Unsafe materialization path: {member.name}")
        if member.isdir():
            target.mkdir(parents=True, exist_ok=True)
            continue
        if not member.isfile():
            raise SystemExit(f"Unsupported archive member: {member.name}")
        target.parent.mkdir(parents=True, exist_ok=True)
        source = archive.extractfile(member)
        if source is None:
            raise SystemExit(f"Unable to read archive member: {member.name}")
        with source, target.open("wb") as destination:
            shutil.copyfileobj(source, destination)

for part in parts:
    part.unlink(missing_ok=True)
(REPO / ".ssp-v1.8.6-staging").unlink(missing_ok=True)
(REPO / ".ssp-v1.8.6-probe").unlink(missing_ok=True)
print("Materialized governed SSP v1.8.6 repository overlay.")
