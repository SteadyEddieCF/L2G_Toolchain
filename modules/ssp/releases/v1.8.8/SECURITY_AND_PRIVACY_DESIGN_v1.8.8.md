# Security and Privacy Design — v1.8.8

All register processing remains offline in the browser. No telemetry, remote identity, notification service, or external audit service is used. Imported explicit entries are scope-validated and fingerprint-checked. HTML rendering escapes register content. Local names and roles are asserted identities and must not be represented as authenticated signatures.
