<div align="center">

# MINI ADAM

**Your local AI workspace for Windows.**

Chat with local models, keep your conversations organized, manage AI memory, and work with files — in one desktop experience.

**Aurora V2 · Windows x64 · Powered by Ollama**

[Download for Windows](./MiniAdam-V2.exe) · [Get Ollama](https://ollama.com/download) · [Report an issue](https://github.com/pref1x-1/MiniAdam/issues)

</div>

---

## Overview

MINI ADAM is a lightweight desktop companion that connects to **Ollama** on your own computer. It provides a modern interface for local language models, with optional Adam-style conversations, saved chats, memory, model controls, and permission-based file actions.

**No account is required by MINI ADAM.** For local Ollama models, inference takes place on your computer. Downloading models and visiting external links requires internet access; cloud models, if selected, may send data to their provider.

## Features

| Area | What you get |
| :-- | :-- |
| **Conversations** | Streaming replies, multi-chat history, search, editing, branching, and chat exports. |
| **Adam Mode** | Turn an Adam-inspired style on or off for each chat; choose the default in settings. |
| **Language preferences** | Automatic language matching, or a Hebrew/English preference. |
| **Local models** | Discover, download, select, refresh, unload, and remove supported Ollama models. |
| **Model controls** | Adjustable effort levels and thinking output when supported by the selected model. |
| **Memory** | Locally saved memories you can review, edit, or remove. |
| **File support** | Attach supported text/code files and images; image understanding requires a compatible vision model. |
| **Agent tools** | File actions within an approved workspace, with an explicit approval step. |
| **Productivity** | Message bookmarks, quotes, chat snapshots, restoration, statistics, and HTML export. |
| **Desktop experience** | System tray, background process, focus mode, compact layout, light/dark theme, and keyboard shortcuts. |

> Features such as thinking output, vision, and response quality depend on the capabilities of the model you install. MINI ADAM is an interface with an optional personality layer, **not a newly fine-tuned foundation model**.

## Download & installation

### Requirements

- Windows 10 or 11, **64-bit** (intended target; wider compatibility is not fully verified).
- [Ollama](https://ollama.com/download), installed and running.
- An available **Microsoft Edge** or **Google Chrome** installation for the app-mode window.
- Enough free storage and memory for your chosen AI model. A dedicated GPU is helpful but not mandatory for every model.

### Get started

1. Download [`MiniAdam-V2.exe`](./MiniAdam-V2.exe) from this repository.
2. Install and start [Ollama](https://ollama.com/download).
3. Launch `MiniAdam-V2.exe`.
4. Open the model library in MINI ADAM and install a model suitable for your hardware, or run an Ollama command such as:

   ```powershell
   ollama pull qwen3:4b
   ```

5. Select that model in MINI ADAM and start a chat. Adjust the language preference or Adam Mode whenever you like.

If Ollama is unavailable, follow the in-app setup and hardware guidance. Closing the app window may leave MINI ADAM running in the system tray; use **Quit** from the tray menu to exit completely.

## Adam Mode

Adam Mode is an **optional conversational style**, not a claim that you're chatting with the real Adam. You can toggle it independently for each chat, or change the default behavior in settings.

For more natural Hebrew, try the Hebrew language preference and a model with stronger multilingual support. No prompt can guarantee perfect output from every small model.

## Your data & safety

- Chats and memory are stored locally under `%APPDATA%\MiniAdam\`.
- Back up your data before upgrading or resetting the app.
- The built-in agent is limited to its approved folder and requests confirmation for actions. Review file edits and keep backups.
- Do not give the assistant sensitive information you would not want stored on your computer.
- AI-generated information can be incorrect; independently verify important output, especially for medical, legal, financial, or security decisions.
- This Windows executable is **not digitally code-signed**. Windows may show a security warning. Verify the file's source and integrity rather than ignoring security warnings.

### File integrity — Aurora V2

SHA-256 (`MiniAdam-V2.exe`):

```text
d2827956fb5b27f3d72995bf46b0e9f2ba11f699a13ba5db9f22e2a8441d2c37
```

Check it in PowerShell:

```powershell
Get-FileHash .\MiniAdam-V2.exe -Algorithm SHA256
```

The checksum above applies to this exact Aurora V2 build, not future releases.

## Known limitations

- The current app window uses Edge/Chrome **app mode**, not an embedded native Windows WebView. Taskbar icon behavior may vary.
- Model responses depend on local hardware, Ollama availability, and model capabilities.
- Native Windows + Ollama integration has **not yet been comprehensively tested across different PCs**; please report reproducible bugs.
- This repository distributes the **compiled Windows application only**. Source code is not published here.

## About the project

Made by **[Adam Marhasin (Pref1x)](https://github.com/pref1x-1)** as an experiment in making local AI more approachable and enjoyable to use.

MINI ADAM is an independent project and is **not affiliated with Ollama, Hugging Face, or any model provider**.

---

<div align="center">

**Local AI. Your machine. Your workflow.**

</div>
