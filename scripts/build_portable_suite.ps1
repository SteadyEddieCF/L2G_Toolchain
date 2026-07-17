param(
    [string]$Snapshot = "suite-2026.07-draft",
    [string]$OutputRoot = "dist"
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
$SnapshotPath = Join-Path $RepoRoot "suite/snapshots/$Snapshot.json"
if (-not (Test-Path $SnapshotPath)) {
    throw "Snapshot not found: $SnapshotPath"
}

$SnapshotData = Get-Content $SnapshotPath -Raw | ConvertFrom-Json
$Out = Join-Path $RepoRoot "$OutputRoot/L2G_Portable_$Snapshot"
if (Test-Path $Out) { Remove-Item $Out -Recurse -Force }
New-Item -ItemType Directory -Path $Out | Out-Null
New-Item -ItemType Directory -Path (Join-Path $Out "modules") | Out-Null
New-Item -ItemType Directory -Path (Join-Path $Out "manifests") | Out-Null
New-Item -ItemType Directory -Path (Join-Path $Out "docs") | Out-Null

Copy-Item $SnapshotPath (Join-Path $Out "manifests/suite-snapshot.json")
Copy-Item (Join-Path $RepoRoot "contracts/registry.json") (Join-Path $Out "manifests/contracts-registry.json")
Copy-Item (Join-Path $RepoRoot "README.md") (Join-Path $Out "docs/README.md")

$Missing = @()
foreach ($Module in $SnapshotData.modules) {
    $Current = Join-Path $RepoRoot "modules/$($Module.module)/current"
    $Html = Get-ChildItem $Current -Filter *.html -File -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($Html) {
        Copy-Item $Html.FullName (Join-Path $Out "modules/$($Html.Name)")
    } else {
        $Missing += "$($Module.module) $($Module.version)"
    }
}

$Launcher = @"
@echo off
setlocal
cd /d "%~dp0"
if exist "L2G_Control_Center.html" (
  start "" "L2G_Control_Center.html"
) else (
  echo L2G Control Center HTML is not present in this snapshot.
  echo Open the desired file under the modules folder.
  pause
)
"@
Set-Content -Path (Join-Path $Out "Start_L2G.cmd") -Value $Launcher -Encoding ASCII

$BuildReport = [ordered]@{
    snapshot = $SnapshotData.snapshot_id
    generated_at = (Get-Date).ToString("o")
    output = $Out
    missing_module_html = $Missing
    no_install_required = $true
    admin_rights_required = $false
}
$BuildReport | ConvertTo-Json -Depth 6 | Set-Content (Join-Path $Out "manifests/build-report.json") -Encoding UTF8

Write-Host "Portable suite staged at: $Out"
if ($Missing.Count -gt 0) {
    Write-Warning "Missing current HTML for: $($Missing -join ', ')"
}
