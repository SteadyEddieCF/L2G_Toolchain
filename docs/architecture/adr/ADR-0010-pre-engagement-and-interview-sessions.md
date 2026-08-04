# ADR-0010 — Canonical Pre-Engagement and Interview Sessions

## Status

Accepted for L2G Integrated Suite v0.5.0 implementation when this reviewed design package merges. Production, client, FCI, and CUI use remains unauthorized.

## Date

2026-08-04.

## Context

L2G Integrated Suite v0.4.0 provides the encrypted project foundation, the canonical Engagement spine, and the canonical reference-only Evidence catalog. The next bounded release must support work that normally occurs before and during facilitated discovery:

- requesting questionnaires, inventories, documents, participants, and meeting context;
- tracking what was requested, received, reviewed, superseded, or remains missing;
- distinguishing client-provided answers from source-derived candidates and advisor interpretations;
- preparing agendas and question plans from accepted Engagement context, reference-only Evidence projections, reviewed intake content, and imported context;
- conducting one question or topic at a time without the cognitive load of the current multi-page Workshop interface;
- recording participant statements, advisor observations, unresolved interpretations, follow-ups, and client-visible summaries without collapsing them into one ambiguous notes field;
- recovering an interrupted session safely and deterministically;
- publishing candidates without silently mutating Engagement, Evidence, future Scope, future Practice Review, future SSP, Deliverables, or Reviews & Actions authority.

Pre-Engagement and Interview Sessions are related but not the same authority. Intake assignments and submissions have different lifecycle, provenance, visibility, and review semantics from facilitated sessions, question-plan snapshots, statements, advisor notes, confirmations, and summaries. Combining them into one domain would create an overloaded record model and make later Scope and Practice Review migration harder.

The current product posture remains:

- one local, offline, no-install generated HTML runtime;
- one encrypted `.l2g` project and encrypted local recovery;
- no runtime network, telemetry, cloud scheduling, collaboration, authenticated identity, or security-role enforcement;
- original evidence remains outside the project;
- stable standalone package contracts remain unchanged compatibility inputs;
- presentation profiles remain non-security modes;
- imported or session-derived information cannot silently become accepted cross-domain content or unsupported assessment conclusions;
- audio/video recording, microphone/camera capture, automated transcription, meeting bots, AI-generated answers, automatic question acceptance, hidden scoring, and automatic conclusions are excluded.

## Decision

### Separate domain authorities and archive placement

1. v0.5 adds two governed domain documents:

   - `domains/pre-engagement.json`, schema kind `l2g_pre_engagement_v1` version `1.0`;
   - `domains/interview-sessions.json`, schema kind `l2g_interview_sessions_v1` version `1.0`.

2. Pre-Engagement owns intake requests, instruments, assignments, submissions, response records, receipt/review state, intake exceptions, completeness facts, import receipts, and Pre-Engagement-origin candidates.

3. Interview Sessions owns reusable question records, ordered session plans, immutable start-of-session plan snapshots, live session instances, participant statements, advisor notes, confirmations, summaries, follow-ups, parking-lot items, import receipts, and Interview-origin candidates.

4. Engagement remains authoritative for engagement identity, participants, organizations, assumptions, decisions, questions, constraints, milestones, blockers, and Engagement candidate decisions.

5. Evidence remains authoritative for source identity, fingerprints, source locations, derived records, relationships, duplicate/revision decisions, verification/import receipts, and Evidence candidate decisions.

6. Pre-Engagement and Interview Sessions consume deep-cloned, profile-filtered Engagement and Evidence projections. They never receive writable references to those domains.

7. The existing encrypted envelope, strict ZIP parser, project integrity manifest, history/checkpoint model, archive-entry limit, per-entry size limit, expanded-project limit, and encrypted-envelope limit remain unchanged.

### Stable identity and state principles

8. Every governed record uses an opaque immutable type-prefixed identifier. Labels, wording, display names, filenames, dates, and order positions are not identities.

9. Lifecycle, review, operational, visibility, and currency/integrity states remain separate dimensions. No single status field may overload those meanings.

10. Every imported, copied, source-derived, or advisor-interpreted record preserves provenance, source references, asserted-by profile label, asserted timestamp, and confidence where applicable.

11. `asserted_by`, participant display names, and profile labels are locally asserted workflow metadata. They are not authenticated identity, electronic signatures, or proof that a named person supplied or approved content.

12. Governed records are archived, cancelled, rejected, withdrawn, superseded, or closed rather than destructively deleted.

### Pre-Engagement authority

13. Instruments represent bounded questionnaires, inventories, checklists, file requests, participant requests, or mixed requested-information sets. Each instrument has a stable ID, version, ordered sections/items, source/provenance, lifecycle, and visibility.

14. An assignment references one immutable instrument snapshot, Engagement participant/organization references, due dates, instructions, and operational state. Editing a reusable instrument after assignment never silently changes an existing assignment snapshot.

15. Intake request kinds are `questionnaire`, `inventory`, `document`, `participant`, `clarification`, `evidence-reference`, and `other`.

16. Request/assignment operational states distinguish not requested, requested, in progress, partially received, received, needs clarification, satisfied/completed, cancelled, and superseded conditions according to the field contract.

17. Submissions and responses remain distinct: a submission groups one receipt event and source context; a response is one typed item-level answer or statement.

18. Response origins are `client-provided`, `advisor-entered-on-behalf`, `source-derived-candidate`, `imported-context`, and `advisor-interpretation`.

19. A response may be `client-provided` only when provenance identifies the asserted submitter and recording method. Advisor entry on behalf remains separately labeled.

20. Source-derived candidates are never rendered as client answers. Advisor interpretations are never rendered as client confirmations.

21. Intake completeness is a factual checklist/count model. It may report requested, received, missing, overdue, conflicting, unreviewed, or needs-clarification items. It produces no readiness, compliance, assessment, risk, or evidence-sufficiency score.

22. Conflicting responses, source candidates, and advisor interpretations remain visible side by side and require explicit reconciliation. The system never selects the latest timestamp automatically.

### Question identity and plan snapshots

23. Interview questions use immutable `question_id` values and versioned content. Origins are `scripted`, `advisor-created`, `source-derived`, `suggested-follow-up`, `prior-session-carryover`, and `imported-context`.

24. A question contains prompt text, client-safe explanation, rationale, expected participants, applicability notes, source/provenance links, visibility, lifecycle, and version metadata.

25. A session plan contains ordered items. Each references one exact question version and stores a frozen snapshot, inclusion state, participant refs, estimated time, source basis, and rationale.

26. Editing a question-bank record never rewrites prior plan snapshots. The UI exposes stale/current/conflict state and explicit Compare, Refresh as new snapshot, or Retain actions.

27. Starting a session creates an immutable start snapshot plus mutable live session-question instances. The original snapshot remains available for comparison and recovery.

28. Suggested/source-derived questions never enter the live agenda automatically. Advisor Accept, Edit and Accept, Ask Now, Save for Later, or Dismiss is required.

### Session lifecycle and recovery

29. Session lifecycle values are `planned`, `ready`, `in-progress`, `paused`, `completed`, `cancelled`, and `superseded`.

30. `completed` means the facilitated meeting ended. It does not mean every output was reviewed, confirmed, approved, or accepted by another domain.

31. Post-session review states are `not-started`, `pending`, `in-review`, `reviewed`, `changes-requested`, and `closed`.

32. At most one session may be `in-progress` or `paused` in one project. Starting another requires explicitly pausing, completing, or cancelling the active session.

33. Starting creates a named checkpoint. Pausing atomically commits valid editor drafts, current question, live agenda order, elapsed-time metadata, unresolved markers, and state, then creates a named checkpoint.

34. Resume restores the governed active question and agenda state. Presentation-only panel arrangement may be restored as a safe preference but is not authoritative content.

35. Completing or cancelling creates a named checkpoint and history event. Completion does not publish candidates, approve summaries, confirm statements, or close follow-ups automatically.

36. Recovery can restore one valid active/paused session only. Conflicting active-session states are rejected before mutation.

### Statements, notes, confirmations, and summaries

37. Participant statements, advisor notes, confirmations, and summaries are separate records with separate IDs and provenance.

38. A participant statement records exact session/question refs, asserted speaker/participant ref or explicit unknown label, recording method, text/value, lifecycle, visibility, and timestamps.

39. Raw advisor notes are always `advisor-only` in v0.5. They are removed before Client projection construction, counts, search, inspector/editor creation, focus restoration, history summaries shown to Client View, and accessibility-tree construction.

40. Imported meeting context is `imported-context`, not direct participant testimony. Any later participant statement preserves the imported origin and explicit review/conversion event.

41. A confirmation is a separate record referencing the exact statement or client-visible summary version being confirmed. It records the locally asserted confirmer, method, timestamp, and qualification that it is not an authenticated signature.

42. Facilitator and client-visible summaries are separate from raw statements and notes. A summary references its source records and cannot replace, edit, or delete them.

43. Summary lifecycle values include `draft`, `proposed`, `reviewed`, `approved-for-client-presentation`, `superseded`, and `archived`.

44. No generated or facilitator-authored summary becomes approved automatically. Approval requires an explicit command and preserved history.

### Follow-ups and parking-lot work

45. Interview follow-up kinds include `question`, `clarification`, `evidence-reference-request`, `action-proposal`, `blocker-proposal`, `responsibility-discussion`, `decision-proposal`, `meeting`, and `other`.

46. Follow-ups remain Interview-owned operational records until an implemented target accepts a candidate. Their operational states are `open`, `waiting`, `blocked`, `done`, and `cancelled`.

47. Parking-lot items identify deferred content, reason, intended destination/session, owner, due date, related refs, and visibility.

48. Creating a follow-up does not establish a practice finding, responsibility determination, scope decision, evidence sufficiency, or SSP narrative.

### Candidate publication and target authority

49. Pre-Engagement and Interview candidate states are `draft`, `awaiting-review`, `published-to-target`, `returned`, `withdrawn`, `superseded`, and `closed`.

50. Candidate targets are `engagement`, `evidence`, `scope`, `practice-review`, `ssp`, `reviews-actions`, and other future registered targets.

51. Candidate creation changes only the source domain.

52. Publication to Engagement or Evidence invokes a target-owned candidate creation command. The target owns Accept, Modify, Reject, Return, and Supersede decisions.

53. The source domain stores only validated target references and mirrored workflow state; it cannot manufacture a target decision by changing a field.

54. Targets not implemented in v0.5 keep candidates `awaiting-review`; the UI exposes no nonfunctional acceptance controls.

55. Candidate fields may not contain unsupported readiness, compliance, scoring, certification, risk, implementation, evidence-sufficiency, or Met/Not Met conclusions.

### Compatibility adapters

56. `l2g_intake_package_v1`, `l2g_meeting_context_v1`, and relevant current questionnaire/context content are recognized only through registered supported kinds and versions. `l2g_scope_context_v1` may provide low-authority question-planning context but not Scope authority.

57. Import begins with strict JSON or bounded stored-ZIP validation as applicable, kind/version recognition, package SHA-256, registry lookup, duplicate/prototype-key rejection, source-traceability validation, and preview.

58. Package bytes are not retained. The Evidence source reference or package hash/receipt preserves origin identity.

59. Intake imports create staged requests, snapshots, submissions, responses, or candidates according to package semantics. They do not silently create authenticated/client-provided answers.

60. Meeting imports create staged imported-context records, question/agenda candidates, or source refs. They do not silently create participant statements, confirmations, summaries, findings, or decisions.

61. Apply, Modify and Apply, Apply Reviewed Subset, Reject, and Return are explicit atomic actions. Parser, identity, integrity, version, batch, or traceability failure leaves governed state unchanged.

62. Stable standalone package contracts and runtimes remain unchanged.

### Presentation profiles and non-disclosure

63. Advisor View supports full permitted intake, planning, facilitation, notes, review, imports, candidates, and history.

64. Reviewer View is direct-edit read-only except for explicit review artifacts and target-domain disposition commands within assigned scope.

65. Client View receives a new projection before render, count, search, recommendation, inspector/editor, history summary, focus restoration, or accessibility-tree work.

66. Client Interview presentation may include only the selected current question, client-safe explanation, explicitly selected approved context, client-visible response, confirmation control, and agreed visible follow-up/summary.

67. Client View omits advisor notes, imported-context internals, suggestions, rejected/deferred candidates, confidence, internal provenance, unresolved interpretations, private participant metadata, review comments, internal conflicts, target-candidate state, and hidden counts.

68. Profile switching clears incompatible search results, inspector/editor content, current selection, cached counts, and focus targets before the new projection renders.

69. Profiles are not security roles. A holder who unlocks the complete project can access complete content. External client distribution remains a curated-export concern.

### Migration, history, limits, and safety

70. Opening a valid v0.4 project adds empty Pre-Engagement and Interview Sessions domains, updates the exact domain index, creates a named migration checkpoint/history event, and infers no requests, answers, sessions, statements, notes, summaries, candidates, or conclusions.

71. v0.1-v0.3 projects migrate through their existing paths and then receive the same empty v0.5 domains.

72. Meaningful mutations are command-based and append history. Undo and Redo restore governed state without erasing audit events.

73. Start, pause, resume, complete, cancel, import apply, batch assignment, post-session close, candidate publication, and migration use named history events; start, pause, complete/cancel, major import, and migration create checkpoints.

74. The stricter inherited archive/envelope limits always prevail over semantic collection limits.

75. v0.5 remains synthetic-only and does not authorize production, client, FCI, or CUI use.

76. v0.5 introduces no microphone, camera, recording, speech recognition, automated transcription, meeting bot, AI-generated answer/summary, automatic question acceptance, automatic applicability decision, hidden score, automatic practice conclusion, cloud service, or client-distribution export.

## Consequences

### Positive

- Intake and facilitated-discovery receive explicit authorities before Scope and Practice Review migration.
- Client answers, source candidates, advisor interpretations, participant statements, advisor notes, confirmations, and summaries remain distinguishable.
- Question plans are reproducible and stale changes are visible rather than silently rewriting a session.
- Interrupted sessions can resume from governed state with checkpoints and history.
- Interview Mode can reduce live-session cognitive load without transferring authority.
- Existing Engagement, Evidence, and standalone contracts remain protected.

### Negative

- Two new domains, multiple record types, snapshots, and target receipts add complexity.
- A client confirmation remains locally asserted and is not an authenticated signature.
- Client Presentation Mode cannot protect hidden content from a holder of the unlocked project.
- Large questionnaires and long sessions remain constrained by inherited limits.
- Post-session review adds deliberate work before summaries or candidates can be published.

## Required acceptance evidence

- exact schemas and semantic validators for both domains;
- deterministic v0.4-to-v0.5 empty-domain migration and v0.1-v0.3 regression;
- immutable instrument, assignment, question, and session-start snapshots;
- stale-plan comparison and explicit refresh/retain behavior;
- one-active-session lifecycle enforcement;
- start/pause/resume/complete/cancel checkpoints and interrupted-session recovery;
- strict separation and profile filtering of responses, statements, notes, confirmations, and summaries;
- Client non-disclosure across DOM, counts, search, inspector, history, focus, and accessibility tree;
- strict package preview/apply and no-mutation failures;
- target-owned Engagement and Evidence candidate decisions;
- command history, Undo/Redo, encrypted persistence/recovery, lock, and tamper regression;
- keyboard-first Interview Mode, 1280×720 Client presentation, tablet-landscape behavior, and WCAG 2.2 AA checks;
- Linux and native Windows Chromium `file://`, zero-network, restrictive CSP, deterministic build, public hygiene, current-suite, and standalone-module non-regression.

## Non-decisions

This ADR does not authorize production data, client distribution, authenticated identity, collaboration, cloud scheduling, email delivery, second-display/window support, audio/video capture, transcription, AI-generated content, Scope authority, Practice Review conclusions, SSP authority, Deliverables generation, readiness, compliance, scoring, certification, risk, evidence sufficiency, implementation conclusions, or Met/Not Met.
