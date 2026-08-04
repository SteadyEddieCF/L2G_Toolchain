# L2G Integrated Suite v0.5.0 — Pre-Engagement and Interview Sessions

## Candidate status

This branch implements the bounded v0.5 vertical slice governed by issue #133 and ADR-0010. It is not the current supplied release until the complete acceptance matrix passes on the unchanged final head and the current-release pointer is separately promoted.

The candidate remains synthetic-only. It is not authorized for production, client, FCI, or CUI data.

## Added authorities

- `l2g_pre_engagement_v1` version 1.0 for intake requests, versioned instruments, immutable assignments, submissions, typed responses, origin attribution, exceptions, factual completeness, candidates, and import receipts.
- `l2g_interview_sessions_v1` version 1.0 for versioned questions, frozen session plans, session lifecycle, participant statements, Advisor-only notes, exact-version locally asserted confirmations, summaries, follow-ups, parking-lot items, candidates, and import receipts.

## Safety and authority boundaries

- Engagement continues to own participants, organizations, and accepted engagement context.
- Evidence continues to own source identity, fingerprints, provenance, relationships, and reference-only source records.
- Pre-Engagement and Interview records may publish candidates, but accepted target-domain state changes only through target-owned commands.
- Imported or source-derived information never becomes a client-provided answer or direct participant statement automatically.
- Raw Advisor notes remain exactly Advisor-only and are excluded before Client projection, count, search, render, inspector, focus, and accessibility-tree construction.
- Confirmations are locally asserted facilitation records tied to an exact record version; they are not authenticated identity, signatures, or broad client approval.
- Intake completeness and agenda progress are factual work indicators only. They do not determine readiness, compliance, risk, evidence sufficiency, certification, scoring, implementation, or Met/Not Met.

## Persistence and migration

- Adds exact archive entries for `domains/pre-engagement.json` and `domains/interview-sessions.json` while retaining the existing encrypted project envelope.
- Valid v0.1-v0.4 projects migrate into empty v0.5 authorities without inferred requests, responses, questions, sessions, statements, notes, confirmations, summaries, candidates, or conclusions.
- Migration creates a named v0.5 checkpoint and history event.
- Existing Engagement, Evidence, review, history, checkpoint, encryption, recovery, and stable compatibility records are preserved.

## Explicit exclusions

- no cloud service, runtime network, telemetry, collaboration, account, authentication, or security-role enforcement;
- no microphone, camera, audio/video recording, transcription, meeting bot, or biometric processing;
- no AI-generated answers or summaries, hidden scoring, automatic question acceptance, automated applicability, or automatic assessment conclusions;
- no Scope, Practice Review, SSP, Deliverables, readiness, compliance, risk, certification, evidence-sufficiency, scoring, implementation, or Met/Not Met authority migration;
- no standalone-module retirement or stable package-contract change;
- no client-safe distribution claim for the complete `.l2g` project.

## Promotion requirements

Promotion requires the exact v0.5 acceptance matrix, including Linux and native Windows `file://` validation, accessibility and responsive testing, Client non-disclosure, interrupted-session recovery, migration, malformed/oversized/ambiguous input rejection before mutation, deterministic release packaging, public-repository hygiene, zero unexpected runtime network requests, and complete current-suite and standalone-module non-regression.
