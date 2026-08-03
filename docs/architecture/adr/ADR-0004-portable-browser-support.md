# ADR-0004 — Portable Browser Support

## Status

Proposed.

## Date

2026-08-03.

## Context

The existing L2G modules are primarily validated as local `file://` HTML applications in desktop Chromium, including native Windows Chromium tests. Browser capabilities differ for local files, downloads, File System Access APIs, workers, IndexedDB, memory limits, and security policy enforcement.

Attempting to make every browser a release blocker in Milestone 0 would increase uncertainty before the project lifecycle, persistence, recovery, and security foundation are proven.

## Proposed decision

1. Define the Milestone 0 portable release baseline as current supported desktop Chromium on Windows, including Microsoft Edge and Google Chrome.
2. Require native Windows Chromium `file://` testing for every promoted portable release.
3. Keep required project behavior independent of the File System Access API.
4. Use progressive enhancement:
   - direct file handles where supported and explicitly selected;
   - download-based Save As and backup everywhere in the baseline;
   - open/reselect and hash verification when a browser cannot verify the destination write.
5. Use truthful save-state labels. The application must not claim that a file was saved to disk when the browser only initiated a download.
6. Treat Firefox and Safari as compatibility targets after Milestone 0, not initial release blockers.
7. Do not introduce a browser extension, local server, native helper, executable installer, or administrator requirement to compensate for browser limitations.
8. Record capabilities at runtime and disable unsupported actions with an explanation rather than failing silently.

## Required baseline capabilities

- open a local generated HTML file;
- create, open, validate, and export a synthetic `.l2g` project;
- IndexedDB recovery;
- download-based Save As and backup;
- workers or safe main-thread fallback;
- restrictive CSP and zero runtime network requests;
- keyboard, focus, zoom, constrained viewport, and accessibility support.

## Consequences

### Positive

- Aligns with the current validated Windows deployment posture.
- Avoids making non-universal browser APIs mandatory.
- Preserves the no-install and no-server requirement.
- Makes save behavior honest and testable.

### Negative

- Firefox and Safari are not initially guaranteed.
- Some browsers may have less convenient save behavior.
- Capability detection and fallback UI require explicit tests.

## Acceptance evidence

- current Edge and Chrome `file://` matrix;
- download fallback and re-open verification;
- IndexedDB recovery after reload and simulated interruption;
- disabled-state tests for unavailable capabilities;
- zero-network and CSP tests;
- a recorded later-browser compatibility backlog.

## Non-decisions

This ADR does not permanently exclude Firefox, Safari, macOS, or Linux. It defines only the first portable release gate.
