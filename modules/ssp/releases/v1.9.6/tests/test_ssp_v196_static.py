#!/usr/bin/env python3
from pathlib import Path
from html.parser import HTMLParser
import hashlib
import re

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / 'CMMC_L2_SSP_Modern_Editable_v1.9.6.html'
BASELINE = ROOT.parent / 'v1.9.5.1' / 'CMMC_L2_SSP_Modern_Editable_v1.9.5.1.html'

EXPECTED_RUNTIME = 'd86ae890920f7935c40e9d237766e5ac482af70907e0758bd7e7f1b8f0bed0ea'
EXPECTED_BASELINE = 'a291b6b1c13b6232ca73e7ed00c9fed40eccdd216ee8bda8ceb4f3dfb59599e8'

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

class InventoryParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.control_cards = 0
    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get('id'):
            self.ids.append(values['id'])
        classes = (values.get('class') or '').split()
        if 'control-card' in classes:
            self.control_cards += 1

assert digest(BASELINE) == EXPECTED_BASELINE
assert digest(RUNTIME) == EXPECTED_RUNTIME
text = RUNTIME.read_text(encoding='utf-8')
parser = InventoryParser()
parser.feed(text)

assert '<title>CMMC Level 2 System Security Plan - Modern Editable v1.9.6</title>' in text
assert '<meta content="1.9.6" name="application-version"/>' in text or '<meta name="application-version" content="1.9.6">' in text
assert parser.control_cards == 110
assert len(parser.ids) == len(set(parser.ids))

for required in [
    'id="documentStateSummary"', 'id="documentStateDialog"',
    'id="deliverModal"', 'id="deliverBtn"', 'id="preflightPrimaryBtn"',
    'id="uxPortfolioScope"', 'id="uxPortfolioModule"',
    "const RELEASE_VERSION='1.9.6'", "const APP_VERSION='1.9.5.1'",
    "UX_PREF_KEY='cmmc-l2-ssp-ui-v1.9.6'", 'download-initiated',
    'Portfolio · Advanced', 'Local approval record',
    'Content-fingerprinted local baseline'
]:
    assert required in text, required

for prohibited in [
    'reviewGateProfiles', 'reviewGateRuns', 'generic-cmmc-ssp-review-v1',
    'Needs Attention'
]:
    assert prohibited not in text, prohibited

collect = re.search(r'function collectData\([^)]*\)\{(.*?)\n\s*\}', text, re.S)
assert collect
assert 'UX_PREF_KEY' not in collect.group(1)
assert 'lastExportAttempts' not in collect.group(1)

print({
    'release': 'v1.9.6',
    'runtimeSha256': EXPECTED_RUNTIME,
    'requirements': parser.control_cards,
    'duplicateIds': 0,
    'workingDataIdentity': '1.9.5.1',
    'status': 'passed'
})
