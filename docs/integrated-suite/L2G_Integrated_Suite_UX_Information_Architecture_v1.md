# L2G Integrated Suite UX Information Architecture v1

## Status

First-pass workflow and presentation specification. It does not freeze visual styling or authorize production implementation.

## Design objective

Create one workflow-oriented application rather than six separate tools placed inside tabs.

Primary navigation:

- Overview
- Pre-Engagement
- Evidence
- Scope
- Practice Review
- SSP
- Deliverables
- Reviews & Actions

## Shared application shell

### Top application bar

Keep visible and compact.

Required elements:

- client and engagement identity;
- save state;
- Undo;
- Redo;
- global search;
- active presentation profile;
- help;
- overflow menu.

Undo and Redo apply to meaningful project-editing commands, not browser navigation. Disabled states must be visible and accessible.

### Left navigation rail

The rail may collapse to icons. It must preserve accessible labels, current-location context, and keyboard navigation.

Permanent navigation should not extend deeper than the eight primary workspaces. Deeper navigation belongs inside each workspace.

### Central workspace

Contains the active task and avoids rendering inactive heavy workspaces.

### Right context and review inspector

Collapsed by default. It may open automatically for:

- provenance;
- source review;
- comments;
- differences;
- conflicts;
- approvals;
- history;
- source-document context.

Users may pin it open. Required controls must not be collapsible in a way that makes the current task impossible to understand or complete.

## Overview

Purpose: factual engagement awareness and navigation, not assessment conclusions.

Show:

- current engagement phase;
- pre-engagement completeness;
- evidence indexed and requiring attention;
- scope decisions pending;
- practices reviewed;
- interviews planned or completed;
- SSP sections requiring attention;
- open actions and blockers;
- evidence requests;
- review queue;
- recent activity;
- available outputs;
- suggested next work.

Use factual counts and states. Do not show unsupported readiness percentages, compliance scores, certification claims, Met/Not Met conclusions, or evidence-sufficiency determinations.

## Pre-Engagement

Primary views:

- Engagement objectives and boundaries
- Questionnaires
- Asset and system inventories
- Providers and services
- Personnel and roles
- Technology and network information
- Data-flow worksheets
- Prior assessments and reports
- Evidence-request preparation
- Assumptions and constraints
- Participants and initial responsibility candidates

Pre-engagement responses may create candidates and follow-up questions. They do not automatically become authoritative scope, practice, responsibility, or evidence-sufficiency decisions.

## Evidence

Primary views:

- Add Evidence
- Processing activity
- Document index
- Exception & Trust Queue
- Extracted content
- Structured records
- Diagrams
- Security evidence
- Meetings and transcripts
- Candidate mappings
- Source relationships
- Relink Evidence

The default workflow should emphasize:

1. select material;
2. process locally;
3. review exceptions;
4. inspect extracted records;
5. review candidates;
6. make information available to downstream domains.

Parser diagnostics, raw structures, OCR controls, and technical reconciliation belong in Advanced sections or the inspector.

## Scope

Primary views:

- Scope overview
- Systems and environments
- Assets
- Providers and services
- CUI and security-protection data flows
- Boundary diagram
- Assumptions
- Decision ledger
- Unresolved questions
- Change impact

Evidence and Pre-Engagement candidates appear automatically. The user must Accept, Modify, or Reject a candidate before it becomes an authoritative Scope record.

## Practice Review

Primary views:

- Review plan
- Practice list
- Family view
- Evidence review
- Gaps and recommendations
- Responsibility discussions
- Provider follow-up
- Interview sessions
- Unresolved questions

Practice Review owns facilitated conclusions, evidence review, evidence requests, gaps, actions, blockers, and provider follow-up.

### Interview Session preparation

Support:

- selecting practices or topics;
- generating a draft agenda;
- suggested questions from source material and pre-engagement responses;
- identified gaps and inconsistencies;
- participant planning;
- evidence and responsibility context;
- question editing, reordering, skipping, and addition.

Generated questions are advisory and must never be presented as authoritative conclusions.

### Interview Mode

Minimize unnecessary application chrome.

Show:

- current topic or practice;
- current question;
- explanation or intent;
- source-derived context;
- client response;
- advisor notes;
- supporting evidence;
- follow-up suggestions;
- participants;
- actions and evidence requests;
- previous and next controls.

Question types must be visibly distinguished:

- scripted;
- source-derived suggestion;
- answer-derived follow-up;
- advisor-added;
- client question.

Client responses and advisor notes are separate records.

## SSP

Primary views:

- SSP overview
- System and environment
- Practices
- Evidence references and responsibility
- Modules and inheritance
- Needs Attention
- Review and preflight
- Baselines and revisions
- Word Review
- Delivery preparation
- Advanced portfolio workspace

Workshop conclusions appear as proposed SSP updates. They do not silently overwrite governed SSP narratives.

Single-System remains the default. Portfolio mode remains Advanced until its complete integrated workflow is separately validated.

## Deliverables

Primary views:

- Available outputs
- Output profiles
- Workbook build and merge
- SSP review copy
- Internal review package
- Client-safe exports
- Manifests and hashes
- Reconciliation
- Output history

Deliverables may consume approved content but may not modify underlying Scope, Practice Review, or SSP conclusions.

## Reviews & Actions

Primary views:

- Unified transition inbox
- Actions
- Blockers
- Evidence requests
- Comments
- Conflicts
- Assignments
- Review history

Review cards should show:

- source and target domains;
- source record links;
- before and proposed state;
- provenance;
- affected records;
- rationale;
- Accept;
- Modify;
- Reject;
- Return;
- Approve when applicable.

The unified queue is a workflow surface. Substantive records remain owned by their domains.

## Presentation profiles

### Advisor View

Full working environment, including:

- editing;
- internal notes;
- confidence and provenance;
- advanced options;
- candidate decisions;
- interview preparation;
- scope rationale;
- gaps and recommendations;
- SSP editing;
- deliverable configuration;
- diagnostics.

### Client View

Curated facilitated-session and presentation experience. May include:

- approved workshop questions;
- scope diagrams;
- approved system and provider lists;
- client confirmations;
- selected evidence requests;
- actions;
- approved summaries;
- approved draft narratives.

Hide:

- internal advisor notes;
- rejected candidates;
- parser diagnostics;
- internal confidence metadata;
- internal quality-review comments;
- content not approved for client discussion.

Not every workspace requires Client View.

### Reviewer View

Emphasize:

- changes since the previous review;
- source traceability;
- before-and-after narrative and conclusion differences;
- unresolved conflicts;
- comments;
- assignments;
- approve, return, and request-revision actions;
- review history.

## Profile qualification

In the standalone offline edition, presentation profiles are not enforceable security roles. Hiding Advisor controls does not prevent a holder of the complete project file from accessing its content.

External client distribution must use a curated export containing only approved client-safe information.

## Responsive and accessibility requirements

- Support keyboard navigation and visible focus.
- Preserve focus when opening and closing the inspector.
- Avoid color-only state communication.
- Use accessible names for icon controls.
- Keep primary actions visible at laptop-height viewports.
- Allow secondary panels to collapse without hiding required task context.
- Preserve browser `file://` operation.
- Test light and dark themes.
- Provide print-specific presentation where required.
- Keep dense information readable on standard business laptops and living-room presentation displays where Client View is used.
