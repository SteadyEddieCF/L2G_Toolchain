from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
for name in ("build", "dist"):
    path = ROOT / name
    if path.exists():
        shutil.rmtree(path)
    path.mkdir(parents=True, exist_ok=True)
