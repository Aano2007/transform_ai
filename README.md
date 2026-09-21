# TransformAI

> **"One voice memo → four finished deliverables. No typing, no ChatGPT prompts, no manual formatting."**

Designed for the **iQOO Hackathon Productivity Track**. TransformAI captures chaotic unstructured inputs (voice memos, whiteboard photos, rough notes) and synthesizes them into four polished, multi-format professional deliverables in under 60 seconds.

---

## ⚡ The Honest Split Architecture

TransformAI splits hardware duties cleanly between edge client capture and headless local compute:

```text
[ iQOO Phone (Browser / PWA) ]
  ├── Voice Input → Web Speech API (On-Device STT)
  ├── Camera Input → Tesseract.js WASM (On-Device OCR)
  └── Text Normalizer → JavaScript
           │
           ▼ HTTP POST (Local Wi-Fi)
[ Laptop (Headless Compute Engine) ]
  ├── FastAPI (Async REST Server, port 8000)
  ├── Ollama LLM Engine (Llama-3.2-3B / Qwen-2.5-7B) → Extracts ICO JSON
  ├── Parallel Generator → 4 Format Prompts
  └── Template Exporters → python-pptx (.pptx) & python-docx (.docx)
```

---

## 🚀 Quick Start

### 1. Launch Backend Compute Engine (Laptop Layer)
```bash
cd backend
pip install -r requirements.txt
python run.py
```
*Backend runs on `http://127.0.0.1:8000` with Swagger UI at `/docs`.*

### 2. Launch Frontend PWA (iQOO Phone Layer)
```bash
cd frontend
npm install
npm run dev
```
*Or from the root folder:*
```bash
npm run dev
```
*Frontend runs on `http://localhost:3000`.*

---

## 📱 App Screens (All 4 Screens Implemented)

1. **Screen 1: Home Screen (`/`)**:
   - Tagline: *"Capture Raw. Deliver Polished."*
   - Primary `+ NEW TRANSFORMATION` trigger.
   - 3 Quick-start shortcuts: Voice, Scan OCR, Type/Paste.
   - 1-Click Demo Benchmarks for instant pitch testing.
   - Persisted Recent Transformations list.

2. **Screen 2: Capture + Configure (`/capture`)**:
   - Mode switcher: Voice (Web Speech API + visualizer), Camera (Tesseract.js WASM), Text.
   - Live telemetry preview window.
   - 4 Format Checkboxes + Tone & Audience dropdowns.
   - Prominent `TRANSFORM` button.

3. **Screen 3: Studio Results (`/studio`)**:
   - Tabbed deliverables: Executive Summary, Slides Preview, LinkedIn Post, Twitter Thread, ICO JSON Inspector.
   - Interactive source citations `[1]`, `[2]` linking back to source input sentences.
   - Section regeneration buttons.
   - Action Bar: Copy (with iQOO Office Kit synced toast), Share, `.PPTX` and `.DOCX` downloads.

4. **Screen 4: Slide Detail View (`/slides`)**:
   - 16:9 widescreen slide carousel with arrow navigation.
   - Speaker script notes box per slide.
   - Dedicated `.pptx` download and individual slide refine triggers.

---

## 🎯 12 Core Features Matrix

| ID | Feature | Execution Node | Status |
|---|---|---|---|
| **F1** | Voice capture → on-device transcription via Web Speech API | Phone (Edge) | ✅ Implemented |
| **F2** | Camera capture → on-device OCR via Tesseract.js (WASM) | Phone (Edge) | ✅ Implemented |
| **F3** | Text paste / direct keyboard entry | Phone (Edge) | ✅ Implemented |
| **F4** | Format selector (4 checkboxes + tone/audience dropdowns) | Phone (Edge) | ✅ Implemented |
| **F5** | ICO extraction via local LLM (structured JSON extraction) | Laptop (Headless) | ✅ Implemented |
| **F6** | Parallel 4-format generation from ICO | Laptop (Headless) | ✅ Implemented |
| **F7** | Tabbed Studio results view with source citations | Phone (Edge) | ✅ Implemented |
| **F8** | Copy to clipboard (triggers iQOO Office Kit shared clipboard sync) | Bridge | ✅ Implemented |
| **F9** | Export .pptx file (download on phone → drag via Office Kit) | Bridge | ✅ Implemented |
| **F10**| Source citation markers linking output statements to input text | Laptop + UI | ✅ Implemented |
| **F11**| Regenerate individual sections or slides | Laptop + UI | ✅ Implemented |
| **F12**| Streaming token output / progressive rendering in Studio UI | UI | ✅ Implemented |
