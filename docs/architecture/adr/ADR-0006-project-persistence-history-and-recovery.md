# ADR-0006 — Project Persistence, History, and Recovery

## Status

Proposed.

## Date

2026-08-03.

## Context

The Integrated Suite needs a portable `.l2g` project, browser-local crash recovery, truthful save status, Undo/Redo, named checkpoints, and auditable restoration without requiring a server or native helper.

A single storage mechanism cannot satisfy every requirement:

- the `.l2g` file is portable and user-controlled;
- IndexedDB is suitable for browser-local working recovery but is not a portable deliverable;
- localStorage is synchronous and too limited for engagement records;
- full event sourcing would add substantial complexity before domain commands and migration invariants are stable.

## Proposed decision

### Canonical portable project

1. The user-controlled `.l2g` file is the canonical portable project artifact.
2. Opening a project validates container structure, versions, duplicate paths and keys, integrity records, and domain schemas before mutating the active workspace.
3. Save and Save As generate a complete validated project image and a new integrity manifest.
4. The UI distinguishes:
   - active browser working state;
   - last project file opened;
   - project file save or download initiated;
   - backup generated;
   - selected file re-opened and fingerprint verified.

### Browser recovery

5. IndexedDB stores bounded working-state checkpoints and recovery metadata.
6. Recovery data is keyed by project ID and working-copy identity, not only by filename.
7. Recovery never silently overwrites a selected project file.
8. On launch, the user receives an explicit choice when browser recovery is newer than the last known project-file state.
9. localStorage is limited to small non-sensitive UI preferences and capability flags.
10. Production-sensitive recovery must satisfy the encryption ADR before real client use.

### Commands and history

11. All governed mutations use explicit domain commands.
12. Milestone 0 uses a command journal plus periodic named checkpoints, not unrestricted event sourcing.
13. Each reversible command records:
    - command ID and type;
    - domain and target IDs;
    - timestamp;
    - precondition or source revision;
    - bounded inverse data;
    - actor label appropriate to an offline presentation profile;
    - resulting project revision.
14. Undo and Redo operate only while invariants and command boundaries remain valid.
15. Cross-domain transitions are one explicit compound command or separate commands with a checkpoint boundary; they must not leave partially applied authority changes.
16. Restoring a checkpoint appends a restoration record rather than deleting later history.
17. History compaction may remove redundant reversible detail only after a checkpoint safely preserves the resulting state and required audit facts.

## Consequences

### Positive

- Portable project ownership remains clear.
- Browser recovery improves resilience without becoming an invisible second authority.
- Undo and restoration behavior are bounded and testable.
- The design can evolve toward richer event history later.

### Negative

- Save state requires careful user messaging.
- IndexedDB recovery requires quota, cleanup, and migration handling.
- Compound commands and inverse data add implementation discipline.

## Acceptance evidence

- `.l2g` open/save/open round trip;
- rejected invalid project leaves active state unchanged;
- recovery newer/older/equal scenarios;
- simulated interrupted save and browser reload;
- Undo/Redo disabled-state and invariant tests;
- compound cross-domain transition tests;
- checkpoint restoration appends history;
- quota and cleanup behavior;
- no governed engagement records in localStorage;
- synthetic-only data until encryption authorization.

## Non-decisions

This ADR does not define production encryption, cloud synchronization, multi-user merge, remote collaboration, server persistence, or unrestricted event sourcing.
