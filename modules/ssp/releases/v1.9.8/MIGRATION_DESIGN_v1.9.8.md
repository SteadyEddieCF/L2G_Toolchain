# Migration design — v1.9.8

Valid v1.9.5 and v1.9.5.1 working-data backups migrate deterministically to schema/app identity 1.9.8. Migration installs a reference to the built-in profile and an empty review-run history when those fields are absent.

Built-in item definitions remain in the runtime/registry artifact and are not duplicated into each working-data backup. Existing fields, tables, statuses, images, portfolio foundation, stable contracts, and non-backup export identities retain their existing meanings.

v1.9.8 uses the backup filename `CMMC_L2_SSP_v1.9.8_Data_Backup.json`. Clean-browser import and fingerprint-validated re-export were tested with an actual generated file.
