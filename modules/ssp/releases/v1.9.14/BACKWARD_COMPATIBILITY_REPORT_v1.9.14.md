# Backward Compatibility Report — SSP v1.9.14

v1.9.14 is presentation-only over v1.9.13. Existing v1.9.13 working data opens without migration because the schema identifier remains `cmmc-l2-ssp-modern-v1.9.11`.

All existing import/export handlers, package kinds, filenames, review workflows, Word Review behavior, keyboard shortcuts, confirmation flows, focus traps, and 110 authoritative controls remain available. Deliver is reached through Export instead of a dedicated toolbar button, but the underlying command handler is unchanged.
