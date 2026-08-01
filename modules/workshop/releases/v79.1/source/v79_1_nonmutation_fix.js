
/* v79.1 exact pre-preview operational-state preservation hardening */
let v791ProtectedRenderOperationalState=null;
const v791RenderOperationalBase=renderAll;
renderAll=function(){
  const protectedState=v791ProtectedRenderOperationalState?v791Clone(v791ProtectedRenderOperationalState):null;
  const result=v791RenderOperationalBase();
  if(protectedState)v791RestoreOperationalState(protectedState);
  return result;
};
const v791PreviewOperationalBase=v57PreviewMergeText;
v57PreviewMergeText=function(text,sourceName){
  const operationalBefore=v791CaptureOperationalState();
  const result=v791PreviewOperationalBase(text,sourceName);
  if(result&&typeof result==="object")Object.defineProperty(result,"_v791_operational_snapshot",{value:v791Clone(operationalBefore),enumerable:false,configurable:true});
  v791RestoreOperationalState(operationalBefore);
  queueMicrotask(()=>{if(v57PendingMerge===result)v791RestoreOperationalState(operationalBefore);});
  return result;
};
const v791ApplyOperationalBase=v57ApplyPendingMerge;
v57ApplyPendingMerge=function(){
  const preview=v57PendingMerge;
  const operationalBefore=preview?._v791_operational_snapshot?v791Clone(preview._v791_operational_snapshot):v791CaptureOperationalState();
  v791ProtectedRenderOperationalState=v791Clone(operationalBefore);
  v791RestoreOperationalState(operationalBefore);
  const result=v791ApplyOperationalBase();
  v791RestoreOperationalState(operationalBefore);
  try{localStorage.setItem(STATE_KEY,JSON.stringify(state));}catch(error){}
  const releaseGuard=()=>{v791RestoreOperationalState(operationalBefore);try{localStorage.setItem(STATE_KEY,JSON.stringify(state));}catch(error){}v791ProtectedRenderOperationalState=null;};
  if(typeof requestAnimationFrame==="function")requestAnimationFrame(()=>requestAnimationFrame(releaseGuard));else setTimeout(releaseGuard,0);
  return result;
};
