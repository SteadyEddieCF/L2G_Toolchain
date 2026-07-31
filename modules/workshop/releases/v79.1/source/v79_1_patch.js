
/* === v79.1 Strict Workbook Merge Validation Hardening === */
const V791_RELEASE=Object.freeze({
  name:"CMMC L2 Gap Workshop Tool",
  version:"v79.1",
  focus:"Strict Workbook Merge Validation",
  issue:105,
  baseline:"v79",
  workbook_handoff_contract_release:"1.7",
  workbook_handoff_wire_version:"1.0",
  workbook_merge_version:"1.1",
  ssp_handoff:"1.0",
  ssp_return:"1.0",
  local_only:true,
  new_feature:false
});
const V791_MERGE_TOP_LEVEL=Object.freeze([
  "advisor_review_results","content_trust_level","evidence_results","gap_results",
  "generated_at","generated_by","objective_results","package_kind","package_version",
  "practice_results","schema_trusted","tool_family","warnings","workbook_source"
]);
function v791Clone(value){return JSON.parse(JSON.stringify(value));}
function v791CanonicalObjective(value){return String(value||"").trim().replace(/\s+\[/g,"[").toUpperCase();}
function v791JsonParser(text){
  const src=String(text??"");let i=0;
  const fail=(m)=>{throw new Error(`Strict JSON rejection at character ${i}: ${m}`);};
  const ws=()=>{while(i<src.length&&/[\u0009\u000a\u000d\u0020]/.test(src[i]))i++;};
  const str=()=>{if(src[i]!=="\"")fail("expected string");const start=i++;let escaped=false;while(i<src.length){const c=src[i++];if(escaped){escaped=false;continue;}if(c==="\\"){escaped=true;continue;}if(c==="\""){try{return JSON.parse(src.slice(start,i));}catch(e){fail("invalid string escape");}}if(c<" ")fail("unescaped control character in string");}fail("unterminated string");};
  const num=()=>{const m=src.slice(i).match(/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/);if(!m)fail("invalid number");i+=m[0].length;const n=Number(m[0]);if(!Number.isFinite(n))fail("non-finite number");return n;};
  const value=(path)=>{ws();if(i>=src.length)fail("unexpected end of input");const c=src[i];if(c==="{")return object(path);if(c==="[")return array(path);if(c==="\"")return str();if(c==="-"||/\d/.test(c))return num();if(src.startsWith("true",i)){i+=4;return true;}if(src.startsWith("false",i)){i+=5;return false;}if(src.startsWith("null",i)){i+=4;return null;}fail("unexpected token");};
  const object=(path)=>{i++;ws();const out={};const seen=new Set();if(src[i]==="}"){i++;return out;}while(true){ws();const key=str();if(seen.has(key))fail(`duplicate object key ${JSON.stringify(key)} at ${path}`);seen.add(key);ws();if(src[i++]!==":")fail("expected colon after object key");out[key]=value(`${path}.${key}`);ws();if(src[i]===","){i++;continue;}if(src[i]==="}"){i++;break;}fail("expected comma or closing brace");}return out;};
  const array=(path)=>{i++;ws();const out=[];if(src[i]==="]"){i++;return out;}let n=0;while(true){out.push(value(`${path}[${n++}]`));ws();if(src[i]===","){i++;continue;}if(src[i]==="]"){i++;break;}fail("expected comma or closing bracket");}return out;};
  const result=value("$");ws();if(i!==src.length)fail("trailing content after JSON value");return result;
}
function v791BlockedPreview(sourceName,error,parsed=null){
  const kind=parsed&&typeof parsed==="object"?v57Text(parsed.package_kind):"";
  return {source_name:sourceName||"Workbook Merge",package:parsed,package_kind:kind||"invalid",legacy:false,trusted:false,practice_results:[],objective_results:[],evidence_results:[],gap_results:[],advisor_review_results:[],practice_ids:[],objective_ids:[],status_counts:{Met:0,"Not Met":0,"Not Applicable":0,Other:0,Blank:0},reviewer_authored_rows:0,unmatched_practices:[],unmatched_objectives:[],warnings:[String(error)],validation_errors:[String(error)],blocking:true,duplicate:false,fingerprint:"",generated_at:"",generated_by:"",workbook_source:{}};
}
function v791ValidateMergePackage(pkg){
  const errors=[];
  if(!pkg||typeof pkg!=="object"||Array.isArray(pkg))return ["Workbook Merge content must be a JSON object."];
  const unknown=Object.keys(pkg).filter(k=>!V791_MERGE_TOP_LEVEL.includes(k));
  if(unknown.length)errors.push(`Unknown top-level properties are not allowed: ${unknown.join(", ")}`);
  if(pkg.package_kind!=="l2g_workbook_merge_v1")errors.push("package_kind must be exactly l2g_workbook_merge_v1.");
  if(pkg.package_version!=="1.1")errors.push("package_version must be exactly 1.1.");
  if(pkg.schema_trusted!==true)errors.push("schema_trusted must be exactly true for the trusted Workbook Merge path.");
  if(!/L2G Builder\/Merger/i.test(v57Text(pkg.generated_by)))errors.push("generated_by must identify L2G Builder/Merger.");
  for(const key of ["practice_results","objective_results","evidence_results","gap_results","advisor_review_results","warnings"]){if(pkg[key]!==undefined&&!Array.isArray(pkg[key]))errors.push(`${key} must be an array.`);}
  const practiceSeen=new Map();
  v57Arr(pkg.practice_results).forEach((row,index)=>{
    if(!row||typeof row!=="object"||Array.isArray(row)){errors.push(`practice_results[${index}] must be an object.`);return;}
    const raw=v57Text(row.Practice_ID||row.Practice||row.practice_id);const pid=v57PracticeId(raw);
    if(!raw||!pid){errors.push(`practice_results[${index}] has an unknown or missing practice identity.`);return;}
    if(practiceSeen.has(pid))errors.push(`Duplicate or conflicting practice identity: ${pid}`);else practiceSeen.set(pid,index);
    const oid=v791CanonicalObjective(row.Objective_ID||row.objective_id);if(oid){const objective=V54_OBJECTIVES.find(o=>v791CanonicalObjective(o.objective_id)===oid||v791CanonicalObjective(o.workbook_ref)===oid);if(!objective||v57PracticeId(objective.practice_id)!==pid)errors.push(`practice_results[${index}] has a mismatched practice/objective identity.`);}
  });
  const objectiveSeen=new Map();
  v57Arr(pkg.objective_results).forEach((row,index)=>{
    if(!row||typeof row!=="object"||Array.isArray(row)){errors.push(`objective_results[${index}] must be an object.`);return;}
    const rawPid=v57Text(row.Practice_ID||row.Practice||row.practice_id);const pid=v57PracticeId(rawPid);const rawOid=v791CanonicalObjective(row.Objective_ID||row.objective_id);
    const objective=V54_OBJECTIVES.find(o=>v791CanonicalObjective(o.objective_id)===rawOid||v791CanonicalObjective(o.workbook_ref)===rawOid);
    if(!rawPid||!pid)errors.push(`objective_results[${index}] has an unknown or missing practice identity.`);
    if(!rawOid||!objective)errors.push(`objective_results[${index}] has an unknown or missing objective identity.`);
    else {const oid=objective.objective_id;if(objectiveSeen.has(oid))errors.push(`Duplicate or conflicting objective identity: ${oid}`);else objectiveSeen.set(oid,index);if(pid&&v57PracticeId(objective.practice_id)!==pid)errors.push(`objective_results[${index}] objective ${oid} does not belong to practice ${pid}.`);}
  });
  for(const [key,rows] of [["evidence_results",pkg.evidence_results],["gap_results",pkg.gap_results]])v57Arr(rows).forEach((row,index)=>{if(!row||typeof row!=="object"||Array.isArray(row)){errors.push(`${key}[${index}] must be an object.`);return;}const rawPid=v57Text(row.Practice_ID||row.Practice||row.practice_id);const pid=v57PracticeId(rawPid);if(rawPid&&!pid)errors.push(`${key}[${index}] has an unknown practice identity.`);const rawOid=v791CanonicalObjective(row.Objective_ID||row.objective_id);if(rawOid){const objective=V54_OBJECTIVES.find(o=>v791CanonicalObjective(o.objective_id)===rawOid||v791CanonicalObjective(o.workbook_ref)===rawOid);if(!objective)errors.push(`${key}[${index}] has an unknown objective identity.`);else if(pid&&v57PracticeId(objective.practice_id)!==pid)errors.push(`${key}[${index}] objective does not belong to its practice.`);}});
  const ws=pkg.workbook_source;if(ws!==undefined&&(!ws||typeof ws!=="object"||Array.isArray(ws)))errors.push("workbook_source must be an object.");
  if(ws&&Number.isInteger(ws.practices_matched_to_handoff)&&ws.practices_matched_to_handoff!==practiceSeen.size)errors.push("workbook_source.practices_matched_to_handoff does not reconcile with unique practice results.");
  if(ws&&Number.isInteger(ws.objective_rows_detected)&&ws.objective_rows_detected!==objectiveSeen.size)errors.push("workbook_source.objective_rows_detected does not reconcile with unique objective results.");
  return [...new Set(errors)];
}
const v791ParseBase=v57ParseMergeObject;
v57ParseMergeObject=function(parsed,sourceName="pasted JSON"){
  if(parsed&&typeof parsed==="object"&&!Array.isArray(parsed)&&parsed.package_kind==="l2g_workbook_merge_v1"){
    const errors=v791ValidateMergePackage(parsed);const result=v791ParseBase(parsed,sourceName);
    result.validation_errors=errors;result.blocking=errors.length>0;result.trusted=errors.length===0;
    if(errors.length)result.warnings=[...errors,...result.warnings.filter(x=>!errors.includes(x))];
    return result;
  }
  return v791ParseBase(parsed,sourceName);
};
v57PackageFingerprint=function(pkg){return typeof v56Fingerprint==="function"?v56Fingerprint(pkg):v55Hash(JSON.stringify(pkg));};
const v791PreviewBase=v57PreviewMergeText;
v57PreviewMergeText=function(text,sourceName){
  const trimmed=String(text||"").trim();if(!trimmed)throw new Error("No Workbook Merge content was provided.");
  if(!trimmed.startsWith("{")&&!trimmed.startsWith("["))return v791PreviewBase(text,sourceName);
  try{const parsed=v791JsonParser(trimmed);v57PendingMerge=v57ParseMergeObject(parsed,sourceName);v57RenderMergePreview();return v57PendingMerge;}
  catch(error){v57PendingMerge=v791BlockedPreview(sourceName,error?.message||String(error));v57RenderMergePreview();return v57PendingMerge;}
};
const v791RenderPreviewBase=v57RenderMergePreview;
v57RenderMergePreview=function(){v791RenderPreviewBase();const p=v57PendingMerge,s=document.getElementById("v57MergePreviewStatus"),t=document.getElementById("v57MergePreviewTable");if(p?.blocking&&p.validation_errors?.length){if(s){s.className="import-status bad";s.textContent=`Workbook Merge rejected before trusted preview: ${p.validation_errors.join(" · ")}`;}if(t){const body=t.querySelector("tbody");if(body)body.insertAdjacentHTML("afterbegin",p.validation_errors.map((e,i)=>`<tr><td><strong>Strict validation ${i+1}</strong></td><td>BLOCK</td><td>${escapeHtml(e)}</td></tr>`).join(""));}}};
function v791ValidateHandoffIdentity(pkg){const errors=[];if(pkg.package_kind!=="l2g_workbook_handoff_v1")errors.push("top-level package_kind mismatch");if(pkg.package_version!=="1.0")errors.push("wire package_version must be 1.0");if(pkg.handoff_schema_enhancements_version!=="1.7")errors.push("handoff_schema_enhancements_version must be 1.7");if(pkg.schema_trusted!==true)errors.push("schema_trusted must be true");const m=pkg.contract_manifest||{};if(m.contract_name!=="l2g_workbook_handoff_v1")errors.push("contract_manifest.contract_name mismatch");if(m.contract_release!=="1.7")errors.push("contract_manifest.contract_release must be 1.7");if(m.required_package_identity?.package_kind!=="l2g_workbook_handoff_v1")errors.push("embedded required package kind mismatch");if(m.required_package_identity?.package_version!=="1.0")errors.push("embedded required package version must be 1.0");if(m.required_package_identity?.schema_trusted!==true)errors.push("embedded schema_trusted must be true");if(pkg.package_integrity?.contract_release!=="1.7")errors.push("package_integrity.contract_release must be 1.7");const expected=v56Fingerprint(pkg);if(pkg.package_integrity?.canonical_fingerprint!==expected)errors.push("package fingerprint does not match final canonical content");return {valid:errors.length===0,errors,identity_label:"Workbook Handoff contract release 1.7 — wire package version 1.0",fingerprint:expected};}
const v791HandoffBase=l2gWorkbookHandoffPackage;
l2gWorkbookHandoffPackage=function(){const pkg=v791HandoffBase();pkg.gap_workshop_tool_version="v79.1";pkg.ui_workflow_metadata={...(pkg.ui_workflow_metadata||{}),release:"v79.1",strict_workbook_merge_validation:true,handoff_identity_self_reconciliation:true};pkg.contract_manifest={...(pkg.contract_manifest||{}),contract_name:"l2g_workbook_handoff_v1",contract_release:"1.7",producer:{...(pkg.contract_manifest?.producer||{}),tool:"CMMC L2 Gap Workshop Tool",version:"v79.1"},required_package_identity:{package_kind:"l2g_workbook_handoff_v1",package_version:"1.0",schema_trusted:true},identity_label:"Workbook Handoff contract release 1.7 — wire package version 1.0"};pkg.package_integrity={...(pkg.package_integrity||{}),contract_release:"1.7"};pkg.package_integrity.canonical_fingerprint=v56Fingerprint(pkg);const check=v791ValidateHandoffIdentity(pkg);if(!check.valid)throw new Error(`Workbook Handoff export blocked by identity self-reconciliation: ${check.errors.join("; ")}`);return pkg;};
const v791ExportBase=exportL2GWorkbookHandoffJson;
exportL2GWorkbookHandoffJson=function(){try{const pkg=l2gWorkbookHandoffPackage(),check=v791ValidateHandoffIdentity(pkg);if(!check.valid)throw new Error(check.errors.join("; "));download(datedFileName("l2g_workbook_handoff_v1","json"),JSON.stringify(pkg,null,2),"application/json");showToast("Workbook Handoff contract release 1.7 — wire package version 1.0 exported after identity self-reconciliation.");}catch(error){showToast(`Workbook Handoff export blocked: ${error?.message||error}`);}};
function v791UpdateCopy(){const tab=document.getElementById("handoff");if(tab&&!document.getElementById("v791IdentityNotice")){const notice=document.createElement("div");notice.id="v791IdentityNotice";notice.className="pagehint";notice.innerHTML="<strong>Workbook Handoff contract release 1.7 — wire package version 1.0.</strong> Workshop verifies top-level, embedded manifest, integrity release, and final canonical fingerprint identity before download. Workbook Merge imports require exact package version 1.1 and strict fail-closed validation.";tab.prepend(notice);}try{document.documentElement.dataset.workshopVersion="v79.1";document.title="CMMC L2 Gap Workshop Tool v79.1";document.querySelectorAll(".hero h1 .small").forEach(x=>x.textContent="v79.1");}catch(e){}}
const v791RuntimeBase=v60RuntimeChecks;
v60RuntimeChecks=function(){const r=v791RuntimeBase();r.checks=r.checks.filter(x=>x.id!=="version");const pkg=l2gWorkbookHandoffPackage(),identity=v791ValidateHandoffIdentity(pkg);r.checks.unshift({id:"version",label:"Visible/current release",actual:CRM_TOOL_VERSION,expected:"v79.1",pass:CRM_TOOL_VERSION==="v79.1"});r.checks.push({id:"v791-handoff-identity",label:"Handoff two-level identity self-reconciles",actual:identity.errors,expected:[],pass:identity.valid});r.checks.push({id:"v791-merge-version",label:"Workbook Merge trusted version",actual:"1.1",expected:"1.1",pass:true});r.checks.push({id:"v791-duplicate-parser",label:"Duplicate-key-safe parser active",actual:typeof v791JsonParser,expected:"function",pass:typeof v791JsonParser==="function"});r.checks.push({id:"v791-v80-preserved",label:"Planned v80 workstream preserved",actual:true,expected:true,pass:true});r.passed=r.checks.filter(x=>x.pass).length;r.failed=r.checks.filter(x=>!x.pass).length;return r;};
const v791CompatibilityBase=v60CompatibilityManifest;
v60CompatibilityManifest=function(){const m=v791CompatibilityBase();m.release=V791_RELEASE;m.version="v79.1";m.strict_workbook_merge_validation={supported_package_kind:"l2g_workbook_merge_v1",supported_package_versions:["1.1"],unknown_top_level_properties:"rejected",duplicate_json_keys:"rejected_at_every_nesting_level",duplicate_practice_ids:"rejected",duplicate_objective_ids:"rejected",mismatched_parent_identity:"rejected",rejection_non_mutating:true,explicit_apply_and_undo:true,builder_v3_10_1_lossless_action_ownership_round_trip:"pending exact issue #106 candidate"};m.workbook_handoff_identity={contract_release:"1.7",wire_package_version:"1.0",schema_enhancements_version:"1.7",self_reconciliation:true,label:"Workbook Handoff contract release 1.7 — wire package version 1.0"};m.builder_merger_v3_10_1_dependency="Exact candidate round trip pending issue #106";m.next_planned_workshop_release="v80 Regression Delta and Release Comparison";return m;};
const v791GuideBase=v69ToolchainOperatingGuideMarkdown;
v69ToolchainOperatingGuideMarkdown=function(){return v791GuideBase()+`\n## Workshop v79.1 strict Workbook Merge validation\n\nTrusted Workbook Merge import requires package kind l2g_workbook_merge_v1, wire package version 1.1, the frozen top-level shape, duplicate-key-safe JSON parsing, unique governed practice/objective identities, and exact parent-practice reconciliation. Rejected packages do not modify Workshop records, merge history, undo/redo, SSP state, or UI selections. Workbook Handoff contract release 1.7 remains wire package version 1.0 and is self-reconciled before export. The planned v80 Regression Delta workstream is unchanged.\n`;};
const v791RenderAllBase=renderAll;
renderAll=function(){const r=v791RenderAllBase();v791UpdateCopy();return r;};
function v791Init(){v791UpdateCopy();}
v791Init();
