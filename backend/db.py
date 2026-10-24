"""
Local JSON-file database manager for CivicSnap AI complaints.

- Stores complaints in ``backend/data/complaints.json``
- Auto-creates the data directory and seed file on first run
- Thread-safe read / write with a reentrant lock
"""

from __future__ import annotations

import json
import os
import threading
from copy import deepcopy
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
_BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = _BASE_DIR / "data"
DB_FILE = DATA_DIR / "complaints.json"

# Thread-safety lock
_lock = threading.RLock()

# ---------------------------------------------------------------------------
# Seed data
# ---------------------------------------------------------------------------
IST = timezone(timedelta(hours=5, minutes=30))

def _now_iso() -> str:
    return datetime.now(IST).isoformat()


SEED_COMPLAINTS: list[dict[str, Any]] = [
    {
        "id": "AMC-2026-X89B4",
        "title": "Pothole on Sindhu Bhavan Road",
        "category": "Pothole & Road Cavity",
        "description": "Large pothole approximately 2ft wide and 6 inches deep on the main carriageway of Sindhu Bhavan Road near Pakwan Cross Roads. Multiple vehicles have been damaged. Immediate repair needed before monsoon worsens the cavity.",
        "severity": "High",
        "hazardScore": 78,
        "confidence": 92.5,
        "status": "In Progress",
        "ward": "Ward 9 - Bodakdev",
        "zone": "West Zone",
        "location": "Sindhu Bhavan Road, near Pakwan Cross Roads, Bodakdev",
        "coordinates": {"lat": 23.0365, "lng": 72.5112},
        "department": "Roads & Buildings Project Dept",
        "assignedEngineer": "Er. Rajesh Patel",
        "fieldContractor": "ABC Infrastructure Pvt. Ltd.",
        "reportedBy": "Amit Shah",
        "citizenPhone": "+91 98765 43210",
        "createdAt": "2026-10-20T09:15:00+05:30",
        "slaDeadline": "2026-10-22T09:15:00+05:30",
        "imageUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400",
        "resolutionImageUrl": None,
        "resolutionNotes": None,
        "timeline": [
            {"stage": "Reported", "status": "completed", "timestamp": "2026-10-20T09:15:00+05:30", "note": "Complaint registered via CivicSnap AI"},
            {"stage": "AI Analysis", "status": "completed", "timestamp": "2026-10-20T09:15:05+05:30", "note": "AI classified as Pothole & Road Cavity with 92.5% confidence"},
            {"stage": "Assigned", "status": "completed", "timestamp": "2026-10-20T10:30:00+05:30", "note": "Assigned to Er. Rajesh Patel, Roads & Buildings Dept"},
            {"stage": "In Progress", "status": "current", "timestamp": "2026-10-21T08:00:00+05:30", "note": "Contractor dispatched, repair work initiated"},
            {"stage": "Resolved", "status": "upcoming", "timestamp": "", "note": ""},
        ],
    },
    {
        "id": "AMC-2026-G2F7L",
        "title": "Overflowing Garbage at Vastrapur Lake",
        "category": "Solid Waste & Overflowing Bin",
        "description": "Multiple garbage bins near Vastrapur Lake entrance are overflowing. Waste is scattered across the walkway creating an unhygienic environment. Stray animals are spreading waste further. Strong foul odour reported by morning walkers.",
        "severity": "Critical",
        "hazardScore": 89,
        "confidence": 95.0,
        "status": "Open",
        "ward": "Ward 8 - Vastrapur",
        "zone": "West Zone",
        "location": "Vastrapur Lake, Main Entrance, Vastrapur",
        "coordinates": {"lat": 23.0308, "lng": 72.5294},
        "department": "Solid Waste Management Dept",
        "assignedEngineer": "Unassigned",
        "fieldContractor": "Unassigned",
        "reportedBy": "Priya Mehta",
        "citizenPhone": "+91 87654 32109",
        "createdAt": "2026-10-22T07:30:00+05:30",
        "slaDeadline": "2026-10-23T07:30:00+05:30",
        "imageUrl": "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400",
        "resolutionImageUrl": None,
        "resolutionNotes": None,
        "timeline": [
            {"stage": "Reported", "status": "completed", "timestamp": "2026-10-22T07:30:00+05:30", "note": "Complaint registered via CivicSnap AI"},
            {"stage": "AI Analysis", "status": "completed", "timestamp": "2026-10-22T07:30:04+05:30", "note": "AI classified as Solid Waste & Overflowing Bin with 95.0% confidence"},
            {"stage": "Assigned", "status": "upcoming", "timestamp": "", "note": ""},
            {"stage": "In Progress", "status": "upcoming", "timestamp": "", "note": ""},
            {"stage": "Resolved", "status": "upcoming", "timestamp": "", "note": ""},
        ],
    },
    {
        "id": "AMC-2026-L1R9P",
        "title": "Broken Streetlight at Navrangpura",
        "category": "Broken Streetlight & Electrical Hazard",
        "description": "Streetlight pole near Navrangpura AMTS bus stop has a broken lamp and exposed wiring. The area is completely dark after sunset posing safety risk for pedestrians and commuters. Sparking observed during rain.",
        "severity": "Critical",
        "hazardScore": 91,
        "confidence": 88.0,
        "status": "Open",
        "ward": "Ward 14 - Navrangpura",
        "zone": "North-West Zone",
        "location": "Near AMTS Bus Stop, Navrangpura",
        "coordinates": {"lat": 23.0396, "lng": 72.5601},
        "department": "Street Lighting & Electrical Dept",
        "assignedEngineer": "Unassigned",
        "fieldContractor": "Unassigned",
        "reportedBy": "Vikram Joshi",
        "citizenPhone": "+91 76543 21098",
        "createdAt": "2026-10-23T18:45:00+05:30",
        "slaDeadline": "2026-10-24T18:45:00+05:30",
        "imageUrl": "https://images.unsplash.com/photo-1617953141700-ace03f9c1604?w=400",
        "resolutionImageUrl": None,
        "resolutionNotes": None,
        "timeline": [
            {"stage": "Reported", "status": "completed", "timestamp": "2026-10-23T18:45:00+05:30", "note": "Complaint registered via CivicSnap AI"},
            {"stage": "AI Analysis", "status": "completed", "timestamp": "2026-10-23T18:45:03+05:30", "note": "AI classified as Broken Streetlight & Electrical Hazard with 88.0% confidence"},
            {"stage": "Assigned", "status": "upcoming", "timestamp": "", "note": ""},
            {"stage": "In Progress", "status": "upcoming", "timestamp": "", "note": ""},
            {"stage": "Resolved", "status": "upcoming", "timestamp": "", "note": ""},
        ],
    },
    {
        "id": "AMC-2026-W5K3M",
        "title": "Water Pipeline Burst at Satellite",
        "category": "Water Supply & Drainage Leak",
        "description": "Major water pipeline burst on 100 Feet Ring Road near Shyamal Cross Roads. Water gushing out onto the road causing traffic disruption and water wastage. Road surface eroding around the burst area. Multiple households reporting low water pressure.",
        "severity": "High",
        "hazardScore": 82,
        "confidence": 90.0,
        "status": "In Progress",
        "ward": "Ward 11 - Satellite",
        "zone": "West Zone",
        "location": "100 Feet Ring Road, near Shyamal Cross Roads, Satellite",
        "coordinates": {"lat": 23.0170, "lng": 72.5290},
        "department": "Water Supply & Drainage Dept",
        "assignedEngineer": "Er. Meena Sharma",
        "fieldContractor": "Gujarat Water Works Co.",
        "reportedBy": "Rahul Desai",
        "citizenPhone": "+91 65432 10987",
        "createdAt": "2026-10-21T14:20:00+05:30",
        "slaDeadline": "2026-10-23T14:20:00+05:30",
        "imageUrl": "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=400",
        "resolutionImageUrl": None,
        "resolutionNotes": None,
        "timeline": [
            {"stage": "Reported", "status": "completed", "timestamp": "2026-10-21T14:20:00+05:30", "note": "Complaint registered via CivicSnap AI"},
            {"stage": "AI Analysis", "status": "completed", "timestamp": "2026-10-21T14:20:06+05:30", "note": "AI classified as Water Supply & Drainage Leak with 90.0% confidence"},
            {"stage": "Assigned", "status": "completed", "timestamp": "2026-10-21T15:00:00+05:30", "note": "Assigned to Er. Meena Sharma, Water Supply & Drainage Dept"},
            {"stage": "In Progress", "status": "current", "timestamp": "2026-10-22T07:30:00+05:30", "note": "Excavation and pipe replacement underway"},
            {"stage": "Resolved", "status": "upcoming", "timestamp": "", "note": ""},
        ],
    },
    {
        "id": "AMC-2026-F4N8Q",
        "title": "Broken Paver Blocks at Kankaria",
        "category": "Footpath & Pedestrian Infrastructure",
        "description": "Several paver blocks on the walking track near Kankaria Lake main gate are broken and uneven. Senior citizens and children are at risk of tripping. Some blocks have sunk creating puddles during rain.",
        "severity": "Medium",
        "hazardScore": 55,
        "confidence": 87.5,
        "status": "Resolved",
        "ward": "Ward 22 - Maninagar",
        "zone": "East Zone",
        "location": "Kankaria Lake, Main Gate Walking Track, Maninagar",
        "coordinates": {"lat": 23.0067, "lng": 72.6002},
        "department": "Roads & Buildings Project Dept",
        "assignedEngineer": "Er. Suresh Vaghela",
        "fieldContractor": "Patel Paving Solutions",
        "reportedBy": "Neha Trivedi",
        "citizenPhone": "+91 54321 09876",
        "createdAt": "2026-10-15T11:00:00+05:30",
        "slaDeadline": "2026-10-18T11:00:00+05:30",
        "imageUrl": "https://images.unsplash.com/photo-1590496793929-36417d3117de?w=400",
        "resolutionImageUrl": "https://images.unsplash.com/photo-1590496793929-36417d3117de?w=400",
        "resolutionNotes": "All broken paver blocks replaced with new interlocking pavers. Surface levelled and drainage improved. Work inspected and approved by ward engineer.",
        "timeline": [
            {"stage": "Reported", "status": "completed", "timestamp": "2026-10-15T11:00:00+05:30", "note": "Complaint registered via CivicSnap AI"},
            {"stage": "AI Analysis", "status": "completed", "timestamp": "2026-10-15T11:00:04+05:30", "note": "AI classified as Footpath & Pedestrian Infrastructure with 87.5% confidence"},
            {"stage": "Assigned", "status": "completed", "timestamp": "2026-10-15T14:00:00+05:30", "note": "Assigned to Er. Suresh Vaghela, Roads & Buildings Dept"},
            {"stage": "In Progress", "status": "completed", "timestamp": "2026-10-16T09:00:00+05:30", "note": "Contractor on site, paver replacement started"},
            {"stage": "Resolved", "status": "completed", "timestamp": "2026-10-17T16:30:00+05:30", "note": "Repair completed and verified by ward engineer"},
        ],
    },
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _ensure_data_dir() -> None:
    """Create the data directory and seed the DB file if they don't exist."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not DB_FILE.exists():
        _write_raw(SEED_COMPLAINTS)


def _write_raw(data: list[dict[str, Any]]) -> None:
    """Write *data* to the JSON file (no lock — caller must hold it or be in init)."""
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def _read_raw() -> list[dict[str, Any]]:
    """Read and return data from the JSON file (no lock)."""
    try:
        with open(DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def load_complaints() -> list[dict[str, Any]]:
    """Return a deep-copied list of all complaints."""
    with _lock:
        _ensure_data_dir()
        return deepcopy(_read_raw())


def save_complaints(data: list[dict[str, Any]]) -> None:
    """Overwrite the database with *data*."""
    with _lock:
        _ensure_data_dir()
        _write_raw(data)


def get_complaint_by_id(complaint_id: str) -> dict[str, Any] | None:
    """Return a single complaint dict or ``None``."""
    with _lock:
        _ensure_data_dir()
        for c in _read_raw():
            if c["id"] == complaint_id:
                return deepcopy(c)
    return None


def add_complaint(complaint_dict: dict[str, Any]) -> dict[str, Any]:
    """Append a new complaint and return the saved copy."""
    with _lock:
        _ensure_data_dir()
        data = _read_raw()
        data.append(complaint_dict)
        _write_raw(data)
        return deepcopy(complaint_dict)


def update_complaint(complaint_id: str, updates: dict[str, Any]) -> dict[str, Any] | None:
    """
    Merge *updates* into the complaint identified by *complaint_id*.
    Returns the updated complaint or ``None`` if not found.
    """
    with _lock:
        _ensure_data_dir()
        data = _read_raw()
        for i, c in enumerate(data):
            if c["id"] == complaint_id:
                c.update(updates)
                data[i] = c
                _write_raw(data)
                return deepcopy(c)
    return None


def delete_complaint(complaint_id: str) -> bool:
    """Delete a complaint by ID.  Returns ``True`` if found and removed."""
    with _lock:
        _ensure_data_dir()
        data = _read_raw()
        new_data = [c for c in data if c["id"] != complaint_id]
        if len(new_data) == len(data):
            return False
        _write_raw(new_data)
        return True


def reset_db() -> list[dict[str, Any]]:
    """Reset the database to the initial seed data."""
    with _lock:
        _ensure_data_dir()
        _write_raw(SEED_COMPLAINTS)
        return deepcopy(SEED_COMPLAINTS)


def get_metrics() -> dict[str, Any]:
    """Return aggregate metrics across all complaints."""
    with _lock:
        _ensure_data_dir()
        data = _read_raw()

    total = len(data)
    open_count = sum(1 for c in data if c["status"] == "Open")
    in_progress = sum(1 for c in data if c["status"] == "In Progress")
    resolved = sum(1 for c in data if c["status"] == "Resolved")
    critical = sum(1 for c in data if c["severity"] == "Critical")
    high = sum(1 for c in data if c["severity"] == "High")
    medium = sum(1 for c in data if c["severity"] == "Medium")
    low = sum(1 for c in data if c["severity"] == "Low")

    avg_hazard = round(sum(c.get("hazardScore", 0) for c in data) / max(total, 1), 1)

    # Per-category counts
    categories: dict[str, int] = {}
    for c in data:
        cat = c.get("category", "Unknown")
        categories[cat] = categories.get(cat, 0) + 1

    # Per-ward counts
    wards: dict[str, int] = {}
    for c in data:
        w = c.get("ward", "Unknown")
        wards[w] = wards.get(w, 0) + 1

    return {
        "total": total,
        "open": open_count,
        "inProgress": in_progress,
        "resolved": resolved,
        "critical": critical,
        "high": high,
        "medium": medium,
        "low": low,
        "avgHazardScore": avg_hazard,
        "byCategory": categories,
        "byWard": wards,
        "resolutionRate": round((resolved / max(total, 1)) * 100, 1),
    }


# Auto-ensure data dir and seeds on import
_ensure_data_dir()

