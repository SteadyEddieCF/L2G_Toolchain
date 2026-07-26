#!/usr/bin/env python3
from pathlib import Path
from html.parser import HTMLParser
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / 'CMMC_L2_SSP_Modern_Editable_v1.9.8.html'
SCHEMA = ROOT / 'CMMC_L2_SSP_Data_Schema_v1.9.8.json'
REGISTRY = ROOT / 'CMMC_L2_SSP_Built_In_Review_Profile_Registry_v1.9.8.json'

EXPECTED = {
    RUNTIME.name: '04cb0c327e746a7f1db0c652b18638a795f388317be67413ac5706296e299c82',
    SCHEMA.name: '775284cd37f16e20e251cf77e96528347166b93fe9d815e83e61ce4786945f6c',
    REGISTRY.name: 'b12a07ef838aa5777a2b68c51fb6586bf7eaee8f4d035b43765f46cf0ac5f673',
}

class Inventory(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.controls = 0
    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get('id'):
            self.ids.append(values['id'])
        if 'control-card' in (values.get('class') or '').split():
            self.controls += 1

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

for path in (RUNTIME, SCHEMA, REGISTRY):
    assert path.exists(), path
    assert sha(path) == EXPECTED[path.name], path

text = RUNTIME.read_text(encoding='utf-8')
parser = Inventory()
parser.feed(text)
assert parser.controls == 110
assert len(parser.ids) == len(set(parser.ids))
assert '<title>CMMC Level 2 System Security Plan - Modern Editable v1.9.8</title>' in text
for token in [
    "const RELEASE_VERSION='1.9.8'",
    "const APP_VERSION='1.9.8'",
    "const SCHEMA='cmmc-l2-ssp-modern-v1.9.8'",
    'generic-cmmc-ssp-review-v1', 'reviewGateConfiguration', 'reviewGateRuns',
    'source-preflight', 'id="rg1Modal"', 'id="rg1RunBtn"', 'id="rg1Results"',
    '__sspRg1TestHooks', 'CMMC_L2_SSP_v1.9.8_Data_Backup.json',
    'cmmc-l2-ssp-workspace-ui-v1.9.7'
]:
    assert token in text, token
for prohibited in [
    'Coalfire CMMC SSP Required Review Checklist',
    'Project Director sign-off completed',
    'Final Word QA passed',
    'Builder/Merger final Word QA result sidecar'
]:
    assert prohibited not in text, prohibited
assert 'CMMC_L2_SSP_v1.9.5.1_Data_Backup.json' not in text

schema = json.loads(SCHEMA.read_text(encoding='utf-8'))
assert schema['$id'] == 'urn:l2g:cmmc-l2-ssp:data-schema:1.9.8'
assert schema['properties']['schemaVersion']['const'] == '1.9.8'
assert schema['properties']['appVersion']['const'] == '1.9.8'
assert 'reviewGateConfiguration' in schema['properties']
assert 'reviewGateRuns' in schema['properties']

registry = json.loads(REGISTRY.read_text(encoding='utf-8'))
profile = registry['profiles'][0]
assert profile['profileId'] == 'generic-cmmc-ssp-review-v1'
assert profile['profileVersion'] == '0.1'
assert profile['builtIn'] is True
assert profile['customDefinitionsSupported'] is False
assert len(profile['items']) == 12
assert len({item['itemId'] for item in profile['items']}) == 12
assert all(item['stageId'] == 'source-preflight' for item in profile['items'])

print(json.dumps({
    'release': 'v1.9.8', 'status': 'passed', 'requirements': 110,
    'duplicateIds': 0, 'profileItems': 12, 'workingDataIdentity': '1.9.8',
    'runtimeSha256': EXPECTED[RUNTIME.name], 'schemaSha256': EXPECTED[SCHEMA.name],
    'registrySha256': EXPECTED[REGISTRY.name]
}, sort_keys=True))
