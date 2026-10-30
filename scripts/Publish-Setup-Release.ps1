param(
    [Parameter(Mandatory = $true)]
    [string]$SetupPath
)

$ErrorActionPreference = 'Stop'

$Tag = 'v3.5.0'
$AssetName = 'MiniAdam-Setup.exe'
$ExpectedSha256 = 'f2eea32333e97af4d879c9b27296f7a80332a1d20b9feb2cd7d16df248dd357d'
$Repository = 'pref1x-1/MiniAdam-AI'
$ResolvedSetupPath = (Resolve-Path -LiteralPath $SetupPath -ErrorAction Stop).Path

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    throw 'GitHub CLI is required. Install it from https://cli.github.com/ and run gh auth login.'
}

if (-not (Test-Path -LiteralPath $ResolvedSetupPath -PathType Leaf)) {
    throw "Setup file not found: $ResolvedSetupPath"
}

$actual = (Get-FileHash -LiteralPath $ResolvedSetupPath -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actual -ne $ExpectedSha256) {
    throw "SHA-256 mismatch. Expected $ExpectedSha256 but found $actual. Nothing was uploaded."
}

Write-Host "Verified Setup SHA-256: $actual" -ForegroundColor Green
gh auth status
if ($LASTEXITCODE -ne 0) {
    throw 'GitHub CLI is not authenticated. Run gh auth login first.'
}

$null = gh release view $Tag --repo $Repository 2>$null
$releaseExists = ($LASTEXITCODE -eq 0)

if ($releaseExists) {
    Write-Host "Release $Tag already exists. Uploading/replacing only the Setup asset..."
    gh release upload $Tag "$ResolvedSetupPath#$AssetName" --repo $Repository --clobber
    $uploadExitCode = $LASTEXITCODE
}
else {
    $notes = @'
MINI ADAM 3.5.0 — Nordic Aurora

Windows x64 Setup installer.
Verify the published SHA-256 before running.

This installer is not digitally signed. Do not bypass antivirus or SmartScreen warnings.
'@
    gh release create $Tag "$ResolvedSetupPath#$AssetName" --repo $Repository --title 'MINI ADAM 3.5.0 — Nordic Aurora' --notes $notes --target main --latest
    $uploadExitCode = $LASTEXITCODE
}

if ($uploadExitCode -ne 0) {
    throw "GitHub Release upload failed with exit code $uploadExitCode."
}

Write-Host ""
Write-Host "Published $AssetName to:"
Write-Host "https://github.com/$Repository/releases/tag/$Tag" -ForegroundColor Green
Write-Host "Expected download URL:"
Write-Host "https://github.com/$Repository/releases/latest/download/$AssetName"
