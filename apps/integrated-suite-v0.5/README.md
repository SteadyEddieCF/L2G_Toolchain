# L2G Integrated Suite v0.5.0 — Pre-Engagement and Interview Sessions

## Status

Additive implementation work under issue #133 and ADR-0010. This directory is not the current supplied release until the complete v0.5 acceptance matrix passes and the current pointer is separately promoted.

The implementation remains synthetic-only and does not authorize production, client, FCI, or CUI data.

## Exact baseline

The directory was seeded from the exact promoted v0.4 source blobs after the v0.5 design gate merged at `cca2acef47dd4427eb1cd8620f56c42ff15f786b`.

Unchanged v0.4 encryption, recovery, Engagement, Evidence, hashing, CSS, template, build, and validation files were copied by Git blob identity rather than reconstructed. This preserves the promoted baseline while v0.5 changes remain additive and reviewable.

## Implemented domain foundation

Current implementation work includes:

- shared strict v0.5 plain-text, identifier, timestamp, enum, provenance, reference, scalar-field, limit, visibility, and frozen-projection primitives;
- canonical `l2g_pre_engagement_v1` pure domain with requests, versioned instruments, immutable assignment snapshots, submissions, typed responses, response-origin enforcement, exceptions/conflicts, factual completeness, candidates, receipts, profile-safe projections, and deterministic next work;
- canonical `l2g_interview_sessions_v1` pure domain with versioned questions, immutable plan snapshots, one-active-session enforcement, session questions, participant statements, Advisor-only notes, exact-version confirmations, summaries, follow-ups, parking-lot records, candidates, receipts, profile-safe projections, and deterministic next work;
- explicit Start, navigate, Pause, Resume, Complete, Cancel, statement, Advisor-note, confirmation, and candidate commands;
- adversarial domain tests for origin confusion, immutable snapshot mismatch, Advisor-note leakage, one-active-session enforcement, pause/resume, exact-version confirmation, imported-context attribution, frozen projections, and source-domain candidate non-acceptance.

## Not yet promoted or complete

The current implementation branch still requires:

- JSON schemas and schema fixtures;
- project-state integration and v0.1-v0.4 migration into empty v0.5 domains;
- exact archive serialization/integrity coverage for both new domain files;
- checkpoint/history wiring for session lifecycle and candidate transitions;
- Engagement/Evidence target-owned candidate adapters;
- strict intake/meeting/questionnaire preview/apply adapters;
- Pre-Engagement, Session Planner, Interview Mode, Client Presentation Mode, and post-session UI;
- responsive, accessibility, leakage, recovery, migration, malformed-input, scale, deterministic-build, Linux, native Windows `file://`, and complete suite non-regression evidence;
- deterministic release package, SBOM, validation report, SHA identity, release notes, and current-pointer promotion.

## Safety boundaries

- Original evidence remains external to the project.
- Imported content never becomes a client answer or live participant statement automatically.
- Raw Advisor notes remain exactly Advisor-only and are excluded before Client projection, count, search, render, inspector, focus, and accessibility-tree construction.
- Client confirmations are locally asserted exact-version facilitation records, not authenticated identity, electronic signatures, or broad client approval.
- Agenda progress and Intake Completeness are factual work indicators, not readiness, compliance, risk, evidence-sufficiency, certification, scoring, implementation, or Met/Not Met conclusions.
- Audio/video capture, microphone/camera access, speech-to-text, automated transcription, meeting bots, AI-generated answers/summaries, hidden scoring, automatic question acceptance, and automatic assessment conclusions are excluded.
