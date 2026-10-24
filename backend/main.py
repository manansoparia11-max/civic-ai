"""
CivicSnap AI – FastAPI Application Backend.

Provides endpoints for:
- AI Image Analysis (Gemini 2.0 Flash Vision + EXIF GPS extraction)
- AMC Ward & Department Auto-Routing
- Complaint Management (Local JSON Database persistence)
- AI Citizen Chatbot (CivicBot AI with live DB context)
- Live AI Agent Tool Activity Log
- Static Image Uploads & Serving
"""

from __future__ import annotations

import os
import random
import string
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from db import (
    DATA_DIR,
    load_complaints,
    save_complaints,
    get_complaint_by_id,
    add_complaint,
    update_complaint,
    delete_complaint,
    get_metrics,
    reset_db,
)
from gemini_agent import (
    analyze_image,
    chat_response,
    get_tool_calls_log,
    log_tool_call,
    update_gemini_api_key,
    test_gemini_connection,
)
from wards import (
    detect_ward,
    detect_ward_by_coords,
    extract_gps_from_image,
    detect_department,
    ALL_WARDS,
)

IST = timezone(timedelta(hours=5, minutes=30))
UPLOADS_DIR = DATA_DIR / "uploads"

# ---------------------------------------------------------------------------
# App & CORS
# ---------------------------------------------------------------------------
app = FastAPI(
    title="CivicSnap AI Backend",
    description="Intelligent Municipal Complaint Triage Engine for Ahmedabad",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    # Ensure database is seeded on startup
    load_complaints()
    log_tool_call(
        "system_startup",
        "CivicSnap AI municipal backend initialized with local JSON persistence",
        status="success",
    )


# Mount uploads directory for serving photos
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR), check_dir=False), name="uploads")


# ---------------------------------------------------------------------------
# Pydantic Schemas
# ---------------------------------------------------------------------------
class CreateComplaintBody(BaseModel):
    title: str
    category: str
    description: str
    severity: str
    hazardScore: int = 75
    confidence: float = 95.0
    roadSpaceReductionPct: int | None = 30
    roadSpaceImpact: str | None = None
    roadDamageType: str | None = None
    obstructionType: str | None = None
    ward: str = ""
    zone: str = ""
    location: str = ""
    coordinates: dict[str, float] | None = None
    department: str = ""
    reportedBy: str = "Civic Citizen"
    citizenPhone: str = "+91 98250 XXXXX"
    imageUrl: str = ""
    slaHours: int = 36



class UpdateComplaintBody(BaseModel):
    status: str | None = None
    resolutionNotes: str | None = None
    resolutionImageUrl: str | None = None


class ChatBody(BaseModel):
    message: str
    complaintId: str | None = None


class SettingsBody(BaseModel):
    apiKey: str


class TestKeyBody(BaseModel):
    apiKey: str | None = None


# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------
def _generate_tracking_id() -> str:
    """Generate AMC compliant unique ID e.g. AMC-2026-X89B4"""
    chars = string.ascii_uppercase + string.digits
    suffix = "".join(random.choices(chars, k=5))
    return f"AMC-2026-{suffix}"


def _now_formatted() -> str:
    return datetime.now(IST).strftime("%d %b %Y, %I:%M %p")


def _get_ward_coordinates(ward_name: str) -> dict[str, float]:
    for w in ALL_WARDS:
        if w["name"] == ward_name or ward_name.startswith(w["name"].split(" - ")[0]):
            return {"lat": w.get("lat", 23.0338), "lng": w.get("lng", 72.5467)}
    return {"lat": 23.0338, "lng": 72.5467}


# ---------------------------------------------------------------------------
# API Routes
# ---------------------------------------------------------------------------

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "CivicSnap AI", "time": datetime.now(IST).isoformat()}


# ---- 1. AI Image Analysis with EXIF GPS & Ward Auto-Detection ------------
@app.post("/api/analyze")
async def analyze_endpoint(
    image: UploadFile = File(...),
    location: str = Form(""),
    ward: str = Form(""),
):
    """
    Multi-modal intake:
    1. Extracts GPS coordinates from image EXIF if available.
    2. Runs Gemini 2.0 Flash Vision classification.
    3. Auto-detects AMC Ward & Zone.
    4. Auto-assigns Municipal Department.
    5. Returns unified diagnostic package and tool calls.
    """
    image_bytes = await image.read()
    mime_type = image.content_type or "image/jpeg"

    # Step A: EXIF GPS Extraction
    gps_lat, gps_lng = extract_gps_from_image(image_bytes)
    detected_coords = None
    resolved_ward = ward
    resolved_zone = ""
    resolved_location = location

    if gps_lat is not None and gps_lng is not None:
        detected_coords = {"lat": gps_lat, "lng": gps_lng}
        matched = detect_ward_by_coords(gps_lat, gps_lng)
        resolved_ward = matched["ward"]
        resolved_zone = matched["zone"]
        if not resolved_location:
            resolved_location = f"Near {resolved_ward.split(' - ')[-1]} (EXIF GPS: {gps_lat:.4f}, {gps_lng:.4f})"
        log_tool_call(
            "exif_gps_extraction",
            f"Extracted GPS from photo metadata: {gps_lat:.4f}°N, {gps_lng:.4f}°E → Matched to {resolved_ward} ({resolved_zone})",
            status="success",
            details={"lat": gps_lat, "lng": gps_lng, "ward": resolved_ward},
        )
    else:
        log_tool_call(
            "exif_gps_extraction",
            "No EXIF GPS tags found in uploaded photograph. Utilizing manual location text.",
            status="info",
        )
        if not resolved_ward and location:
            wd = detect_ward(location)
            resolved_ward = wd["ward"]
            resolved_zone = wd["zone"]
            log_tool_call(
                "amc_ward_lookup",
                f"Resolved location text '{location}' to {resolved_ward} ({resolved_zone})",
                status="success",
                details={"location": location, "ward": resolved_ward},
            )
        elif not resolved_zone and resolved_ward:
            resolved_zone = detect_ward(resolved_ward)["zone"]

    # Step B: Gemini Vision Analysis
    analysis = analyze_image(image_bytes, mime_type, location_hint=resolved_location or resolved_ward)
    tool_calls = analysis.pop("tool_calls", [])

    # Step C: Department Detection
    category = analysis.get("category", "Pothole & Road Cavity")
    description = analysis.get("description", "")
    department = detect_department(category, description)

    log_tool_call(
        "municipal_department_selection",
        f"Assigned defect '{category}' to {department}",
        status="success",
        details={"category": category, "department": department},
    )

    if not detected_coords:
        detected_coords = _get_ward_coordinates(resolved_ward)

    return JSONResponse(
        content={
            "analysis": {
                **analysis,
                "department": department,
            },
            "ward": resolved_ward or "Ward 9 - Bodakdev",
            "zone": resolved_zone or "North West Zone",
            "location": resolved_location,
            "coordinates": detected_coords,
            "department": department,
            "tool_calls": tool_calls,
        }
    )


# ---- 2. Complaint CRUD with Local JSON Persistence ------------------------
@app.post("/api/complaints")
async def create_complaint_endpoint(body: CreateComplaintBody):
    """Register and save a new citizen complaint into local JSON database."""
    tracking_id = _generate_tracking_id()
    now_dt = datetime.now(IST)
    now_iso = now_dt.isoformat()
    formatted_date = _now_formatted()
    sla_deadline = (now_dt + timedelta(hours=body.slaHours)).isoformat()

    # Ensure DEMO tag
    title = body.title.strip()
    if not title.startswith("[DEMO SUBMISSION]"):
        title = f"[DEMO SUBMISSION] {title}"

    ward = body.ward or "Ward 9 - Bodakdev"
    zone = body.zone or "North West Zone"
    department = body.department or detect_department(body.category, body.description)
    coordinates = body.coordinates or _get_ward_coordinates(ward)

    # Build standard timeline
    timeline = [
        {
            "stage": "Complaint Registered",
            "status": "completed",
            "timestamp": formatted_date,
            "note": f"CivicSnap AI verified defect with {body.confidence}% confidence. Ticket created.",
        },
        {
            "stage": "Ward Officer Verification",
            "status": "current",
            "timestamp": "In Progress (SLA: 2 hrs)",
            "note": f"Dispatched to {ward} Zonal Field Unit for on-site verification.",
        },
        {
            "stage": "Work Order Issued",
            "status": "upcoming",
            "timestamp": "Pending Verification",
            "note": f"Requisitioning materials & repair crew for {department}.",
        },
        {
            "stage": "Repair in Progress",
            "status": "upcoming",
            "timestamp": "Pending",
            "note": "Field remediation on site.",
        },
        {
            "stage": "Quality Audit & Resolved",
            "status": "upcoming",
            "timestamp": "Pending",
            "note": "AMC Quality Division before/after photographic sign-off.",
        },
    ]

    complaint = {
        "id": tracking_id,
        "title": title,
        "category": body.category,
        "description": body.description,
        "severity": body.severity,
        "hazardScore": body.hazardScore,
        "confidence": body.confidence,
        "roadSpaceReductionPct": body.roadSpaceReductionPct or 30,
        "roadSpaceImpact": body.roadSpaceImpact or "Reduces usable road space and disrupts traffic flow",
        "roadDamageType": body.roadDamageType or "Surface Defect & Traffic Obstruction",
        "obstructionType": body.obstructionType or body.category,
        "status": "Open",

        "ward": ward,
        "zone": zone,
        "location": body.location or "Ahmedabad, Gujarat",
        "coordinates": coordinates,
        "department": department,
        "assignedEngineer": f"Er. Nilesh Patel (AE - {ward.split(' - ')[-1]})",
        "fieldContractor": "AMC Quick Response Infrastructure Squad",
        "reportedBy": body.reportedBy,
        "citizenPhone": body.citizenPhone,
        "createdAt": now_iso,
        "slaDeadline": sla_deadline,
        "imageUrl": body.imageUrl,
        "resolutionImageUrl": None,
        "resolutionNotes": None,
        "timeline": timeline,
    }

    saved = add_complaint(complaint)

    log_tool_call(
        "complaint_registration",
        f"Registered complaint ticket {tracking_id} ({body.category} at {ward}) into complaints.json",
        status="success",
        details={"id": tracking_id, "ward": ward, "dept": department},
    )

    return JSONResponse(content=saved, status_code=201)


@app.get("/api/complaints")
async def list_complaints_endpoint(
    status: str | None = None,
    ward: str | None = None,
    severity: str | None = None,
    department: str | None = None,
    search: str | None = None,
):
    """Retrieve all complaints with optional filtering."""
    data = load_complaints()

    if status and status != "All":
        data = [c for c in data if c.get("status", "").lower() == status.lower()]
    if ward and ward != "All":
        data = [c for c in data if ward.lower() in c.get("ward", "").lower()]
    if severity and severity != "All":
        data = [c for c in data if c.get("severity", "").lower() == severity.lower()]
    if department and department != "All":
        data = [c for c in data if department.lower() in c.get("department", "").lower()]
    if search:
        q = search.lower().strip()
        data = [
            c for c in data
            if q in c.get("id", "").lower()
            or q in c.get("title", "").lower()
            or q in c.get("description", "").lower()
            or q in c.get("category", "").lower()
            or q in c.get("location", "").lower()
            or q in c.get("ward", "").lower()
            or q in c.get("reportedBy", "").lower()
        ]

    return JSONResponse(content=data)


@app.get("/api/complaints/{complaint_id}")
async def get_complaint_endpoint(complaint_id: str):
    """Retrieve details of a single complaint by tracking ID."""
    complaint = get_complaint_by_id(complaint_id)
    if not complaint:
        raise HTTPException(status_code=404, detail=f"Complaint {complaint_id} not found")
    
    log_tool_call(
        "status_retrieval",
        f"Retrieved complaint {complaint_id} (Status: {complaint.get('status')})",
        status="success",
    )
    return JSONResponse(content=complaint)


@app.patch("/api/complaints/{complaint_id}")
async def update_complaint_endpoint(complaint_id: str, body: UpdateComplaintBody):
    """Update complaint status (Open, In Progress, Resolved) and resolution notes."""
    existing = get_complaint_by_id(complaint_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Complaint not found")

    updates: dict[str, Any] = {}
    now_str = _now_formatted()

    if body.status:
        new_status = body.status
        updates["status"] = new_status
        timeline = [dict(t) for t in existing.get("timeline", [])]

        if new_status == "In Progress":
            if len(timeline) > 1:
                timeline[1]["status"] = "completed"
                timeline[1]["note"] = "Ward Officer verified on site."
            if len(timeline) > 2:
                timeline[2]["status"] = "completed"
                timeline[2]["timestamp"] = now_str
                timeline[2]["note"] = f"Work order dispatched to field squad."
            if len(timeline) > 3:
                timeline[3]["status"] = "current"
                timeline[3]["timestamp"] = now_str
                timeline[3]["note"] = body.resolutionNotes or "Repair crew mobilized on site."

        elif new_status == "Resolved":
            for idx, entry in enumerate(timeline):
                entry["status"] = "completed"
                if not entry.get("timestamp") or "Pending" in entry["timestamp"]:
                    entry["timestamp"] = now_str
                if idx == 4:
                    entry["note"] = body.resolutionNotes or "Inspection verified by AMC Quality Division. Citizen notified."

        elif new_status == "Open":
            if len(timeline) > 1:
                timeline[1]["status"] = "current"
            if len(timeline) > 2:
                timeline[2]["status"] = "upcoming"
            if len(timeline) > 3:
                timeline[3]["status"] = "upcoming"
            if len(timeline) > 4:
                timeline[4]["status"] = "upcoming"

        updates["timeline"] = timeline

    if body.resolutionNotes is not None:
        updates["resolutionNotes"] = body.resolutionNotes
    if body.resolutionImageUrl is not None:
        updates["resolutionImageUrl"] = body.resolutionImageUrl

    updated = update_complaint(complaint_id, updates)
    log_tool_call(
        "admin_status_update",
        f"Admin updated ticket {complaint_id} status to '{body.status}'",
        status="success",
        details={"id": complaint_id, "newStatus": body.status},
    )
    return JSONResponse(content=updated)


@app.delete("/api/complaints/{complaint_id}")
async def delete_complaint_endpoint(complaint_id: str):
    """Delete a complaint record."""
    deleted = delete_complaint(complaint_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Complaint not found")
    log_tool_call(
        "admin_delete",
        f"Deleted complaint ticket {complaint_id}",
        status="success",
    )
    return JSONResponse(content={"message": "Complaint deleted successfully", "id": complaint_id})


@app.post("/api/complaints/reset")
async def reset_complaints_endpoint():
    """Reset the local complaints.json database to seed complaints."""
    data = reset_db()
    log_tool_call(
        "database_reset",
        f"Reset database to {len(data)} seed complaints",
        status="success",
    )
    return JSONResponse(content={"message": "Database reset to sample data", "count": len(data)})


@app.get("/api/metrics")
async def get_metrics_endpoint():
    """Get summarized statistics for AMC Admin Dashboard."""
    return JSONResponse(content=get_metrics())


# ---- 3. AI Chatbot (CivicBot AI with live DB lookup) ---------------------
@app.post("/api/chat")
async def chat_endpoint(body: ChatBody):
    """Engage with CivicBot AI to track status, verify repair, or ask civic questions."""
    all_complaints = load_complaints()
    complaint_data = None

    if body.complaintId:
        complaint_data = get_complaint_by_id(body.complaintId)

    reply_text, tool_calls = chat_response(
        user_message=body.message,
        complaint_data=complaint_data,
        all_complaints=all_complaints,
    )

    return JSONResponse(
        content={
            "reply": reply_text,
            "tool_calls": tool_calls,
        }
    )


# ---- 4. Live AI Agent Activity Log ---------------------------------------
@app.get("/api/agent/activity")
async def agent_activity_endpoint(limit: int = 15):
    """Return the live stream of AI tool calls."""
    return JSONResponse(content=get_tool_calls_log(limit=limit))


# ---- 5. File Uploads -----------------------------------------------------
@app.post("/api/upload-image")
async def upload_image_endpoint(image: UploadFile = File(...)):
    """Save an uploaded image file locally and return its accessible URL."""
    ext = Path(image.filename or "photo.jpg").suffix.lower() or ".jpg"
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = UPLOADS_DIR / filename

    content = await image.read()
    with open(filepath, "wb") as f:
        f.write(content)

    return JSONResponse(content={"url": f"/uploads/{filename}", "filename": filename})


# ---- 6. Settings & Gemini API Key Management ----------------------------
@app.get("/api/settings")
async def get_settings_endpoint():
    """Return the current system configuration and Gemini API key status."""
    raw_key = os.getenv("GEMINI_API_KEY", "").strip()
    has_key = bool(raw_key and raw_key != "your_gemini_api_key_here")
    masked_key = ""
    if has_key:
        if len(raw_key) > 8:
            masked_key = f"{raw_key[:4]}••••••••••••{raw_key[-4:]}"
        else:
            masked_key = "••••••••"

    return JSONResponse(
        content={
            "hasKey": has_key,
            "maskedKey": masked_key,
            "model": "gemini-2.0-flash",
            "fallbackEnabled": True,
            "persistenceMode": "Local JSON Storage (backend/data/complaints.json)",
            "service": "CivicSnap AI Governance Engine",
        }
    )


@app.post("/api/settings")
async def update_settings_endpoint(body: SettingsBody):
    """Update runtime Gemini API key and persist to .env."""
    success = update_gemini_api_key(body.apiKey)
    return JSONResponse(
        content={
            "success": success,
            "message": "Gemini API key updated successfully" if success else "API key cleared or invalid",
            "hasKey": bool(body.apiKey.strip() and body.apiKey.strip() != "your_gemini_api_key_here"),
        }
    )


@app.post("/api/settings/test-key")
async def test_key_endpoint(body: TestKeyBody | None = None):
    """Test the Gemini API key with a live ping to gemini-2.0-flash."""
    key = body.apiKey if body else None
    result = test_gemini_connection(api_key=key)
    return JSONResponse(content=result)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
