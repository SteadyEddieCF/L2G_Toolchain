#!/usr/bin/env python3
from pathlib import Path
from html.parser import HTMLParser
import hashlib
import re

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / 'CMMC_L2_SSP_Modern_Editable_v1.9.7.html'
BASELINE = ROOT.parent / 'v1.9.6' / 'CMMC_L2_SSP_Modern_Editable_v1.9.6.html'

EXPECTED_RUNTIME = '359a6a04fceadbb64afbf3733c6984e9b4e1171b48aef067859eddc8d1708051'
EXPECTED_BASELINE = 'd86ae890920f7935c40e9d237766e5ac482af70907e0758bd7e7f1b8f0bed0ea'


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
        if 'control-card' in (values.get('class') or '').split():
            self.control_cards += 1


assert digest(BASELINE) == EXPECTED_BASELINE
assert digest(RUNTIME) == EXPECTED_RUNTIME
text = RUNTIME.read_text(encoding='utf-8')
parser = InventoryParser()
parser.feed(text)

assert '<title>CMMC Level 2 System Security Plan - Modern Editable v1.9.7</title>' in text
assert '<meta content="1.9.7" name="application-version"/>' in text or '<meta name="application-version" content="1.9.7">' in text
assert parser.control_cards == 110
assert len(parser.ids) == len(set(parser.ids))

for required in [
    'id="documentStateSummary"', 'id="portfolioModal"',
    'ux2PrimaryNav', 'ux2SubviewNav', 'ux2WorkspaceScope',
    'ux2WorkspaceModule', 'ux2WorkspaceSearch', 'ux2WorkspaceSort',
    'ux2DetailsPanel',
    "const UX2_VIEWS=Object.freeze(['overview','modules','operations','governance','delivery']);",
    "const RELEASE_VERSION='1.9.7'", "const APP_VERSION='1.9.5.1'",
    'cmmc-l2-ssp-workspace-ui-v1.9.7',
    'Builder/Merger remains the downstream owner',
    'without authenticated identity'
]:
    assert required in text, required

for prohibited in [
    'reviewGateProfiles', 'reviewGateRuns', 'generic-cmmc-ssp-review-v1',
    'unified Needs Attention', '55-item'
]:
    assert prohibited not in text, prohibited

collect = re.search(r'function collectData\([^)]*\)\{(.*?)\n\s*\}', text, re.S)
assert collect
assert 'UX2_PREF_KEY' not in collect.group(1)
assert 'selectedRecord' not in collect.group(1)

print({
    'release': 'v1.9.7',
    'runtimeSha256': EXPECTED_RUNTIME,
    'requirements': parser.control_cards,
    'duplicateIds': 0,
    'workingDataIdentity': '1.9.5.1',
    'primaryViews': 5,
    'status': 'passed'
})
