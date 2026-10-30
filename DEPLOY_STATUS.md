# Deployment status

- Website source: prepared in `docs/`.
- GitHub Pages workflow: `.github/workflows/deploy-pages.yml`.
- Required repository setting: Pages source must be set to GitHub Actions.
- Expected public URL: https://pref1x-1.github.io/MiniAdam-AI/
- Expected GitHub Release asset: `MiniAdam-Setup.exe`.
- Binary upload status: not uploaded by this connector workflow. The available GitHub connection can commit UTF-8 source files but does not expose a release-asset/binary upload action. Follow `RELEASE_UPLOAD_GUIDE_HE.md` or run `scripts/Publish-Setup-Release.ps1` from a PC with GitHub CLI authenticated.
