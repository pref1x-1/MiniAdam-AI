# MINI ADAM

**A local AI desktop workspace for Windows.**

MINI ADAM connects to local models through [Ollama](https://ollama.com), with a focused desktop interface for conversations, model management, local memory, and file workflows.

- **Website & download guide:** https://pref1x-1.github.io/MiniAdam-AI/
- **GitHub Releases:** https://github.com/pref1x-1/MiniAdam-AI/releases
- **Ollama:** https://ollama.com/download
- **Version:** 3.5.0 — Nordic Aurora
- **Platform:** Windows 10/11 · x64

## Download

Download the **Setup installer**, not the standalone application executable:

[Download MINI ADAM Setup](https://github.com/pref1x-1/MiniAdam-AI/releases/latest/download/MiniAdam-Setup.exe)

The website checks the latest GitHub Release and enables the download button only when an asset named `MiniAdam-Setup.exe` is attached. If the installer is not attached yet, the website directs visitors to the Releases page instead of displaying a broken download.

## Install

1. Download `MiniAdam-Setup.exe` from the official Releases page.
2. Run the installer, read and accept the terms, choose the installation folder, and select shortcut options.
3. Install and start [Ollama](https://ollama.com/download) separately.
4. Launch MINI ADAM, complete onboarding, check your hardware, and choose a model.

The installer does **not** bundle Ollama or AI models. Model downloads require internet access and disk space.

## Features

- Local chat with Ollama models and streaming responses.
- Chat history, search, editing, duplication, export, snapshots, and bookmarks.
- Optional Adam Mode, language preferences, and persistent local memories.
- Model discovery, download, selection, refresh, unload, and deletion.
- File and image attachments; image analysis requires a compatible vision model.
- Approval-based Agent file actions inside an approved workspace.
- Windows System Tray, focus mode, keyboard shortcuts, and Nordic Aurora styling.

Model features such as vision, thinking output, and response quality depend on the capabilities of the selected model. MINI ADAM is a desktop interface with an optional personality layer; it is not a newly fine-tuned foundation model.

## Privacy and security

- Chats and memories are stored locally under `%APPDATA%\\MiniAdam\\`.
- With a local Ollama model, inference runs on your computer. Downloading models and updates requires internet access.
- The installer is **not digitally code-signed**. Windows may show a security or reputation warning.
- Do not disable Microsoft Defender, add antivirus exclusions, or bypass a threat detection. Download only from this repository's Releases page and verify the checksum.
- A previous development build received an antivirus detection. The current installer has not been independently cleared by Microsoft; do not distribute it broadly until the current file has been scanned and any detections have been reviewed.

## Integrity — Setup 3.5.0

Expected SHA-256 for the installer asset named `MiniAdam-Setup.exe`:

```text
f2eea32333e97af4d879c9b27296f7a80332a1d20b9feb2cd7d16df248dd357d
```

Verify in PowerShell:

```powershell
Get-FileHash .\\MiniAdam-Setup.exe -Algorithm SHA256
```

This checksum applies only to the exact MINI ADAM 3.5.0 Setup build.

## Publishing

- The download site is in `docs/` and is deployed by GitHub Actions.
- In repository **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source.
- The latest Release must contain the setup file renamed to exactly `MiniAdam-Setup.exe`.
- See [the Hebrew release upload guide](./RELEASE_UPLOAD_GUIDE_HE.md) and `scripts/Publish-Setup-Release.ps1`.

## About

Made by [Adam Marhasin (Pref1x)](https://github.com/pref1x-1). MINI ADAM is an independent project and is not affiliated with Ollama, Hugging Face, Microsoft, or model providers.
