# Known Limitations — v1.8.8

- Names and roles remain locally asserted and are not authenticated accounts or digital signatures.
- FNV-1a fingerprints support deterministic comparison, not cryptographic signing or non-repudiation.
- The register is derived from available local source records; it cannot reconstruct events that prior releases never recorded.
- No external identity provider, notification service, workflow server, custody service, or telemetry is used.
- Configurable inheritance and reconciliation policy profiles remain v1.8.9.
