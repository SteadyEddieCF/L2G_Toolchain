# L2G Portable Suite

The target portable distribution requires no installation or administrator rights for the normal HTML path.

Expected layout:

```text
L2G_Portable/
  L2G_Control_Center.html
  Start_L2G.cmd
  modules/
  manifests/
  contracts/
  docs/
```

`Start_L2G.cmd` should open the Control Center in the default browser. PowerShell remains optional for build, hash verification, update, backup, and rollback. Compiled wrappers may be explored later but must not replace the reliable HTML fallback.
