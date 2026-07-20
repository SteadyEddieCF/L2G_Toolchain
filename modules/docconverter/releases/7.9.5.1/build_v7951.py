#!/usr/bin/env python3
"""Build DocConverter-L2G v7.9.5.1 from the authoritative v7.9.5 baseline.

Usage:
  python build_v7951.py DocConverter-L2G_v7.9.5.html DocConverter-L2G_v7.9.5.1.html
"""
from pathlib import Path
import argparse, hashlib

VERSION = "v7.9.5.1"
BASELINE_SHA256 = "781668a7cfa84f91d2541485f512ad2f9ee41260da5d06bf2d0106e5be92357c"
PATCH_FILE = Path(__file__).with_name("DocConverter-L2G_v7.9.5.1_Candidate_Precision_Patch.js")

def digest(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('baseline', type=Path)
    ap.add_argument('output', type=Path)
    ap.add_argument('--allow-baseline-mismatch', action='store_true')
    args=ap.parse_args()
    actual=digest(args.baseline)
    if actual != BASELINE_SHA256 and not args.allow_baseline_mismatch:
        raise SystemExit(f"Baseline SHA-256 mismatch: {actual}; expected {BASELINE_SHA256}")
    html=args.baseline.read_text(encoding='utf-8')
    # Keep cumulative visible/runtime identity layers aligned to avoid title/page oscillation.
    html=html.replace('v7.9.5', VERSION)
    html=html.replace('build_date: "2026-07-13"', 'build_date: "2026-07-20"')
    html=html.replace('release_name: "Identity stabilization, render-loop hardening, and ten-release roadmap"',
                      'release_name: "Validation-question candidate precision hotfix"')
    html=html.replace('cumulative_baseline: "v6.4-v7.9.2"', 'cumulative_baseline: "v6.4-v7.9.5"')
    patch=PATCH_FILE.read_text(encoding='utf-8')
    payload='\n<script>\n'+patch+'</script>\n\n'
    if '</body>' not in html:
        raise SystemExit('Closing </body> tag was not found.')
    html=html.replace('</body>', payload+'</body>', 1)
    args.output.write_text(html, encoding='utf-8')
    print(f"Wrote {args.output} ({args.output.stat().st_size} bytes, SHA-256 {digest(args.output)})")
if __name__=='__main__': main()
