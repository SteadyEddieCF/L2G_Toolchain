# Migration Design — SSP v1.9.7

No governed-data migration is introduced. The existing v1.9.5 → v1.9.5.1 migration path remains authoritative.

The only new state is non-governed browser-local workspace presentation data. Invalid, oversized, or unsupported values are normalized to safe defaults. Clearing browser storage removes workspace preferences without affecting exported SSP packages. Importing a governed backup does not import workspace preferences.
