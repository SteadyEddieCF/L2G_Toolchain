
/* === v79 Full McFirecoal Toolchain Regression === */
const V79_RELEASE=Object.freeze({
  name:"CMMC L2 Gap Workshop Tool",version:"v79",focus:"Full McFirecoal Toolchain Regression",
  workshop_state:"1.0 additive",workbook_handoff:"1.7",workbook_merge:"1.1",ssp_handoff:"1.0",ssp_return:"1.0",
  adjacent_tool_application_changes:false,new_stable_contract:false,local_only:true
});

/* Normalize objective identifiers without weakening catalog validation. The v78 catalog contains
   CM.L2-3.4.4 [a] while governed workbook packages correctly emit CM.L2-3.4.4[a]. */
const v79ObjectiveIdBase=v57ObjectiveId;
function v79ObjectiveCanon(value){return v77Txt(value,160).replace(/\s+\[/g,"[").replace(/\s+/g," ").trim().toLowerCase();}
v57ObjectiveId=function(value,practice){
  const base=v79ObjectiveIdBase(value,practice);if(base)return base;
  const raw=v79ObjectiveCanon(value);if(!raw)return "";
  const found=V54_OBJECTIVES.find(o=>v79ObjectiveCanon(o.objective_id)===raw||v79ObjectiveCanon(o.workbook_ref)===raw);
  if(found)return found.objective_id;
  if(practice){const suffix=raw.match(/\[[a-z0-9]+\]$/i)?.[0]||"";const byPractice=V54_OBJECTIVES.find(o=>o.practice_id===practice&&suffix&&v79ObjectiveCanon(o.objective_id).endsWith(suffix));if(byPractice)return byPractice.objective_id;}
  return "";
};
