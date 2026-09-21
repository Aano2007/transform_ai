from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class ActionItem(BaseModel):
    owner: str = Field(description="Responsible team or individual")
    task: str = Field(description="Actionable task description")
    deadline: str = Field(default="TBD", description="Target completion date or time")

class EntityList(BaseModel):
    teams: List[str] = Field(default_factory=list, description="Extracted teams or departments")
    dates: List[str] = Field(default_factory=list, description="Extracted dates and timelines")
    metrics: List[str] = Field(default_factory=list, description="Extracted numbers, KPIs, or metrics")

class Citation(BaseModel):
    id: int = Field(description="Citation index [1], [2], etc.")
    claim: str = Field(description="Generated claim or finding")
    source_quote: str = Field(description="Exact or fuzzy snippet from original input text")

class SlideItem(BaseModel):
    slide_number: int = Field(default=1, description="Sequential slide index")
    title: str = Field(description="Slide heading")
    subtitle: Optional[str] = Field(default="", description="Slide subheading")
    bullets: List[str] = Field(default_factory=list, description="Slide bullet points")
    speaker_notes: Optional[str] = Field(default="", description="Executive speaker notes")

class IntentContextObject(BaseModel):
    event_title: str = Field(description="Title or topic of the input")
    timestamp: Optional[str] = Field(default="Recent", description="Extracted date or time")
    location: Optional[str] = Field(default="Virtual / On-site", description="Location or venue")
    primary_objective: str = Field(description="Core purpose or summary sentence")
    executive_overview: str = Field(description="2-3 sentence high-level summary")
    key_findings: List[str] = Field(default_factory=list, description="Bullet points of key findings")
    action_items: List[ActionItem] = Field(default_factory=list, description="Extracted action items")
    entities: EntityList = Field(default_factory=EntityList, description="Named entities extracted")
    tone_override: Optional[str] = Field(default="professional", description="Selected tone")
    format_flags: List[str] = Field(default_factory=list, description="Target output formats")
    citations: List[Citation] = Field(default_factory=list, description="Source citation mappings")

class TransformRequest(BaseModel):
    raw_text: str
    formats: List[str] = ["executive_summary", "presentation", "linkedin", "twitter"]
    tone: str = "professional"
    audience: str = "executive"

class TransformResponse(BaseModel):
    ico: IntentContextObject
    outputs: Dict[str, Any]
    pptx_url: Optional[str] = None
    docx_url: Optional[str] = None
    source_text: str = ""

class RegenerateSlideRequest(BaseModel):
    ico: IntentContextObject
    slide_number: int
    instructions: Optional[str] = "Make it more concise and impact-driven"

class RegenerateFormatRequest(BaseModel):
    ico: IntentContextObject
    format_type: str
    tone: Optional[str] = "professional"
    audience: Optional[str] = "executive"
