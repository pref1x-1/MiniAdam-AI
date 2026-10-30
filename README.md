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

The download site checks the latest GitHub Release and activates the download button only when an asset named `MiniAdam-Setup.exe` exists. Until the first installer asset is uploaded, visitors are sent to the Releases page.

## Install

1. Download `MiniAdam-Setup.exe` from the official Releases page.
2. Run the installer, read and accept the terms, choose an installation folder, and select shortcut options.
3. Install and start [Ollama](https://ollama.com/download) separately.
4. Launch MINI ADAM, complete onboarding, check your hardware, and choose a model.

The installer does **not** bundle Ollama or AI models. Model downloads require internet access and disk space.

## Features

- Local chat with Ollama models and streaming responses.
- Chat history, search, editing, duplication, export, snapshots, and bookmarks.
- Optional Adam Mode, language preferences, and persistent local memories.
- Model discovery, download, selection, refresh, unload, and deletion.
- File and image attachments; image understanding requires a compatible vision model.
- Approval-based Agent file actions inside an approved workspace.
- Windows System Tray, focus mode, keyboard shortcuts, and Nordic Aurora styling.

Model features such as vision, thinking output, and response quality depend on the selected model. MINI ADAM is a desktop interface with an optional personality layer; it is not a newly fine-tuned foundation model.

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

This checksum applies only to this exact MINI ADAM 3.5.0 Setup build.

## Publishing the website and installer

The static website is stored in `docs/`. To publish it, open **Settings → Pages**, select **Deploy from a branch**, choose branch `main` and folder `/docs`, then save. No custom Pages Actions workflow is required.

To publish the installer, follow [the Hebrew Release upload guide](./RELEASE_UPLOAD_GUIDE_HE.md) or run `scripts/Publish-Setup-Release.ps1` with GitHub CLI. The script verifies the checksum and uploads **only** the Setup installer under the asset name `MiniAdam-Setup.exe`.

## About

Made by [Adam Marhasin (Pref1x)](https://github.com/pref1x-1). MINI ADAM is an independent project and is not affiliated with Ollama, Hugging Face, Microsoft, or any model provider.
