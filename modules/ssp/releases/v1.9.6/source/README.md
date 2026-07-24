# SSP v1.9.6 repository materialization

The repository reuses the exact v1.9.5.1 runtime-source blob and applies the verified compressed unified diff in the ordered `runtime-v1.9.5.1-to-v1.9.6.patch.xz.b64.partNN` files.

- Runtime-source SHA-256: `a291b6b1c13b6232ca73e7ed00c9fed40eccdd216ee8bda8ceb4f3dfb59599e8`
- Repository-encoded patch SHA-256: `f29609fb6dcc56ac446dc4cc63ec3649eb6b8b23377693dff92401a1a4de6578`
- Decoded XZ patch SHA-256: `119a110912150708064333e8cd84e7bfe8800f09cc3c4295b3ab425b94a71369`
- Output SHA-256: `d86ae890920f7935c40e9d237766e5ac482af70907e0758bd7e7f1b8f0bed0ea`

The repository encoding omits a non-semantic final Base64 newline; the decoded patch and materialized runtime remain byte-identical to the complete deliverables candidate. The complete deliverables ZIP contains the already materialized standalone runtime and full regression fixtures.
