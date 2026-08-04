namespace L2G {
  export interface V05IntakeImportProposal {
    proposal_id: string;
    evidence_source_ref: string;
    evidence_derived_ref: string;
    request: IntakeRequestRecord;
    instrument: IntakeInstrumentRecord;
    assignment: IntakeAssignmentRecord;
  }

  export interface V05InterviewQuestionImportProposal {
    proposal_id: string;
    evidence_source_ref: string;
    evidence_derived_ref: string;
    question: InterviewQuestionRecord;
  }

  export interface V05CompatibilityPreview {
    preview_kind: "l2g_v05_compatibility_preview_v1";
    package_kind: EvidenceImportReceipt["package_kind"];
    package_version: "1.0";
    package_name: string;
    package_size_bytes: number;
    package_sha256: string;
    evidence_preview: ImportPreview;
    intake_proposals: V05IntakeImportProposal[];
    interview_question_proposals: V05InterviewQuestionImportProposal[];
    warnings: string[];
    rejected_rows: string[];
    generated_at: string;
  }

  export interface V05CompatibilitySelection {
    intake_proposal_ids?: string[];
    interview_question_proposal_ids?: string[];
  }

  export interface V05CompatibilityApplyResult {
    evidence_receipt_ref: string;
    pre_engagement_receipt_ref: string | null;
    interview_receipt_ref: string | null;
    created_refs: string[];
    disposition: "applied" | "applied-reviewed-subset";
  }

  export async function previewV05CompatibilityPackage(bytes: Uint8Array, selectedName: string): Promise<V05CompatibilityPreview> {
    const evidencePreview = await previewLegacyEvidencePackage(bytes, selectedName);
    const timestamp = nowIso();
    const warnings = [...evidencePreview.warnings];
    const rejected = [...evidencePreview.rejected];
    const intakeProposals: V05IntakeImportProposal[] = [];
    const interviewProposals: V05InterviewQuestionImportProposal[] = [];

    for (const derived of evidencePreview.derived_records) {
      const source = evidencePreview.sources.find(item => item.evidence_id === derived.source_ref);
      if (!source) {
        rejected.push(`${derived.title}: normalized source reference was unavailable.`);
        continue;
      }
      const sourceRefs = [source.evidence_id, derived.derived_id, ...derived.location_refs];
      const baseProvenance = createV05Provenance(
        evidencePreview.package_kind,
        derived.provenance.source_id,
        timestamp,
        "import",
        derived.confidence,
        evidencePreview.package_name,
        derived.location_refs[0] ?? null
      );

      if (evidencePreview.package_kind === "l2g_intake_package_v1") {
        const requestId = newId("intake_request");
        const instrumentId = newId("intake_instrument");
        const sectionId = newId("section");
        const itemId = newId("intake_item");
        const assignmentId = newId("intake_assignment");
        const prompt = sanitizePlainText(derived.title, 300);
        const help = sanitizePlainText(derived.summary, 8000);
        const item: IntakeInstrumentItem = {
          item_id: itemId,
          section_ref: sectionId,
          order: 1,
          kind: "question",
          prompt,
          client_safe_help: help,
          value_type: "long-text",
          required: false,
          options: [],
          applicability_note: "Imported low-authority intake context; Advisor review is required before assignment.",
          visibility: "advisor-only",
          source_refs: [...sourceRefs],
          provenance: deepClone(baseProvenance)
        };
        const snapshot: IntakeAssignmentSnapshot = {
          snapshot_hash: await sha256Hex(utf8(stableStringify({
            title: prompt,
            items: [{
              item_id: item.item_id,
              section_ref: item.section_ref,
              order: item.order,
              kind: item.kind,
              prompt: item.prompt,
              client_safe_help: item.client_safe_help,
              value_type: item.value_type,
              required: item.required,
              options: item.options,
              applicability_note: item.applicability_note,
              visibility: item.visibility
            }]
          }, 0))),
          title: prompt,
          items: [{
            item_id: item.item_id,
            section_ref: item.section_ref,
            order: item.order,
            kind: item.kind,
            prompt: item.prompt,
            client_safe_help: item.client_safe_help,
            value_type: item.value_type,
            required: item.required,
            options: [],
            applicability_note: item.applicability_note,
            visibility: item.visibility
          }]
        };
        intakeProposals.push({
          proposal_id: newId("intake_import_proposal"),
          evidence_source_ref: source.evidence_id,
          evidence_derived_ref: derived.derived_id,
          request: {
            request_id: requestId,
            kind: "questionnaire",
            title: prompt,
            description: "Imported low-authority intake content staged for Advisor review. It is not a client-provided answer.",
            owner_label: "Advisor",
            participant_refs: [],
            organization_refs: [],
            due_date: "",
            operational_state: "not-requested",
            lifecycle: "active",
            review_state: "pending",
            visibility: "advisor-only",
            related_refs: [instrumentId, ...sourceRefs],
            provenance: deepClone(baseProvenance),
            created_at: timestamp,
            updated_at: timestamp
          },
          instrument: {
            instrument_id: instrumentId,
            kind: "questionnaire",
            title: prompt,
            version_label: "Imported 1.0",
            version_number: 1,
            lifecycle: "active",
            visibility: "advisor-only",
            sections: [{ section_id: sectionId, title: "Imported context", order: 1, item_refs: [itemId] }],
            items: [item],
            provenance: deepClone(baseProvenance),
            created_at: timestamp,
            updated_at: timestamp
          },
          assignment: {
            assignment_id: assignmentId,
            request_ref: requestId,
            instrument_ref: instrumentId,
            instrument_version_number: 1,
            snapshot,
            participant_refs: [],
            organization_refs: [],
            assigned_at: timestamp,
            due_date: "",
            instructions: "Review imported context, select participants, and explicitly assign only if appropriate.",
            operational_state: "not-requested",
            currency_state: "current",
            lifecycle: "active",
            visibility: "advisor-only",
            provenance: deepClone(baseProvenance),
            created_at: timestamp,
            updated_at: timestamp
          }
        });
      }

      interviewProposals.push({
        proposal_id: newId("interview_import_proposal"),
        evidence_source_ref: source.evidence_id,
        evidence_derived_ref: derived.derived_id,
        question: {
          question_id: newId("interview_question"),
          version_number: 1,
          version_label: "Imported 1.0",
          origin: "imported-context",
          topic_label: sanitizePlainText(derived.title, 300),
          prompt: sanitizePlainText(derived.title, 8000),
          client_safe_explanation: "Imported context for Advisor review; it is not direct participant testimony.",
          rationale: sanitizePlainText(derived.summary, 8000),
          expected_participant_role_labels: [],
          applicability_note: evidencePreview.package_kind === "l2g_scope_context_v1"
            ? "Low-authority Scope context may inform a question but cannot establish the authoritative boundary."
            : "Imported package context requires Advisor review before use in a session.",
          source_refs: [...sourceRefs],
          related_refs: [],
          lifecycle: "draft",
          visibility: "advisor-only",
          supersedes_question_ref: null,
          superseded_by_question_ref: null,
          provenance: deepClone(baseProvenance),
          created_at: timestamp,
          updated_at: timestamp
        }
      });
    }

    if (evidencePreview.package_kind === "l2g_intake_package_v1") {
      warnings.push("Package content is staged as imported intake questions only. No submission or response is created without an exact assignment snapshot and reviewed origin mapping.");
    }
    if (evidencePreview.package_kind === "l2g_meeting_context_v1") {
      warnings.push("Meeting context is staged as imported-context questions only. No participant statement, speaker identity, confirmation, or testimony record is created.");
    }
    if (evidencePreview.package_kind === "l2g_scope_context_v1") {
      warnings.push("Scope context is staged only as low-authority question context. No Scope record or boundary decision is created.");
    }
    if (!intakeProposals.length && !interviewProposals.length) throw new Error("The package contains no reviewable v0.5 intake or Interview context.");

    return {
      preview_kind: "l2g_v05_compatibility_preview_v1",
      package_kind: evidencePreview.package_kind,
      package_version: "1.0",
      package_name: evidencePreview.package_name,
      package_size_bytes: evidencePreview.package_size_bytes,
      package_sha256: evidencePreview.package_sha256,
      evidence_preview: evidencePreview,
      intake_proposals: intakeProposals,
      interview_question_proposals: interviewProposals,
      warnings: warnings.slice(0, 100),
      rejected_rows: rejected.slice(0, 500),
      generated_at: timestamp
    };
  }

  export function applyV05CompatibilityPreview(
    document: ProjectDocument,
    preview: V05CompatibilityPreview,
    selection: V05CompatibilitySelection | undefined,
    profile: PresentationProfile
  ): V05CompatibilityApplyResult {
    if (profile !== "advisor") throw new Error("Only Advisor View may apply v0.5 compatibility previews.");
    const selectedIntake = new Set(selection?.intake_proposal_ids ?? preview.intake_proposals.map(item => item.proposal_id));
    const selectedInterview = new Set(selection?.interview_question_proposal_ids ?? preview.interview_question_proposals.map(item => item.proposal_id));
    const intake = preview.intake_proposals.filter(item => selectedIntake.has(item.proposal_id));
    const interview = preview.interview_question_proposals.filter(item => selectedInterview.has(item.proposal_id));
    if (!intake.length && !interview.length) throw new Error("No reviewed valid v0.5 import records were selected.");

    const selectedDerived = new Set<string>();
    const selectedSources = new Set<string>();
    for (const item of [...intake, ...interview]) {
      selectedDerived.add(item.evidence_derived_ref);
      selectedSources.add(item.evidence_source_ref);
    }
    const evidenceReceipt = applyImportPreview(document.state.evidence, preview.evidence_preview, {
      source_ids: [...selectedSources],
      derived_ids: [...selectedDerived],
      candidate_ids: []
    }, profile);

    const createdRefs: string[] = [
      ...evidenceReceipt.staged_source_refs,
      ...evidenceReceipt.staged_location_refs,
      ...evidenceReceipt.staged_derived_refs
    ];
    const allSelected = intake.length === preview.intake_proposals.length
      && interview.length === preview.interview_question_proposals.length
      && preview.rejected_rows.length === 0;
    const disposition = allSelected ? "applied" : "applied-reviewed-subset";
    let preReceiptRef: string | null = null;
    let interviewReceiptRef: string | null = null;

    if (intake.length) {
      for (const item of intake) {
        document.state.pre_engagement.requests.push(deepClone(item.request));
        document.state.pre_engagement.instruments.push(deepClone(item.instrument));
        document.state.pre_engagement.assignments.push(deepClone(item.assignment));
        createdRefs.push(item.request.request_id, item.instrument.instrument_id, item.assignment.assignment_id, ...item.instrument.items.map(record => record.item_id));
      }
      const receipt: PreEngagementImportReceipt = {
        import_receipt_id: newId("pre_engagement_import"),
        package_kind: preview.package_kind,
        package_version: "1.0",
        package_sha256: preview.package_sha256,
        package_size_bytes: preview.package_size_bytes,
        source_evidence_ref: evidenceReceipt.staged_source_refs[0] ?? null,
        registry_version: window.__L2G_CONTRACT_REGISTRY__.registry_version,
        disposition,
        created_refs: intake.flatMap(item => [item.request.request_id, item.instrument.instrument_id, item.assignment.assignment_id, ...item.instrument.items.map(record => record.item_id)]),
        modified_refs: [],
        rejected_rows: [...preview.rejected_rows],
        warnings: [...preview.warnings],
        created_at: nowIso()
      };
      document.state.pre_engagement.import_receipts.push(receipt);
      preReceiptRef = receipt.import_receipt_id;
      createdRefs.push(receipt.import_receipt_id);
    }

    if (interview.length) {
      document.state.interviews.questions.push(...interview.map(item => deepClone(item.question)));
      const receipt: InterviewImportReceipt = {
        import_receipt_id: newId("interview_import"),
        package_kind: preview.package_kind,
        package_version: "1.0",
        package_sha256: preview.package_sha256,
        package_size_bytes: preview.package_size_bytes,
        source_evidence_ref: evidenceReceipt.staged_source_refs[0] ?? null,
        registry_version: window.__L2G_CONTRACT_REGISTRY__.registry_version,
        disposition,
        created_refs: interview.map(item => item.question.question_id),
        modified_refs: [],
        rejected_rows: [...preview.rejected_rows],
        warnings: [...preview.warnings],
        created_at: nowIso()
      };
      document.state.interviews.import_receipts.push(receipt);
      interviewReceiptRef = receipt.import_receipt_id;
      createdRefs.push(...interview.map(item => item.question.question_id), receipt.import_receipt_id);
    }

    validateProjectDocument(document, true);
    return {
      evidence_receipt_ref: evidenceReceipt.import_id,
      pre_engagement_receipt_ref: preReceiptRef,
      interview_receipt_ref: interviewReceiptRef,
      created_refs: [...new Set(createdRefs)],
      disposition
    };
  }
}
