$ErrorActionPreference = 'Stop'

$Tag = 'v3.5.0'
$AssetName = 'MiniAdam-Setup.exe'
$ExpectedSha256 = 'f2eea32333e97af4d879c9b27296f7a80332a1d20b9feb2cd7d16df248dd357d'
$AssetPath = Join-Path $PSScriptRoot '..\MiniAdam-Setup.exe'
$AssetPath = [System.IO.Path]::GetFullPath($AssetPath)

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    throw 'GitHub CLI is required. Install it from https://cli.github.com/ and run gh auth login.'
}
if (-not (Test-Path -LiteralPath $AssetPath -PathType Leaf)) {
    throw "Setup file not found: $AssetPath. Place MiniAdam-Setup.exe beside the scripts folder."
}

$actual = (Get-FileHash -LiteralPath $AssetPath -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actual -ne $ExpectedSha256) {
    throw "SHA-256 mismatch. Expected $ExpectedSha256 but found $actual. Do not upload this file."
}

gh auth status
if ($LASTEXITCODE -ne 0) { throw 'GitHub CLI is not authenticated. Run gh auth login.' }

$repo = 'pref1x-1/MiniAdam-AI'
$existing = gh release view $Tag --repo $repo 2>$null
if ($LASTEXITCODE -eq 0) {
    gh release upload $Tag "$AssetPath#$AssetName" --repo $repo --clobber
} else {
    $notes = 'MINI ADAM 3.5.0 — Nordic Aurora. Windows x64 Setup installer. Verify SHA-256 before running. This installer is unsigned; do not bypass antivirus warnings.'
    gh release create $Tag "$AssetPath#$AssetName" --repo $repo --title 'MINI ADAM 3.5.0 — Nordic Aurora' --notes $notes --target main --latest
}
if ($LASTEXITCODE -ne 0) { throw 'GitHub Release upload failed.' }

Write-Host "Uploaded $AssetName to https://github.com/$repo/releases/tag/$Tag"
Write-Host "SHA-256: $actual"
