namespace L2G {
  const V05_CREATE_PROJECT = createNewProject;
  const V05_SERIALIZE_PROJECT = serializeInnerProject;
  const V05_DESERIALIZE_PROJECT = deserializeInnerProject;
  const V05_VALIDATE_PROJECT = validateProjectDocument;
  const V05_PROJECT_STORE = ProjectStore;
  void V05_CREATE_PROJECT; void V05_SERIALIZE_PROJECT; void V05_PROJECT_STORE;

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
  const V05_SHAPE_PATHS = V06_PATHS.filter(path => path !== "domains/scope.json");
  const V06_EXPECTED_DOMAINS = [
    { path:"domains/engagement.json", schema:"l2g_engagement_v1", authority:"Engagement" },
    { path:"domains/evidence-index.json", schema:"l2g_evidence_index_v1", authority:"Evidence" },
    { path:"domains/pre-engagement.json", schema:PRE_ENGAGEMENT_SCHEMA_KIND, authority:"Pre-Engagement" },
    { path:"domains/interview-sessions.json", schema:INTERVIEW_SCHEMA_KIND, authority:"Interview Sessions" },
    { path:"domains/scope.json", schema:SCOPE_SCHEMA_KIND, authority:"Scope" },
    { path:"domains/reviews-actions.json", schema:"reviews_actions_v1", authority:"Reviews & Actions" }
  ];
  const V05_EXPECTED_DOMAINS = V06_EXPECTED_DOMAINS.filter(item => item.path !== "domains/scope.json");

  function v06CreateNewProject(): ProjectDocument {
    const timestamp=nowIso();
    const document=V05_CREATE_PROJECT();
    document.manifest.application={name:"L2G Integrated Suite",version:window.__L2G_RELEASE__.version,product_runtime_compatibility_baseline:window.__L2G_RELEASE__.product_runtime_compatibility_baseline};
    document.manifest.domain_index=deepClone(V06_EXPECTED_DOMAINS);
    document.state.scope=createSyntheticScope(timestamp);
    document.history=[{event_id:newId("event"),timestamp,profile:"advisor",action:"project.created",object_type:"project",object_id:document.manifest.project_id,summary:"Created a synthetic v0.6 canonical Scope project.",transaction_id:newId("txn")}];
    document.checkpoints=[];
    v06ValidateProjectDocument(document,true);
    return document;
  }

  function stripScopeForV05(document:ProjectDocument):ProjectDocument {
    const clone=deepClone(document);
    delete (clone.state as unknown as Record<string,unknown>).scope;
    clone.manifest.domain_index=deepClone(V05_EXPECTED_DOMAINS);
    clone.checkpoints=clone.checkpoints.map(checkpoint=>{const item=deepClone(checkpoint);delete (item.state as unknown as Record<string,unknown>).scope;return item;});
    return clone;
  }

  function v06ValidateProjectDocument(document:ProjectDocument,requireEncrypted:boolean):void {
    if(!isRecord(document)||!isRecord(document.state)||!isRecord(document.manifest))throw new Error("Project document is invalid.");
    assertExactObjectKeys(document,["manifest","state","history","checkpoints"],"Project document");
    assertExactObjectKeys(document.state,["engagement","evidence","pre_engagement","interviews","scope","reviews_actions","profile","active_workspace","inspector_open","inspector_pinned","rail_collapsed"],"Project state");
    if(stableStringify(document.manifest.domain_index,0)!==stableStringify(V06_EXPECTED_DOMAINS,0))throw new Error("Project domain index does not match the v0.6 authority set.");
    V05_VALIDATE_PROJECT(stripScopeForV05(document),requireEncrypted);
    validateScopeDomain(document.state.scope);
    if(document.checkpoints.length>20)throw new Error("Project exceeds the inherited checkpoint limit.");
    for(const checkpoint of document.checkpoints)validateScopeDomain(checkpoint.state.scope);
  }

  async function v06SerializeInnerProject(document:ProjectDocument):Promise<Uint8Array> {
    v06ValidateProjectDocument(document,true);
    const payloads=new Map<string,Uint8Array>();
    payloads.set("manifest.json",utf8(stableStringify(document.manifest)));
    payloads.set("domains/engagement.json",utf8(stableStringify(document.state.engagement)));
    payloads.set("domains/evidence-index.json",utf8(stableStringify(document.state.evidence)));
    payloads.set("domains/pre-engagement.json",utf8(stableStringify(document.state.pre_engagement)));
    payloads.set("domains/interview-sessions.json",utf8(stableStringify(document.state.interviews)));
    payloads.set("domains/scope.json",utf8(stableStringify(document.state.scope)));
    payloads.set("domains/reviews-actions.json",utf8(stableStringify(document.state.reviews_actions)));
    payloads.set("history/events.ndjson",utf8(`${document.history.map(event=>JSON.stringify(event)).join("\n")}\n`));
    payloads.set("history/checkpoints.json",utf8(stableStringify(document.checkpoints)));
    payloads.set("compatibility/current-registry.json",utf8(stableStringify(window.__L2G_CONTRACT_REGISTRY__)));
    const entries:IntegrityRecord["entries"]=[];
    for(const [path,data] of [...payloads.entries()].sort(([left],[right])=>left.localeCompare(right))){if(data.length>ARCHIVE_LIMITS.maxEntryBytes)throw new Error(`${path} exceeds the inherited archive entry limit.`);entries.push({path,sha256:await sha256Hex(data),size:data.length});}
    payloads.set("integrity/sha256-manifest.json",utf8(stableStringify({algorithm:"SHA-256",entries} satisfies IntegrityRecord)));
    const zip=createStoredZip([...payloads.entries()].map(([path,data])=>({path,data})));
    if(zip.length>ARCHIVE_LIMITS.maxExpandedBytes)throw new Error("Project exceeds the inherited expanded-project limit.");
    return zip;
  }

  function v06SamePaths(actual:string[],expected:string[]):boolean {const wanted=[...expected].sort();return actual.length===wanted.length&&actual.every((value,index)=>value===wanted[index]);}
  function v06Entry(entries:Map<string,Uint8Array>,path:string):Uint8Array {const value=entries.get(path);if(!value)throw new Error(`Missing project entry: ${path}`);return value;}
  function v06ParseEntry<T>(entries:Map<string,Uint8Array>,path:string):T{return parseStrictJson(decodeUtf8(v06Entry(entries,path))) as T;}
  async function v06ValidateIntegrity(entries:Map<string,Uint8Array>):Promise<void>{const integrity=v06ParseEntry<IntegrityRecord>(entries,"integrity/sha256-manifest.json");if(!isRecord(integrity)||integrity.algorithm!=="SHA-256"||!Array.isArray(integrity.entries))throw new Error("Integrity manifest is invalid.");const expected=V06_PATHS.filter(path=>path!=="integrity/sha256-manifest.json").sort();const covered=integrity.entries.map(item=>item.path).sort();if(!v06SamePaths(covered,expected))throw new Error("Integrity manifest does not cover the exact v0.6 project payload set.");for(const record of integrity.entries){if(!isRecord(record)||typeof record.path!=="string"||typeof record.sha256!=="string"||typeof record.size!=="number")throw new Error("Integrity record is invalid.");const payload=entries.get(record.path);if(!payload||payload.length!==record.size||await sha256Hex(payload)!==record.sha256)throw new Error(`Integrity validation failed: ${record.path}`);}}

  function v06MigrateCheckpoint(checkpoint:Checkpoint,scope:ScopeDomain):Checkpoint {const clone=deepClone(checkpoint);clone.state.scope=isRecord((clone.state as unknown as Record<string,unknown>).scope)?(clone.state as unknown as {scope:ScopeDomain}).scope:deepClone(scope);return clone;}
  async function v06DeserializeInnerProject(bytes:Uint8Array,allowLegacy=true):Promise<{document:ProjectDocument;legacy:boolean}> {
    const entries=readStoredZip(bytes);const map=new Map(entries.map(entry=>[entry.path,entry.data] as const));const paths=[...map.keys()].sort();
    if(!v06SamePaths(paths,V06_PATHS)){
      if(!allowLegacy)throw new Error("Earlier project shape is not accepted here.");
      const originalVersion=window.__L2G_RELEASE__.version;
      try{window.__L2G_RELEASE__.version="0.5.0";const result=await V05_DESERIALIZE_PROJECT(bytes,true);const document=result.document;const timestamp=nowIso();document.state.scope=emptyScopeDomain(timestamp);document.manifest.application={name:"L2G Integrated Suite",version:originalVersion,product_runtime_compatibility_baseline:window.__L2G_RELEASE__.product_runtime_compatibility_baseline};document.manifest.domain_index=deepClone(V06_EXPECTED_DOMAINS);document.checkpoints=document.checkpoints.map(checkpoint=>v06MigrateCheckpoint(checkpoint,document.state.scope)).slice(-19);const checkpoint:Checkpoint={checkpoint_id:newId("checkpoint"),name:"Migration to v0.6 canonical Scope authority",created_at:timestamp,state:deepClone(document.state)};document.checkpoints.push(checkpoint);document.history.push({event_id:newId("event"),timestamp,profile:"advisor",action:"project.migrated-v06",object_type:"project",object_id:document.manifest.project_id,summary:"Migrated a valid earlier project into v0.6 with an empty Scope domain; no boundary, object, candidate, decision, diagram, category, disposition, responsibility, flow treatment, or conclusion was inferred.",transaction_id:newId("txn")});document.manifest.updated_at=timestamp;v06ValidateProjectDocument(document,true);return{document,legacy:true};}finally{window.__L2G_RELEASE__.version=originalVersion;}
    }
    await v06ValidateIntegrity(map);
    const manifest=v06ParseEntry<ProjectManifest>(map,"manifest.json");const engagement=v06ParseEntry<EngagementDomain>(map,"domains/engagement.json");const evidence=v06ParseEntry<EvidenceDomain>(map,"domains/evidence-index.json");const pre=v06ParseEntry<PreEngagementDomain>(map,"domains/pre-engagement.json");const interviews=v06ParseEntry<InterviewSessionsDomain>(map,"domains/interview-sessions.json");const scope=v06ParseEntry<ScopeDomain>(map,"domains/scope.json");const reviews=v06ParseEntry<ReviewsActionsRecord>(map,"domains/reviews-actions.json");const checkpoints=v06ParseEntry<Checkpoint[]>(map,"history/checkpoints.json");const historyText=decodeUtf8(v06Entry(map,"history/events.ndjson"));const history=historyText.split(/\r?\n/).filter(Boolean).map((line,index)=>{try{return parseStrictJson(line) as HistoryEvent;}catch(error){throw new Error(`History line ${index+1} is invalid: ${errorMessage(error)}`);}});const registry=v06ParseEntry<ContractRegistry>(map,"compatibility/current-registry.json");if(!isRecord(registry)||typeof registry.registry_version!=="string"||!Array.isArray(registry.contracts))throw new Error("Compatibility registry snapshot is invalid.");const document:ProjectDocument={manifest,state:{engagement,evidence,pre_engagement:pre,interviews,scope,reviews_actions:reviews,profile:"advisor",active_workspace:"overview",inspector_open:false,inspector_pinned:false,rail_collapsed:false},history,checkpoints};let legacy=false;if(manifest.application.version!==window.__L2G_RELEASE__.version){manifest.application={name:"L2G Integrated Suite",version:window.__L2G_RELEASE__.version,product_runtime_compatibility_baseline:window.__L2G_RELEASE__.product_runtime_compatibility_baseline};manifest.updated_at=nowIso();legacy=true;}v06ValidateProjectDocument(document,true);return{document,legacy};
  }

  class V06ProjectStore {
    private documentValue:ProjectDocument;
    private undoStack:ProjectDocument[]=[];
    private redoStack:ProjectDocument[]=[];
    private listeners=new Set<()=>void>();
    migrationNotice="";
    constructor(initial=v06CreateNewProject()){v06ValidateProjectDocument(initial,true);this.documentValue=deepClone(initial);}
    get document():ProjectDocument{return this.documentValue;}
    get canUndo():boolean{return this.undoStack.length>0;}
    get canRedo():boolean{return this.redoStack.length>0;}
    subscribe(listener:()=>void):()=>void{this.listeners.add(listener);return()=>this.listeners.delete(listener);}
    private emit():void{for(const listener of this.listeners)listener();}
    replace(document:ProjectDocument,migrated=false):void{v06ValidateProjectDocument(document,true);this.documentValue=deepClone(document);this.undoStack=[];this.redoStack=[];this.migrationNotice=migrated?"Earlier project migrated to v0.6. Save a new encrypted v0.6 project file.":"";this.emit();}
    reset():void{this.replace(v06CreateNewProject());}
    execute(action:string,objectType:string,objectId:string,summary:string,mutator:(document:ProjectDocument)=>void,checkpointName?:string):void{const before=deepClone(this.documentValue);const next=deepClone(this.documentValue);mutator(next);next.manifest.updated_at=nowIso();const event:HistoryEvent={event_id:newId("event"),timestamp:nowIso(),profile:next.state.profile,action,object_type:objectType,object_id:objectId,summary:sanitizePlainText(summary,500),transaction_id:newId("txn")};next.history.push(event);if(checkpointName){next.checkpoints.push({checkpoint_id:newId("checkpoint"),name:sanitizePlainText(checkpointName,120),created_at:nowIso(),state:deepClone(next.state)});if(next.checkpoints.length>20)next.checkpoints.shift();}v06ValidateProjectDocument(next,true);this.undoStack.push(before);if(this.undoStack.length>50)this.undoStack.shift();this.redoStack=[];this.documentValue=next;this.migrationNotice="";this.emit();}
    undo():void{const previous=this.undoStack.pop();if(!previous)return;const current=deepClone(this.documentValue);const restored=deepClone(previous);restored.history=deepClone(current.history);restored.history.push({event_id:newId("event"),timestamp:nowIso(),profile:current.state.profile,action:"history.undo",object_type:"project",object_id:current.manifest.project_id,summary:"Undid the latest governed project command while preserving audit history.",transaction_id:newId("txn")});restored.manifest.updated_at=nowIso();v06ValidateProjectDocument(restored,true);this.redoStack.push(current);this.documentValue=restored;this.emit();}
    redo():void{const next=this.redoStack.pop();if(!next)return;const current=deepClone(this.documentValue);const restored=deepClone(next);restored.history=deepClone(current.history);restored.history.push({event_id:newId("event"),timestamp:nowIso(),profile:current.state.profile,action:"history.redo",object_type:"project",object_id:current.manifest.project_id,summary:"Redid the latest governed project command while preserving audit history.",transaction_id:newId("txn")});restored.manifest.updated_at=nowIso();v06ValidateProjectDocument(restored,true);this.undoStack.push(current);this.documentValue=restored;this.emit();}
    restoreCheckpoint(checkpointId:string):void{const checkpoint=this.documentValue.checkpoints.find(item=>item.checkpoint_id===checkpointId);if(!checkpoint)throw new Error("Checkpoint not found.");this.execute("checkpoint.restored","checkpoint",checkpointId,`Restored checkpoint ${checkpoint.name}.`,document=>{document.state=deepClone(checkpoint.state);});}
  }

  const scopeNamespace=(globalThis as unknown as {L2G:Record<string,unknown>}).L2G;
  scopeNamespace.createNewProject=v06CreateNewProject;
  scopeNamespace.validateProjectDocument=v06ValidateProjectDocument;
  scopeNamespace.serializeInnerProject=v06SerializeInnerProject;
  scopeNamespace.deserializeInnerProject=v06DeserializeInnerProject;
  scopeNamespace.ProjectStore=V06ProjectStore;
}
