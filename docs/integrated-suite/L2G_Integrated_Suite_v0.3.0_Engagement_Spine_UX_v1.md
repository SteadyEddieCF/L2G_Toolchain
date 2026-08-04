# L2G Integrated Suite v0.3.0 — Engagement Spine UX

## Purpose

Define the bounded v0.3 interaction model for editing and reviewing the Engagement spine while preserving the approved eight-workspace shell and presentation profiles.

## Overview workspace

Show factual engagement awareness:

- phase and target dates;
- accepted identity completeness;
- active participants and organizations;
- candidates awaiting review;
- open questions;
- active blockers;
- milestones by operational state;
- deterministic suggested next work;
- recent Engagement history.

Do not display readiness percentages, assessment conclusions, evidence sufficiency, compliance scores, certification probability, or Met/Not Met.

## Pre-Engagement workspace

Use internal tabs:

1. Identity
2. People & Organizations
3. Assumptions & Constraints
4. Decisions & Questions
5. Milestones & Blockers
6. Candidate Review

The primary canvas displays the selected list or editor. The right inspector displays provenance, relationships, change history, and presentation visibility.

## Editing behavior

- Advisor View may edit accepted records and create records.
- Changes are explicit commands with Undo and Redo descriptions.
- Creation dialogs require only the fields needed for a valid record.
- Destructive delete is replaced by deactivate, cancel, reject, resolve, archive, or supersede.
- Empty states explain authority and next action.
- Save, recovery, and lock behavior remain visible in the shared top bar.

## Candidate review

Candidate cards show source kind and source reference, proposed target record type, proposed fields, provenance and confidence, affected accepted record when applicable, and Accept, Modify, Reject, and Supersede.

Accept and Modify display the exact before/after values before committing. Client View never displays candidate records or candidate counts.

## Client View

Client View is a curated presentation projection. It may show client-safe identity and objectives, active client-safe participants and organizations, approved-for-presentation decisions, selected open questions, and selected milestones, blockers, and next steps.

Filtering occurs before the renderer receives data. Hidden records do not contribute to counts, search, empty-state text, inspector context, or next-work calculations.

## Reviewer View

Reviewer View emphasizes changes since the latest checkpoint, accepted decisions and rationale, unresolved questions, candidate decisions, provenance and relationships, superseded records, and history/checkpoint context.

Reviewer View is read-only for direct Engagement edits in v0.3. Review actions create proposals or revision requests rather than mutating Engagement state.

## Cross-workspace projection

Evidence, Scope, Practice Review, SSP, Deliverables, and Reviews & Actions show a read-only Engagement context card containing profile-safe identity, phase, relevant participants, open questions, milestones and blockers, plus projection timestamp and source record count.

No controls on these cards directly update Engagement state. The user must return to Pre-Engagement or create a review proposal.

## Responsive and accessibility behavior

- keyboard-operable internal tabs and record lists;
- visible focus and non-color state labels;
- field errors linked with `aria-describedby`;
- dialogs trap focus and return focus to the invoking control;
- inspector collapses below the workspace on narrow screens;
- primary actions remain visible at 768px laptop height;
- Client View supports a presentation-friendly layout;
- light and dark color-scheme support remains automatic;
- native `file://` Chromium remains the required runtime.
