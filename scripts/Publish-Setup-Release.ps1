param(
  [Parameter(Mandatory = $true)][string]$SetupPath,
  [Parameter(Mandatory = $true)][string]$ChecksumsPath
)
$ErrorActionPreference = 'Stop'
$repo = 'pref1x-1/MiniAdam-AI'
$tag = 'v3.6.1'
$expected = 'a2522cb073b30abdf4f3587d8e26127c5fd7de14ba6a7ea7c54a926ef422e315'
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) { throw 'GitHub CLI (gh) is required: https://cli.github.com/' }
$setup = (Resolve-Path -LiteralPath $SetupPath).Path
$hashFile = (Resolve-Path -LiteralPath $ChecksumsPath).Path
$actual = (Get-FileHash -LiteralPath $setup -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actual -ne $expected) { throw "SHA-256 does not match the approved setup. Expected $expected, got $actual. No upload performed." }
if (-not ((Get-Content -LiteralPath $hashFile -Raw) -match [regex]::Escape($expected))) { throw 'Checksum file does not contain the approved setup hash' }
& gh auth status
if ($LASTEXITCODE -ne 0) { throw 'gh auth status failed. Run gh auth login first.' }
& gh release view $tag -R $repo *> $null
if ($LASTEXITCODE -eq 0) { throw "Release $tag already exists. Refusing to replace a published installer." }
$notes = @"
MINI ADAM 3.6.1 — Windows x64 review candidate.

Built from the approved 17 November 2026 Go source.
SHA-256 MiniAdam-Setup.exe: $expected

Ollama and AI models are installed separately.
The setup downloads a pinned and verified WebView bridge DLL during installation.
The installer is unsigned. Do not disable Microsoft Defender or SmartScreen.

Windows interactive install/upgrade/uninstall testing, live Ollama testing, and a Defender scan were not executed in the original build environment.
"@
& gh release create $tag "$setup#MiniAdam-Setup.exe" "$hashFile#SHA256SUMS.txt" --repo $repo --title 'MINI ADAM 3.6.1 — Windows x64' --notes $notes --latest
if ($LASTEXITCODE -ne 0) { throw 'GitHub Release upload failed.' }
Write-Host "Published $tag with verified setup SHA-256: $actual" -ForegroundColor Green
