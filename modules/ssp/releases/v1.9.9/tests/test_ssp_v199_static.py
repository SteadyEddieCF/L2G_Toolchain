#!/usr/bin/env python3
from pathlib import Path
from html.parser import HTMLParser
import hashlib,json
ROOT=Path(__file__).resolve().parents[1]
RUNTIME=ROOT/'CMMC_L2_SSP_Modern_Editable_v1.9.9.html'; SCHEMA=ROOT/'CMMC_L2_SSP_Data_Schema_v1.9.9.json'; REGISTRY=ROOT/'CMMC_L2_SSP_Built_In_Review_Profile_Registry_v1.9.9.json'; REGISTRY_SCHEMA=ROOT/'CMMC_L2_SSP_Built_In_Review_Profile_Registry_Schema_v1.1.json'
EXPECTED={RUNTIME.name:'4df58dd45c369fd2c3ec6e49e81fa8887f80859dddd4fbd9b00f410679144927',SCHEMA.name:'2d093d34b6260822d8be2547a50c3dc5c6c3e73100c9f0fc6fcb2794a84903b1',REGISTRY.name:'8deb8917615046f9b85ed34f7c5fac061f6756e44cbd6a8677e935487bfedfc2'}
class Inventory(HTMLParser):
 def __init__(self): super().__init__(convert_charrefs=True); self.ids=[]; self.controls=0
 def handle_starttag(self,tag,attrs):
  v=dict(attrs)
  if v.get('id'): self.ids.append(v['id'])
  if 'control-card' in (v.get('class') or '').split(): self.controls+=1
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
for p in (RUNTIME,SCHEMA,REGISTRY): assert p.exists() and sha(p)==EXPECTED[p.name],p
text=RUNTIME.read_text(); inv=Inventory(); inv.feed(text); assert inv.controls==110; assert len(inv.ids)==len(set(inv.ids))
for token in ["const RELEASE_VERSION='1.9.9'","const APP_VERSION='1.9.9'","const SCHEMA='cmmc-l2-ssp-modern-v1.9.9'",'id="rg2Modal"',"stateButton.id='reviewWorkspaceBtn'",'reviewStageRuns','reviewCorrectiveActions','generic-cmmc-ssp-review-v1','Project Director cannot be the same locally asserted person as the Engagement Lead','CMMC_L2_SSP_v1.9.9_Data_Backup.json']:
 assert token in text,token
for prohibited in ['id="ux3NeedsAttention"','wordQaSidecarPackage','remoteNotificationEndpoint','directoryAuthenticationProvider']:
 assert prohibited not in text,prohibited
schema=json.loads(SCHEMA.read_text()); assert schema['$id']=='urn:l2g:cmmc-l2-ssp:working-data:1.9.9'; assert schema['properties']['schemaVersion']['const']=='1.9.9'; assert 'reviewStageRuns' in schema['properties']; assert 'reviewCorrectiveActions' in schema['properties']
registry=json.loads(REGISTRY.read_text()); assert registry['registryVersion']=='1.0'; assert [p['profileVersion'] for p in registry['profiles']]==['0.1','0.2']; assert len(registry['profiles'][0]['items'])==12; assert len(registry['profiles'][1]['items'])==35; assert registry['profiles'][0]['items']==registry['profiles'][1]['items'][:12]
methods={i.get('methodLabel') for i in registry['profiles'][1]['items'][12:]}; assert methods <= {'manual human review','local attestation','manual artifact inspection','external verification required'}
print(json.dumps({'release':'v1.9.9','status':'passed','requirements':110,'profileVersions':['0.1','0.2'],'v01Items':12,'v02Items':35,'runtimeSha256':EXPECTED[RUNTIME.name],'schemaSha256':EXPECTED[SCHEMA.name],'registrySha256':EXPECTED[REGISTRY.name]},sort_keys=True))
