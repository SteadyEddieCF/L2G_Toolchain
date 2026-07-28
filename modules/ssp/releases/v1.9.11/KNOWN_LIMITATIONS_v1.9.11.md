# Known Limitations — SSP v1.9.11

- Inspection requires a safe readable DOCX containing the supported SSP Word Review manifest before a result can be recorded.
- An older supported SSP Word Review copy without expected-section or source-fingerprint metadata may be recorded with explicit `needs-human-review` findings.
- Package validity means bounded ZIP/part safety and readability, not complete ECMA-376 conformance.
- Comment and tracked-revision counts are structural counts only; they do not establish quality, acceptance, resolution, or rendering.
- Placeholder detection is bounded to known canonical patterns and mapped content controls; human review remains necessary.
- Browser-local identities are asserted and unauthenticated.
- Final Word QA and all rendering/assembled-delivery checks remain outside SSP v1.9.11.
