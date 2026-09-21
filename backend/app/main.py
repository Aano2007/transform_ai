from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
import asyncio
import json
import os
import uuid
from typing import Dict, Any

from app.config import GENERATED_DIR, HOST, PORT, OLLAMA_HOST, OLLAMA_MODEL
from app.models.ico import (
    TransformRequest, TransformResponse, IntentContextObject,
    RegenerateSlideRequest, RegenerateFormatRequest, SlideItem,
    SaveHistoryRequest
)
from app.services.llm_service import (
    extract_ico_from_text, generate_llm_response, clean_json_string,
    check_ollama_available, generate_heuristic_output
)
from app.services.pptx_service import create_presentation_deck
from app.services.docx_service import create_executive_docx
from app.services.db_service import (
    init_db, save_transformation_to_db, get_all_history,
    get_history_by_id, delete_history_by_id
)
from app.prompts.exec_summary import EXEC_SUMMARY_PROMPT
from app.prompts.presentation import PRESENTATION_PROMPT
from app.prompts.linkedin import LINKEDIN_PROMPT
from app.prompts.twitter import TWITTER_PROMPT

app = FastAPI(
    title="TransformAI Compute Engine",
    description="Headless AI & Document Generator for Productivity Track",
    version="2.0.0"
)

@app.on_event("startup")
def on_startup():
    init_db()

# Enable CORS for Next.js PWA client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SAMPLE_TEMPLATES = [
    {
        "id": "strategy_sync",
        "title": "Product Strategy All-Hands",
        "category": "Strategy",
        "text": """Sync with Mobile Engineering and Product Strategy leads. Target launch is set for Q3 Sprint 4. 
We noticed daily workflow friction where engineers spend 45 minutes every morning translating voice notes and whiteboard diagrams into PowerPoint slides, executive summaries, and LinkedIn updates. 
Key decision: Deploy TransformAI on-device via Web Speech API and Tesseract WASM with headless laptop compute over local Wi-Fi. 
Metrics to hit: Under 60 seconds end-to-end transformation time, 0% hallucination drift using our Intent Context Object (ICO) architecture, and 100% offline operational capability when laptops are closed. 
Alex to finalize the PWA service worker by Friday 5 PM. 
Priya to calibrate python-pptx widescreen templates and Office Kit clipboard sync by Monday EOD. 
Leadership review scheduled for next Tuesday with VP of Product."""
    },
    {
        "id": "whiteboard_sprint",
        "title": "Q3 Growth Architecture Whiteboard",
        "category": "Whiteboard OCR",
        "text": """[WHITEBOARD SNAPSHOT - OCR TRANSCRIBED]
Objective: Scale user engagement across 12 product markets.
- Retention benchmark: Lift 30-day active retention from 42% to 58% by end of Q3.
- Core bottleneck: Complex onboarding and manual cross-device handoffs.
- Solution: Leverage shared clipboard and instant drag-and-drop file transfer.
- Action items:
  1. Frontend Team (David): Implement continuous speech-to-text with interim visualizer. Deadline: Nov 15.
  2. Core Engine (Sarah): Benchmark Llama-3.2-3B vs Qwen-2.5-7B latency. Deadline: Nov 18.
  3. Design (Michael): Polish mobile cyber dark aesthetic and slide carousel. Deadline: Nov 20.
Projected Impact: 3.4x faster deliverable turnaround."""
    },
    {
        "id": "voice_memo",
        "title": "Field Memo: Executive Client Debrief",
        "category": "Voice Memo",
        "text": """Quick voice memo from the offsite meeting in Singapore. The client loved our cross-device demonstration. 
Their biggest takeaway was the 'Honest Split'—how the phone processes speech and OCR locally, while the headless laptop churns out PowerPoint decks and executive summaries silently with the lid shut. 
They want a pilot deployment with 250 enterprise seats by next month. 
Our target conversion rate is 85%. 
Action items: Send customized executive summary and slide deck by tomorrow morning 10 AM. Team Lead to coordinate commercial proposal by Thursday. Key metrics: 99.8% uptime and enterprise SSO support."""
    }
]

# In-memory storage for active presentation data to support slide regeneration
CACHE_SLIDES: Dict[str, Any] = {}
CACHE_ICO: Dict[str, Any] = {}

@app.get("/health")
async def health_check():
    ollama_online = await check_ollama_available()
    return {
        "status": "online",
        "engine": "TransformAI Headless Compute",
        "version": "2.0",
        "hardware_split": "Phone Edge Capture + Laptop Local Wi-Fi Compute",
        "ollama_connected": ollama_online,
        "ollama_host": OLLAMA_HOST,
        "active_model": OLLAMA_MODEL,
        "mode": "Live Local LLM" if ollama_online else "High-Fidelity Heuristic Fallback"
    }

@app.get("/api/templates")
def get_sample_templates():
    return SAMPLE_TEMPLATES

@app.post("/api/transform", response_model=TransformResponse)
async def transform_raw_text(req: TransformRequest):
    if not req.raw_text or not req.raw_text.strip():
        raise HTTPException(status_code=400, detail="raw_text cannot be empty")

    session_id = str(uuid.uuid4())[:8]

    try:
        # Step 1: Structured Intent Context Object (ICO) Extraction
        ico_dict = await extract_ico_from_text(req.raw_text)
        ico = IntentContextObject(**ico_dict)
        ico_str = json.dumps(ico.model_dump(), indent=2)
        CACHE_ICO["latest"] = ico

        outputs = {}
        pptx_url = None
        docx_url = None

        # Step 2: Parallel Multi-Format Generation
        tasks = {}
        if "executive_summary" in req.formats:
            tasks["executive_summary"] = generate_llm_response(
                EXEC_SUMMARY_PROMPT.replace("{ico_json}", ico_str)
            )
        if "linkedin" in req.formats:
            tasks["linkedin"] = generate_llm_response(
                LINKEDIN_PROMPT.replace("{ico_json}", ico_str)
            )
        if "twitter" in req.formats:
            tasks["twitter"] = generate_llm_response(
                TWITTER_PROMPT.replace("{ico_json}", ico_str)
            )
        if "presentation" in req.formats:
            tasks["presentation"] = generate_llm_response(
                PRESENTATION_PROMPT.replace("{ico_json}", ico_str)
            )

        results = await asyncio.gather(*tasks.values(), return_exceptions=True)

        for key, result in zip(tasks.keys(), results):
            if isinstance(result, Exception):
                outputs[key] = f"Error generating {key}: {str(result)}"
            else:
                outputs[key] = result

        # Step 3: Parse Presentation JSON and Build .pptx File
        if "presentation" in outputs:
            slides_data = []
            try:
                slide_json_str = clean_json_string(outputs["presentation"])
                slides_data = json.loads(slide_json_str)
                if not isinstance(slides_data, list):
                    slides_data = slides_data.get("slides", [])
            except Exception as e:
                print(f"[Slide JSON Parse Warning]: {e}. Using structured fallback.")
                # Fallback to structured slides
                fallback_str = generate_heuristic_output("Presentation Architect 4-6 slide", "")
                slides_data = json.loads(clean_json_string(fallback_str))

            CACHE_SLIDES["latest"] = slides_data
            outputs["slides_data"] = slides_data

            pptx_filename = f"transformai_presentation_{session_id}.pptx"
            pptx_filepath = os.path.join(GENERATED_DIR, pptx_filename)
            create_presentation_deck(slides_data, pptx_filepath)
            pptx_url = f"/api/download/pptx?file={pptx_filename}"

        # Step 4: Build Executive Word Document (.docx)
        if "executive_summary" in outputs:
            docx_filename = f"transformai_brief_{session_id}.docx"
            docx_filepath = os.path.join(GENERATED_DIR, docx_filename)
            create_executive_docx(
                title=ico.event_title,
                summary_markdown=outputs["executive_summary"],
                ico_data=ico.model_dump(),
                output_path=docx_filepath
            )
            docx_url = f"/api/download/docx?file={docx_filename}"

        # Step 5: Persist to SQLite Database
        item_id = f"hist_{session_id}"
        save_transformation_to_db(
            item_id=item_id,
            title=ico.event_title or "Untitled Transformation",
            primary_objective=ico.primary_objective or "Transform deliverable",
            formats_count=len(outputs),
            source_text=req.raw_text,
            tone=req.tone,
            audience=req.audience,
            ico=ico.model_dump(),
            outputs=outputs,
            pptx_url=pptx_url,
            docx_url=docx_url
        )

        return TransformResponse(
            id=item_id,
            ico=ico,
            outputs=outputs,
            pptx_url=pptx_url,
            docx_url=docx_url,
            source_text=req.raw_text
        )
    except Exception as e:
        print(f"[Transform Error]: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/regenerate-slide")
async def regenerate_slide(req: RegenerateSlideRequest):
    """Regenerates an individual slide inside the active presentation."""
    slides = CACHE_SLIDES.get("latest", [])
    if not slides:
        raise HTTPException(status_code=404, detail="No active presentation deck found")

    slide_idx = req.slide_number - 1
    if slide_idx < 0 or slide_idx >= len(slides):
        raise HTTPException(status_code=400, detail=f"Slide number {req.slide_number} out of range")

    current_slide = slides[slide_idx]
    prompt = f"""Regenerate this specific slide:
Title: {current_slide.get('title')}
Bullets: {current_slide.get('bullets')}
Special Instructions: {req.instructions}

Respond with ONLY a single JSON object:
{{
  "slide_number": {req.slide_number},
  "title": "Refined Title",
  "subtitle": "Updated Subtitle",
  "bullets": ["Refined point 1", "Refined point 2", "Refined point 3"],
  "speaker_notes": "Polished speaker notes"
}}
"""
    response_str = await generate_llm_response(prompt)
    try:
        updated_slide = json.loads(clean_json_string(response_str))
        slides[slide_idx] = updated_slide
    except Exception:
        slides[slide_idx]["bullets"] = [
            f"Optimized: {b}" for b in slides[slide_idx].get("bullets", [])
        ]
        slides[slide_idx]["speaker_notes"] += " [Regenerated for heightened executive impact]"

    # Rebuild PPTX
    session_id = str(uuid.uuid4())[:8]
    pptx_filename = f"transformai_presentation_{session_id}.pptx"
    pptx_filepath = os.path.join(GENERATED_DIR, pptx_filename)
    create_presentation_deck(slides, pptx_filepath)

    return {
        "slide": slides[slide_idx],
        "all_slides": slides,
        "pptx_url": f"/api/download/pptx?file={pptx_filename}"
    }

@app.post("/api/regenerate-format")
async def regenerate_format(req: RegenerateFormatRequest):
    """Regenerates a single format (e.g. LinkedIn or Twitter) with modified tone/audience."""
    ico_str = json.dumps(req.ico.model_dump(), indent=2)
    format_type = req.format_type

    prompt_map = {
        "executive_summary": EXEC_SUMMARY_PROMPT,
        "linkedin": LINKEDIN_PROMPT,
        "twitter": TWITTER_PROMPT,
        "presentation": PRESENTATION_PROMPT
    }

    if format_type not in prompt_map:
        raise HTTPException(status_code=400, detail=f"Unknown format type {format_type}")

    prompt = prompt_map[format_type].replace("{ico_json}", ico_str)
    prompt += f"\nTone adjustment: {req.tone}. Target audience: {req.audience}."

    result = await generate_llm_response(prompt)
    return {"format_type": format_type, "content": result}

@app.get("/api/download/pptx")
def download_pptx(file: str = "transformai_presentation.pptx"):
    # Sanitize file param to prevent path traversal
    safe_name = os.path.basename(file)
    filepath = os.path.join(GENERATED_DIR, safe_name)
    if not os.path.exists(filepath):
        # Check default presentation fallback
        default_files = [f for f in os.listdir(GENERATED_DIR) if f.endswith(".pptx")]
        if default_files:
            filepath = os.path.join(GENERATED_DIR, default_files[-1])
        else:
            raise HTTPException(status_code=404, detail="PPTX file not found")

    return FileResponse(
        filepath,
        filename="TransformAI_Deck.pptx",
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation"
    )

@app.get("/api/download/docx")
def download_docx(file: str = "transformai_brief.docx"):
    safe_name = os.path.basename(file)
    filepath = os.path.join(GENERATED_DIR, safe_name)
    if not os.path.exists(filepath):
        default_files = [f for f in os.listdir(GENERATED_DIR) if f.endswith(".docx")]
        if default_files:
            filepath = os.path.join(GENERATED_DIR, default_files[-1])
        else:
            raise HTTPException(status_code=404, detail="Word DOCX file not found")

    return FileResponse(
        filepath,
        filename="TransformAI_Brief.docx",
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )

@app.get("/api/history")
async def get_history(limit: int = 30):
    """Retrieve list of saved transformations from SQLite database."""
    return get_all_history(limit=limit)

@app.get("/api/history/{item_id}")
async def get_single_history(item_id: str):
    """Retrieve full saved transformation record by ID."""
    record = get_history_by_id(item_id)
    if not record:
        raise HTTPException(status_code=404, detail="Transformation record not found")
    return record

@app.post("/api/history")
async def save_history_item(req: SaveHistoryRequest):
    """Manually save or update a transformation record in SQLite."""
    item_id = req.id or f"hist_{uuid.uuid4().hex[:8]}"
    saved = save_transformation_to_db(
        item_id=item_id,
        title=req.title,
        primary_objective=req.primary_objective or "",
        formats_count=req.formats_count,
        source_text=req.source_text or "",
        tone=req.tone or "professional",
        audience=req.audience or "executive",
        ico=req.ico,
        outputs=req.outputs,
        pptx_url=req.pptx_url,
        docx_url=req.docx_url
    )
    return saved

@app.delete("/api/history/{item_id}")
async def delete_single_history(item_id: str):
    """Delete a transformation record from SQLite database."""
    deleted = delete_history_by_id(item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Record not found")
    return {"status": "deleted", "id": item_id}

