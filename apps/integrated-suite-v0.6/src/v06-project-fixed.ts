namespace L2G {
  const V06_V05_CREATE = createNewProject;
  const V06_V05_DESERIALIZE = deserializeInnerProject;
  const V06_V05_VALIDATE = validateProjectDocument;
  const V06_V05_STORE = ProjectStore;
  void V06_V05_STORE;

  const V06_MAX_ENTRY_BYTES = 8 * 1024 * 1024;
  const V06_MAX_EXPANDED_BYTES = 24 * 1024 * 1024;
  const V06_PATHS = [
    "compatibility/current-registry.json",
    "domains/engagement.json",
    "domains/evidence-index.json",
    "domains/interview-sessions.json",
    "domains/pre-engagement.json",
    "domains/reviews-actions.json",
    "domains/scope.json",
    "history/checkpoints.json",
    "history/events.ndjson",
    "integrity/sha256-manifest.json",
    "manifest.json"
  ];
  const V06_DOMAINS = [
    {path:"domains/engagement.json",schema:"l2g_engagement_v1",authority:"Engagement"},
    {path:"domains/evidence-index.json",schema:"l2g_evidence_index_v1",authority:"Evidence"},
    {path:"domains/pre-engagement.json",schema:PRE_ENGAGEMENT_SCHEMA_KIND,authority:"Pre-Engagement"},
    {path:"domains/interview-sessions.json",schema:INTERVIEW_SCHEMA_KIND,authority:"Interview Sessions"},
    {path:"domains/scope.json",schema:SCOPE_SCHEMA_KIND,authority:"Scope"},
    {path:"domains/reviews-actions.json",schema:"reviews_actions_v1",authority:"Reviews & Actions"}
  ];
  const V06_V05_DOMAINS = V06_DOMAINS.filter(item=>item.path!=="domains/scope.json");

  function requireScope(document:ProjectDocument):ScopeDomain { const scope=document.state.scope;if(!scope)throw new Error("The v0.6 project is missing domains/scope.json.");return scope; }
  function samePaths(actual:string[],expected:string[]):boolean { const wanted=[...expected].sort();return actual.length===wanted.length&&actual.every((value,index)=>value===wanted[index]); }
  function zipEntry(entries:Map<string,Uint8Array>,path:string):Uint8Array { const value=entries.get(path);if(!value)throw new Error(`Missing project entry: ${path}`);return value; }
  function parseEntry<T>(entries:Map<string,Uint8Array>,path:string):T { return parseStrictJson(decodeUtf8(zipEntry(entries,path))) as T; }
  function stripScope(document:ProjectDocument):ProjectDocument {
    const clone=deepClone(document);delete (clone.state as unknown as Record<string,unknown>).scope;clone.manifest.domain_index=deepClone(V06_V05_DOMAINS);
    clone.checkpoints=clone.checkpoints.map(checkpoint=>{const item=deepClone(checkpoint);delete (item.state as unknown as Record<string,unknown>).scope;return item;});return clone;
  }

  function createV06Project():ProjectDocument {
    const document=V06_V05_CREATE();const timestamp=nowIso();document.manifest.application={name:"L2G Integrated Suite",version:window.__L2G_RELEASE__.version,product_runtime_compatibility_baseline:window.__L2G_RELEASE__.product_runtime_compatibility_baseline};document.manifest.domain_index=deepClone(V06_DOMAINS);document.state.scope=createSyntheticScope(timestamp);document.history=[{event_id:newId("event"),timestamp,profile:"advisor",action:"project.created",object_type:"project",object_id:document.manifest.project_id,summary:"Created a synthetic v0.6 canonical Scope project.",transaction_id:newId("txn")}];document.checkpoints=[];validateV06Project(document,true);return document;
  }

  function validateV06Project(document:ProjectDocument,requireEncrypted:boolean):void {
    if(!isRecord(document)||!isRecord(document.state)||!isRecord(document.manifest))throw new Error("Project document is invalid.");
    assertExactObjectKeys(document,["manifest","state","history","checkpoints"],"Project document");
    assertExactObjectKeys(document.state,["engagement","evidence","pre_engagement","interviews","scope","reviews_actions","profile","active_workspace","inspector_open","inspector_pinned","rail_collapsed"],"Project state");
    if(stableStringify(document.manifest.domain_index,0)!==stableStringify(V06_DOMAINS,0))throw new Error("Project domain index does not match the v0.6 authority set.");
    V06_V05_VALIDATE(stripScope(document),requireEncrypted);validateScopeDomain(requireScope(document));
    if(document.checkpoints.length>20)throw new Error("Project exceeds the inherited checkpoint limit.");
    for(const checkpoint of document.checkpoints){const scope=checkpoint.state.scope;if(!scope)throw new Error(`Checkpoint ${checkpoint.checkpoint_id} is missing Scope state.`);validateScopeDomain(scope);}
  }

  async function serializeV06Project(document:ProjectDocument):Promise<Uint8Array> {
    validateV06Project(document,true);const payloads=new Map<string,Uint8Array>();
    payloads.set("manifest.json",utf8(stableStringify(document.manifest)));payloads.set("domains/engagement.json",utf8(stableStringify(document.state.engagement)));payloads.set("domains/evidence-index.json",utf8(stableStringify(document.state.evidence)));payloads.set("domains/pre-engagement.json",utf8(stableStringify(document.state.pre_engagement)));payloads.set("domains/interview-sessions.json",utf8(stableStringify(document.state.interviews)));payloads.set("domains/scope.json",utf8(stableStringify(requireScope(document))));payloads.set("domains/reviews-actions.json",utf8(stableStringify(document.state.reviews_actions)));payloads.set("history/events.ndjson",utf8(`${document.history.map(event=>JSON.stringify(event)).join("\n")}\n`));payloads.set("history/checkpoints.json",utf8(stableStringify(document.checkpoints)));payloads.set("compatibility/current-registry.json",utf8(stableStringify(window.__L2G_CONTRACT_REGISTRY__)));
    const records:IntegrityRecord["entries"]=[];for(const [path,data] of [...payloads.entries()].sort(([left],[right])=>left.localeCompare(right))){if(data.length>V06_MAX_ENTRY_BYTES)throw new Error(`${path} exceeds the inherited archive entry limit.`);records.push({path,sha256:await sha256Hex(data),size:data.length});}payloads.set("integrity/sha256-manifest.json",utf8(stableStringify({algorithm:"SHA-256",entries:records} satisfies IntegrityRecord)));const bytes=createStoredZip([...payloads.entries()].map(([path,data])=>({path,data})));if(bytes.length>V06_MAX_EXPANDED_BYTES)throw new Error("Project exceeds the inherited expanded-project limit.");return bytes;
  }

  async function validateV06Integrity(entries:Map<string,Uint8Array>):Promise<void> {
    const integrity=parseEntry<IntegrityRecord>(entries,"integrity/sha256-manifest.json");if(!isRecord(integrity)||integrity.algorithm!=="SHA-256"||!Array.isArray(integrity.entries))throw new Error("Integrity manifest is invalid.");const expected=V06_PATHS.filter(path=>path!=="integrity/sha256-manifest.json").sort(),covered=integrity.entries.map(item=>item.path).sort();if(!samePaths(covered,expected))throw new Error("Integrity manifest does not cover the exact v0.6 project payload set.");for(const record of integrity.entries){if(!isRecord(record)||typeof record.path!=="string"||typeof record.sha256!=="string"||typeof record.size!=="number")throw new Error("Integrity record is invalid.");const payload=entries.get(record.path);if(!payload||payload.length!==record.size||await sha256Hex(payload)!==record.sha256)throw new Error(`Integrity validation failed: ${record.path}`);}
  }
  function checkpointWithScope(checkpoint:Checkpoint,scope:ScopeDomain):Checkpoint { const clone=deepClone(checkpoint);clone.state.scope=deepClone(scope);return clone; }

  async function deserializeV06Project(bytes:Uint8Array,allowLegacy=true):Promise<{document:ProjectDocument;legacy:boolean}> {
    const entries=readStoredZip(bytes),map=new Map(entries.map(entry=>[entry.path,entry.data] as const)),paths=[...map.keys()].sort();
    if(!samePaths(paths,V06_PATHS)){
      if(!allowLegacy)throw new Error("Earlier project shape is not accepted here.");const releaseVersion=window.__L2G_RELEASE__.version;
      try{window.__L2G_RELEASE__.version="0.5.0";const prior=await V06_V05_DESERIALIZE(bytes,true);const document=prior.document,timestamp=nowIso(),scope=emptyScopeDomain(timestamp);document.state.scope=scope;document.manifest.application={name:"L2G Integrated Suite",version:releaseVersion,product_runtime_compatibility_baseline:window.__L2G_RELEASE__.product_runtime_compatibility_baseline};document.manifest.domain_index=deepClone(V06_DOMAINS);document.checkpoints=document.checkpoints.slice(-19).map(checkpoint=>checkpointWithScope(checkpoint,scope));document.checkpoints.push({checkpoint_id:newId("checkpoint"),name:"Migration to v0.6 canonical Scope authority",created_at:timestamp,state:deepClone(document.state)});document.history.push({event_id:newId("event"),timestamp,profile:"advisor",action:"project.migrated-v06",object_type:"project",object_id:document.manifest.project_id,summary:"Migrated a valid earlier project into v0.6 with an empty Scope domain; no boundary, object, candidate, decision, diagram, category, disposition, responsibility, flow treatment, or conclusion was inferred.",transaction_id:newId("txn")});document.manifest.updated_at=timestamp;validateV06Project(document,true);return{document,legacy:true};}finally{window.__L2G_RELEASE__.version=releaseVersion;}
    }
    await validateV06Integrity(map);const manifest=parseEntry<ProjectManifest>(map,"manifest.json"),engagement=parseEntry<EngagementDomain>(map,"domains/engagement.json"),evidence=parseEntry<EvidenceDomain>(map,"domains/evidence-index.json"),pre=parseEntry<PreEngagementDomain>(map,"domains/pre-engagement.json"),interviews=parseEntry<InterviewSessionsDomain>(map,"domains/interview-sessions.json"),scope=parseEntry<ScopeDomain>(map,"domains/scope.json"),reviews=parseEntry<ReviewsActionsRecord>(map,"domains/reviews-actions.json"),checkpoints=parseEntry<Checkpoint[]>(map,"history/checkpoints.json");const history=decodeUtf8(zipEntry(map,"history/events.ndjson")).split(/\r?\n/).filter(Boolean).map((line,index)=>{try{return parseStrictJson(line) as HistoryEvent;}catch(error){throw new Error(`History line ${index+1} is invalid: ${errorMessage(error)}`);}});const registry=parseEntry<ContractRegistry>(map,"compatibility/current-registry.json");if(!isRecord(registry)||typeof registry.registry_version!=="string"||!Array.isArray(registry.contracts))throw new Error("Compatibility registry snapshot is invalid.");const document:ProjectDocument={manifest,state:{engagement,evidence,pre_engagement:pre,interviews,scope,reviews_actions:reviews,profile:"advisor",active_workspace:"overview",inspector_open:false,inspector_pinned:false,rail_collapsed:false},history,checkpoints};let legacy=false;if(manifest.application.version!==window.__L2G_RELEASE__.version){manifest.application={name:"L2G Integrated Suite",version:window.__L2G_RELEASE__.version,product_runtime_compatibility_baseline:window.__L2G_RELEASE__.product_runtime_compatibility_baseline};manifest.updated_at=nowIso();legacy=true;}validateV06Project(document,true);return{document,legacy};
  }

  class V06Store {
    private value:ProjectDocument;private undoItems:ProjectDocument[]=[];private redoItems:ProjectDocument[]=[];private listeners=new Set<()=>void>();migrationNotice="";
    constructor(initial=createV06Project()){validateV06Project(initial,true);this.value=deepClone(initial);}
    get document():ProjectDocument{return this.value;}get canUndo():boolean{return this.undoItems.length>0;}get canRedo():boolean{return this.redoItems.length>0;}
    subscribe(listener:()=>void):()=>void{this.listeners.add(listener);return()=>this.listeners.delete(listener);}private emit():void{for(const listener of this.listeners)listener();}
    replace(document:ProjectDocument,migrated=false):void{validateV06Project(document,true);this.value=deepClone(document);this.undoItems=[];this.redoItems=[];this.migrationNotice=migrated?"Earlier project migrated to v0.6. Save a new encrypted v0.6 project file.":"";this.emit();}
    reset():void{this.replace(createV06Project());}
    execute(action:string,objectType:string,objectId:string,summary:string,mutator:(document:ProjectDocument)=>void,checkpointName?:string):void{const before=deepClone(this.value),next=deepClone(this.value);mutator(next);next.manifest.updated_at=nowIso();next.history.push({event_id:newId("event"),timestamp:nowIso(),profile:next.state.profile,action,object_type:objectType,object_id:objectId,summary:sanitizePlainText(summary,500),transaction_id:newId("txn")});if(checkpointName){next.checkpoints.push({checkpoint_id:newId("checkpoint"),name:sanitizePlainText(checkpointName,120),created_at:nowIso(),state:deepClone(next.state)});if(next.checkpoints.length>20)next.checkpoints.shift();}validateV06Project(next,true);this.undoItems.push(before);if(this.undoItems.length>50)this.undoItems.shift();this.redoItems=[];this.value=next;this.migrationNotice="";this.emit();}
    undo():void{const previous=this.undoItems.pop();if(!previous)return;const current=deepClone(this.value),restored=deepClone(previous);restored.history=deepClone(current.history);restored.history.push({event_id:newId("event"),timestamp:nowIso(),profile:current.state.profile,action:"history.undo",object_type:"project",object_id:current.manifest.project_id,summary:"Undid the latest governed project command while preserving audit history.",transaction_id:newId("txn")});restored.manifest.updated_at=nowIso();validateV06Project(restored,true);this.redoItems.push(current);this.value=restored;this.emit();}
    redo():void{const next=this.redoItems.pop();if(!next)return;const current=deepClone(this.value),restored=deepClone(next);restored.history=deepClone(current.history);restored.history.push({event_id:newId("event"),timestamp:nowIso(),profile:current.state.profile,action:"history.redo",object_type:"project",object_id:current.manifest.project_id,summary:"Redid the latest governed project command while preserving audit history.",transaction_id:newId("txn")});restored.manifest.updated_at=nowIso();validateV06Project(restored,true);this.undoItems.push(current);this.value=restored;this.emit();}
    restoreCheckpoint(id:string):void{const checkpoint=this.value.checkpoints.find(item=>item.checkpoint_id===id);if(!checkpoint)throw new Error("Checkpoint not found.");this.execute("checkpoint.restored","checkpoint",id,`Restored checkpoint ${checkpoint.name}.`,document=>{document.state=deepClone(checkpoint.state);});}
  }

  const v06Namespace=(globalThis as unknown as {L2G:Record<string,unknown>}).L2G;
  v06Namespace.createNewProject=createV06Project;v06Namespace.validateProjectDocument=validateV06Project;v06Namespace.serializeInnerProject=serializeV06Project;v06Namespace.deserializeInnerProject=deserializeV06Project;v06Namespace.ProjectStore=V06Store;
}
