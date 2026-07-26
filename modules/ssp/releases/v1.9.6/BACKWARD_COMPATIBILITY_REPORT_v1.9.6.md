# Backward Compatibility Report — SSP v1.9.6

## Result

**Passed.** v1.9.6 is a presentation/browser-local UX release over the unchanged v1.9.5.1 governed data and contract model.

## Compatibility guarantees validated

- v1.9.5 backups migrate through the existing v1.9.5.1 migration path.
- v1.9.5.1 backups import, restore, and re-export deterministically.
- Fields, statuses, reviewer statuses, tables, images, portfolio foundation, recovery, image recovery, portfolio rollback, Word Review queue, and undo/redo are preserved.
- Existing backup, AI template, CRM, clean HTML, and internal-review HTML filenames retain v1.9.5.1 export identity.
- UI preferences use a separate localStorage namespace and are not emitted by governed `collectData` exports.
- Thirty-two governed functions compare byte-identical with the exact v1.9.5.1 runtime-source baseline.

## Identity model

- Visible/runtime release identity: `1.9.6`
- Governed schema/app identity: `1.9.5.1`
- Runtime SHA-256: `d86ae890920f7935c40e9d237766e5ac482af70907e0758bd7e7f1b8f0bed0ea`
- Runtime-source baseline SHA-256: `a291b6b1c13b6232ca73e7ed00c9fed40eccdd216ee8bda8ceb4f3dfb59599e8`
- Schema SHA-256: `be2659f848c74e41cfbe47db642efcc3835f5d5b32dc7d3e9054991ad84a8a36`
