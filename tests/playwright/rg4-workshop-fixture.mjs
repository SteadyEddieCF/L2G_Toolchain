export async function seedWorkshopV79(page) {
  return page.evaluate(() => {

  const fixed='2026-07-31T18:30:00.000Z';
  const RealDate=Date;
  window.Date=class extends RealDate {
    constructor(...args){ super(...(args.length?args:[fixed])); }
    static now(){ return new RealDate(fixed).getTime(); }
  };
  state.setup={...state.setup,
    orgName:'RG4 Synthetic Organization',
    envName:'RG4 Validation Enclave',
    systemName:'RG4 Synthetic System',
    advisor:'Synthetic Advisor',
    workshopDate:'2026-07-31',
    target:'CMMC Level 2',
    phase:'RG-4 final regression',
    provider1:'Synthetic Cloud Provider',
    provider2:'Synthetic Managed Service Provider',
    caveats:'Synthetic de-identified regression data only.',
    docs:'RG4 synthetic policy; RG4 synthetic evidence index',
    providerDependencies:'Synthetic provider evidence and tenant configuration validation.',
    clientPOC:'Synthetic Client POC',
    securityLead:'Synthetic Security Lead',
    targetReadinessDate:'2026-12-15',
    evidenceDueDate:'2026-09-30'
  };
  const readiness=['Ready for Workbook Review','Hold - Client Validation Needed','Hold - Provider/MSP Validation Needed','Gap / Needs Action'];
  const evidence=['Received','Requested','Partially Received','Not Requested'];
  PRACTICES.forEach((p,i)=>{
    const s=state.practices[p.id];
    s.implementationOwner=i%3===0?'CLIENT':(i%3===1?'PROVIDER1':'SHARED');
    s.evidenceOwner=i%2===0?'CLIENT':'PROVIDER1';
    s.readiness=readiness[i%readiness.length];
    s.evidenceStatus=evidence[i%evidence.length];
    s.confidence=i%2===0?'Medium':'Low';
    s.validationBasis=i%2===0?'Document Content Reviewed':'Client Stated';
    s.workbookStatus='Not Imported';
    s.workbookValidation='Not Imported';
    s.workbookFinding=`RG4 deterministic finding for ${p.id}.`;
    s.workbookEvidenceSummary=`RG4-EVID-${String(i+1).padStart(3,'0')} evidence reference.`;
    s.workbookCadence='Quarterly and event-driven';
    s.workbookTrigger='Material system, role, or provider change';
    s.workbookEvidenceWindow='Prior 12 months';
    s.workbookPOAM=i%4===3?`RG4-POAM-${String(i+1).padStart(3,'0')}`:'';
    s.workbookQuestions=`Confirm implementation and operating evidence for ${p.id}.`;
    s.workbookSSP=`Synthetic SSP narrative candidate for ${p.id}; advisor review required.`;
    s.workbookNotes=`RG4 synthetic workbook note for ${p.id}.`;
    s.workbookLastSync='';
    s.notes=`RG4 synthetic workshop note for ${p.id}. ${i===0?'<script>window.__RG4_INJECTED__=true</script>':''}`;
  });
  Object.values(state.objectiveReviews||{}).forEach((r)=>{r.last_updated=fixed;});
  state.documents=[{
    id:'doc-rg4-001',name:'RG4_Synthetic_Policy.pdf',type:'Policy',version:'1.0',
    date:'2026-07-01',owner:'CLIENT',status:'Reviewed',reviewBasis:'Document Content Reviewed',
    usedInWorkshop:true,usedInIntake:true,supports:'AC;IA;CM',notes:'Synthetic source document for regression only.'
  },{
    id:'doc-rg4-002',name:'RG4_Provider_Evidence_Index.xlsx',type:'Evidence Index',version:'2.0',
    date:'2026-07-15',owner:'PROVIDER1',status:'Reviewed',reviewBasis:'Spreadsheet / Artifact Reviewed',
    usedInWorkshop:true,usedInIntake:false,supports:'AU;SC;SI',notes:'Synthetic provider evidence index.'
  }];
  state.decisions=[{
    id:'dec-rg4-001',topic:'RG-4 validation boundary',statement:'Preserve Workshop-authored meaning and frozen package contracts.',
    owner:'Synthetic Advisor',status:'Accepted',date:'2026-07-31',notes:'Regression-only decision.'
  }];
  state.actionRegister.actions=[{
    action_id:'action-rg4-001',practice_id:PRACTICES[0].id,title:'Collect synthetic provider evidence',
    description:'Request deterministic synthetic evidence for regression.',owner:'Synthetic Evidence Owner',
    due_date:'2026-09-30',status:'Open',blocker:'Awaiting provider response',source:'RG-4 synthetic fixture',
    created_at:fixed,updated_at:fixed
  }];
  state.actionRegister.last_updated=fixed;
  state.evidenceOwnershipV77.accepted_records=[{
    ownership_id:'ownership-rg4-001',candidate_id:'candidate-rg4-001',practice_id:PRACTICES[0].id,
    objective_id:'AC.L2-3.1.1[a]',evidence_category:'provider-produced',
    owner:'Synthetic Cloud Provider',provider:'Synthetic Cloud Provider',
    state:'accepted',accepted_at:fixed,accepted_by:'Synthetic Advisor',
    source_record_id:'source-rg4-001',source_fingerprint:'sha256:'+ 'a'.repeat(64),
    contract_validation:'Needs validation',access_limitation:'Client tenant export required.',
    advisor_notes:'Synthetic internal note.'
  }];
  state.evidenceOwnershipV77.requests=[{
    request_id:'request-rg4-001',ownership_id:'ownership-rg4-001',practice_id:PRACTICES[0].id,
    audience:'provider',state:'requested',owner:'Synthetic Cloud Provider',due_date:'2026-09-30',
    requested_at:fixed,request_text:'Provide synthetic tenant configuration export.'
  }];
  state.evidenceOwnershipV77.provider_followups=[{
    followup_id:'followup-rg4-001',request_id:'request-rg4-001',practice_id:PRACTICES[0].id,
    provider:'Synthetic Cloud Provider',state:'open',owner:'Synthetic Advisor',due_date:'2026-10-07',
    created_at:fixed,notes:'Synthetic provider follow-up.'
  }];
  state.evidenceOwnershipV77.last_generated_at=fixed;
  state.evidenceOwnershipV77.history=[];
  state.evidenceOwnershipV77.undo_stack=[];
  state.evidenceOwnershipV77.redo_stack=[];
  state.reportingV78.snapshots=[];
  state.workbookGovernanceV68={...state.workbookGovernanceV68,exports:[],imports:[],change_sets:[],last_updated:''};
  state.sspHandoffGovernanceV70={...state.sspHandoffGovernanceV70,exports:[],last_preview:null,last_updated:''};
  state.sspReturnGovernanceV71={...state.sspReturnGovernanceV71,imports:[],change_sets:[],rejections:[],last_preview:null,last_applied_at:'',undo_snapshot:null,last_updated:''};
  state.v59Workspace = {
    workspace_id:'ws_rg4_validation_001',
    created_at:fixed,
    last_saved_at:fixed,
    last_export_at:fixed,
    last_active_tab:'evidence',
    last_practice_id:PRACTICES[0].id,
    last_render_ms:0,
    events:[],
    acknowledged_conflicts:[],
    ui:{minimal_scrollbars:false,reduced_motion:false,compact_density:false}
  };
  return l2gWorkbookHandoffPackage();

  });
}

export async function setFixedClock(page, fixed = '2026-07-31T18:15:00.000Z') {
  await page.evaluate((iso) => {
    const NativeDate = window.Date;
    const fixedMs = NativeDate.parse(iso);
    class FixedDate extends NativeDate {
      constructor(...args) { super(...(args.length ? args : [iso])); }
      static now() { return fixedMs; }
      static parse(value) { return NativeDate.parse(value); }
      static UTC(...args) { return NativeDate.UTC(...args); }
    }
    window.Date = FixedDate;
    Math.random = () => 0.123456789;
  }, fixed);
}

export function sortJsonValue(value) {
  if (Array.isArray(value)) return value.map(sortJsonValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortJsonValue(value[key])]));
  }
  return value;
}

export function stableJson(value) {
  return JSON.stringify(sortJsonValue(value), null, 2);
}
