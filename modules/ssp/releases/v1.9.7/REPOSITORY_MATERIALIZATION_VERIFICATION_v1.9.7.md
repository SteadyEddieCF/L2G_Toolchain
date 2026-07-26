# Repository Materialization Verification — SSP v1.9.7

`materialize.py` applies a hash-verified XZ-compressed unified diff to the exact v1.9.6 runtime-source baseline.

- Baseline SHA-256: `d86ae890920f7935c40e9d237766e5ac482af70907e0758bd7e7f1b8f0bed0ea`
- Encoded patch SHA-256: `7c85a8f0f4e9ac685f8decdd84b525182544a1fd2d3590b89d24c1c511aee4dd`
- Unified patch SHA-256: `0e275488e1eca424b3e08abc687633deb6379cac7a4cbf2201c625eff7f97339`
- Output SHA-256: `359a6a04fceadbb64afbf3733c6984e9b4e1171b48aef067859eddc8d1708051`

The generated runtime was compared byte-for-byte with the validated candidate.
