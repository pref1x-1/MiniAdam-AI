# MINI ADAM website and release status

## Website

- Static website source: `docs/`.
- Publishing method: GitHub Pages → Deploy from a branch → `main` / `/docs`.
- One-time repository setting is still required by the repository owner.
- Expected URL: https://pref1x-1.github.io/MiniAdam-AI/
- The custom Pages Actions workflow was removed because `actions/configure-pages` fails when Pages has not first been enabled/configured.

## Setup installer

- Required Release asset name: `MiniAdam-Setup.exe`.
- Release `v3.5.0` was not uploaded by the GitHub content connector; the connector supports repository text files but does not expose binary Release-asset upload.
- Use `scripts/Publish-Setup-Release.ps1 -SetupPath <path-to-setup.exe>` from a PC with GitHub CLI authenticated. It verifies the known SHA-256 before uploading.
- Expected download URL after release publication: https://github.com/pref1x-1/MiniAdam-AI/releases/latest/download/MiniAdam-Setup.exe

## Expected SHA-256

`f2eea32333e97af4d879c9b27296f7a80332a1d20b9feb2cd7d16df248dd357d`
