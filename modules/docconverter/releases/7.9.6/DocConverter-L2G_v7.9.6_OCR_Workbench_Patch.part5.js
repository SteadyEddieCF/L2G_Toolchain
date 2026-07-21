function reviewedDocs796(){return docs796().filter(d=>d.ocr_review_workbench_v796||d.ocr_analysis_source_v796||ocrText796(d)).map(d=>({source_document_id:docId796(d),source_file:base796(d.filename),native_text_chars:nativeText796(d).length,ocr_text_chars:ocrText796(d).length,native_text_quality:Number(d.native_text_quality||score796(nativeText796(d))),ocr_text_quality:Number(d.ocr_text_quality||score796(ocrText796(d))),selected_analysis_source:d.ocr_source_decision_locked_v796?(d.ocr_analysis_source_v796||d.preferred_text_source||'manual_review'):'pending_review',source_decision_locked:!!d.ocr_source_decision_locked_v796,page_states:Object.values(stateMap796(d)).map(x=>({source_id:x.source_id,page:x.page,status:x.status,attempts:x.attempts||0,confidence:x.confidence??null,characters:x.chars||0,updated_at:x.updated_at||''})),advisor_review_required:true}));}
const pkg796=function(mode='full'){
 if(!PRIOR_PKG796)return {};
 if(PACKAGE_BUILDING796)return PRIOR_PKG796(mode);
 PACKAGE_BUILDING796=true;
 const snaps=[];
 try{
  for(const d of docs796()){
   const o=ocrText796(d);if(!o)continue;
   const n=nativeText796(d),locked=!!d.ocr_source_decision_locked_v796;
   snaps.push({d,text:d.text,sections:d.sections,manual:d.manual_override_used,preferred:d.preferred_text_source,analysis:d.ocr_analysis_source_v796,readability:d.readability,extractionStatus:d.extractionStatus});
   d.text=locked?String(d._v796_selected_text??d.text??''):n;
   d.manual_override_used=true;
   d.preferred_text_source='manual';
   try{if(typeof splitSections==='function')d.sections=splitSections(d.text||'');}catch(e){}
