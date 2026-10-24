"""
AMC (Ahmedabad Municipal Corporation) ward, zone, and department data.
Provides ward detection from location text, GPS coordinates from photo EXIF,
and department mapping from categories.
"""

from __future__ import annotations

import io
import math
from typing import Any
from PIL import Image, ExifTags

# ---------------------------------------------------------------------------
# Zone → Wards mapping (matches AMC official administrative zones)
# ---------------------------------------------------------------------------
AMC_ZONES = [
    {
        "id": "north-west",
        "name": "North West Zone",
        "wards": [
            {"id": "ward-08", "name": "Ward 8 - Vastrapur", "office": "Bodakdev Civic Center", "contact": "079-26871020", "lat": 23.0358, "lng": 72.5284},
            {"id": "ward-09", "name": "Ward 9 - Bodakdev", "office": "Sindhu Bhavan Zonal Office", "contact": "079-26871021", "lat": 23.0428, "lng": 72.5065},
            {"id": "ward-10", "name": "Ward 10 - Thaltej", "office": "Thaltej Ward Office", "contact": "079-26871022", "lat": 23.0515, "lng": 72.5120},
            {"id": "ward-01", "name": "Ward 1 - Gota", "office": "Gota Civic Center", "contact": "079-27661001", "lat": 23.0982, "lng": 72.5350},
            {"id": "ward-02", "name": "Ward 2 - Chandlodiya", "office": "Chandlodiya Office", "contact": "079-27661002", "lat": 23.0780, "lng": 72.5440},
            {"id": "ward-07", "name": "Ward 7 - Ghatlodiya", "office": "Ghatlodiya Civic Center", "contact": "079-27431007", "lat": 23.0650, "lng": 72.5380},
        ],
    },
    {
        "id": "west",
        "name": "West Zone",
        "wards": [
            {"id": "ward-14", "name": "Ward 14 - Navrangpura", "office": "Navrangpura Ward Office (Near Stadium)", "contact": "079-26561014", "lat": 23.0372, "lng": 72.5615},
            {"id": "ward-15", "name": "Ward 15 - Naranpura", "office": "Naranpura Civic Center", "contact": "079-27471015", "lat": 23.0520, "lng": 72.5540},
            {"id": "ward-16", "name": "Ward 16 - Paldi", "office": "Paldi Cross Roads Civic Center", "contact": "079-26571016", "lat": 23.0140, "lng": 72.5650},
            {"id": "ward-17", "name": "Ward 17 - Vasna", "office": "Vasna Ward Office", "contact": "079-26601017", "lat": 23.0010, "lng": 72.5530},
            {"id": "ward-18", "name": "Ward 18 - Usmanpura", "office": "Riverfront Zonal Office", "contact": "079-27551018", "lat": 23.0480, "lng": 72.5710},
            {"id": "ward-19", "name": "Ward 19 - Ranip", "office": "Ranip Civic Center", "contact": "079-27521019", "lat": 23.0780, "lng": 72.5750},
        ],
    },
    {
        "id": "south-west",
        "name": "South West Zone",
        "wards": [
            {"id": "ward-11", "name": "Ward 11 - Satellite & Jodhpur", "office": "Satellite Ward Office, Shyamal", "contact": "079-26921011", "lat": 23.0230, "lng": 72.5180},
            {"id": "ward-12", "name": "Ward 12 - Vejalpur & Maktampur", "office": "Vejalpur Civic Center", "contact": "079-26821012", "lat": 23.0030, "lng": 72.5260},
            {"id": "ward-13", "name": "Ward 13 - Sarkhej & Okaf", "office": "Sarkhej Ward Office (Near Roza)", "contact": "079-26821013", "lat": 22.9830, "lng": 72.5010},
        ],
    },
    {
        "id": "south",
        "name": "South Zone",
        "wards": [
            {"id": "ward-20", "name": "Ward 20 - Behrampura", "office": "Behrampura Ward Office", "contact": "079-25321020", "lat": 22.9980, "lng": 72.5850},
            {"id": "ward-21", "name": "Ward 21 - Danilimda", "office": "Danilimda Civic Center", "contact": "079-25351021", "lat": 22.9910, "lng": 72.5920},
            {"id": "ward-22", "name": "Ward 22 - Maninagar", "office": "Maninagar Zonal Office (Rambaug)", "contact": "079-25461022", "lat": 23.0063, "lng": 72.5996},
            {"id": "ward-23", "name": "Ward 23 - Kankaria & Khokhra", "office": "Kankaria Gate 3 Civic Desk", "contact": "079-25461023", "lat": 23.0080, "lng": 72.6080},
            {"id": "ward-24", "name": "Ward 24 - Isanpur", "office": "Isanpur Ward Office", "contact": "079-25711024", "lat": 22.9870, "lng": 72.6100},
            {"id": "ward-25", "name": "Ward 25 - Vatva", "office": "Vatva GIDC Civic Center", "contact": "079-25831025", "lat": 22.9730, "lng": 72.6280},
        ],
    },
    {
        "id": "central",
        "name": "Central Zone",
        "wards": [
            {"id": "ward-26", "name": "Ward 26 - Jamalpur", "office": "Mahanagar Seva Sadan, Danapith", "contact": "079-25391811", "lat": 23.0180, "lng": 72.5790},
            {"id": "ward-27", "name": "Ward 27 - Khadia", "office": "Khadia Ward Office", "contact": "079-22141027", "lat": 23.0230, "lng": 72.5900},
            {"id": "ward-28", "name": "Ward 28 - Shahpur & Dariapur", "office": "Delhi Gate Civic Center", "contact": "079-22161028", "lat": 23.0340, "lng": 72.5830},
        ],
    },
    {
        "id": "north",
        "name": "North Zone",
        "wards": [
            {"id": "ward-03", "name": "Ward 3 - Chandkheda", "office": "Chandkheda Civic Center (IOC Road)", "contact": "079-27511003", "lat": 23.1110, "lng": 72.5840},
            {"id": "ward-04", "name": "Ward 4 - Motera", "office": "Motera Stadium Civic Center", "contact": "079-27511004", "lat": 23.0920, "lng": 72.5980},
            {"id": "ward-05", "name": "Ward 5 - Saijpur Bogha", "office": "Saijpur Ward Office", "contact": "079-22811005", "lat": 23.0670, "lng": 72.6250},
            {"id": "ward-06", "name": "Ward 6 - Naroda", "office": "Naroda Zonal Office", "contact": "079-22821006", "lat": 23.0780, "lng": 72.6510},
        ],
    },
    {
        "id": "east",
        "name": "East Zone",
        "wards": [
            {"id": "ward-29", "name": "Ward 29 - Bapunagar", "office": "Bapunagar Civic Center", "contact": "079-22741029", "lat": 23.0390, "lng": 72.6310},
            {"id": "ward-30", "name": "Ward 30 - Amraiwadi", "office": "Amraiwadi Ward Office", "contact": "079-22771030", "lat": 23.0150, "lng": 72.6340},
            {"id": "ward-31", "name": "Ward 31 - Gomtipur", "office": "Gomtipur Ward Office", "contact": "079-22161031", "lat": 23.0210, "lng": 72.6180},
            {"id": "ward-32", "name": "Ward 32 - Odhav", "office": "Odhav Civic Center", "contact": "079-22871032", "lat": 23.0290, "lng": 72.6580},
        ],
    },
]

# Flat list of all wards with zone info
ALL_WARDS: list[dict[str, Any]] = []
for _z in AMC_ZONES:
    for _w in _z["wards"]:
        ALL_WARDS.append({**_w, "zoneName": _z["name"], "zoneId": _z["id"]})

# ---------------------------------------------------------------------------
# Departments
# ---------------------------------------------------------------------------
AMC_DEPARTMENTS = [
    {"id": "dept-roads", "name": "Roads & Buildings Project Dept", "head": "Shri Rajesh Patel (SE, West Zone)", "code": "R&B-AMC"},
    {"id": "dept-swm", "name": "Solid Waste Management Dept", "head": "Dr. Mihir Trivedi (Chief Medical Officer)", "code": "SWM-AMC"},
    {"id": "dept-light", "name": "Street Lighting & Electrical Dept", "head": "Er. Bhavesh Shah (Executive Engineer)", "code": "SLED-AMC"},
    {"id": "dept-water", "name": "Water Supply & Drainage Dept", "head": "Er. Kalpesh Modi (City Engineer)", "code": "WSDD-AMC"},
    {"id": "dept-encroach", "name": "Estate & Encroachment Removal", "head": "Shri Aniket Joshi (Deputy Estate Officer)", "code": "EERD-AMC"},
    {"id": "dept-garden", "name": "Parks & Garden Department", "head": "Smt. Neeta Dave (Director of Parks)", "code": "PGD-AMC"},
]

# ---------------------------------------------------------------------------
# Area → Ward lookup (lowercase keys for fuzzy matching)
# ---------------------------------------------------------------------------
AREA_TO_WARD_MAP: dict[str, str] = {
    # Bodakdev / Sindhu Bhavan
    "bodakdev": "Ward 9 - Bodakdev",
    "sindhu bhavan": "Ward 9 - Bodakdev",
    "sbr": "Ward 9 - Bodakdev",
    "taj skyline": "Ward 9 - Bodakdev",
    "pakwan": "Ward 9 - Bodakdev",
    "sg highway": "Ward 9 - Bodakdev",
    "s.g. highway": "Ward 9 - Bodakdev",
    
    # Vastrapur
    "vastrapur": "Ward 8 - Vastrapur",
    "vastrapur lake": "Ward 8 - Vastrapur",
    "iim": "Ward 8 - Vastrapur",
    "alpha one": "Ward 8 - Vastrapur",
    "himmatlal park": "Ward 8 - Vastrapur",
    
    # Thaltej
    "thaltej": "Ward 10 - Thaltej",
    "hebatpur": "Ward 10 - Thaltej",
    "science city": "Ward 10 - Thaltej",
    "shilaj": "Ward 10 - Thaltej",
    
    # Satellite & Jodhpur
    "satellite": "Ward 11 - Satellite & Jodhpur",
    "jodhpur": "Ward 11 - Satellite & Jodhpur",
    "shyamal": "Ward 11 - Satellite & Jodhpur",
    "shyamal cross road": "Ward 11 - Satellite & Jodhpur",
    "shivranjani": "Ward 11 - Satellite & Jodhpur",
    "prahladnagar": "Ward 11 - Satellite & Jodhpur",
    "iscon": "Ward 11 - Satellite & Jodhpur",
    "iskcon": "Ward 11 - Satellite & Jodhpur",
    
    # Navrangpura
    "navrangpura": "Ward 14 - Navrangpura",
    "cg road": "Ward 14 - Navrangpura",
    "c.g. road": "Ward 14 - Navrangpura",
    "law garden": "Ward 14 - Navrangpura",
    "ellisbridge": "Ward 14 - Navrangpura",
    "mithakhali": "Ward 14 - Navrangpura",
    "stadium": "Ward 14 - Navrangpura",
    "gujarat university": "Ward 14 - Navrangpura",
    
    # Naranpura
    "naranpura": "Ward 15 - Naranpura",
    "anandnagar": "Ward 15 - Naranpura",
    "memnagar": "Ward 15 - Naranpura",
    "gurukul": "Ward 15 - Naranpura",
    
    # Gota & Chandlodiya
    "gota": "Ward 1 - Gota",
    "vandemataram": "Ward 1 - Gota",
    "chandlodiya": "Ward 2 - Chandlodiya",
    "ghatlodiya": "Ward 7 - Ghatlodiya",
    "ghatlodia": "Ward 7 - Ghatlodiya",
    "chankyapuri": "Ward 7 - Ghatlodiya",
    
    # Paldi & Vasna
    "paldi": "Ward 16 - Paldi",
    "anand nagar": "Ward 16 - Paldi",
    "vasna": "Ward 17 - Vasna",
    "usmanpura": "Ward 18 - Usmanpura",
    "ranip": "Ward 19 - Ranip",
    
    # Maninagar & South Zone
    "maninagar": "Ward 22 - Maninagar",
    "kankaria": "Ward 23 - Kankaria & Khokhra",
    "kankaria lake": "Ward 23 - Kankaria & Khokhra",
    "khokhra": "Ward 23 - Kankaria & Khokhra",
    "rambaug": "Ward 22 - Maninagar",
    "behrampura": "Ward 20 - Behrampura",
    "danilimda": "Ward 21 - Danilimda",
    "isanpur": "Ward 24 - Isanpur",
    "vatva": "Ward 25 - Vatva",
    
    # Central Zone
    "jamalpur": "Ward 26 - Jamalpur",
    "khadia": "Ward 27 - Khadia",
    "shahpur": "Ward 28 - Shahpur & Dariapur",
    "dariapur": "Ward 28 - Shahpur & Dariapur",
    "kalupur": "Ward 28 - Shahpur & Dariapur",
    "danapith": "Ward 26 - Jamalpur",
    "riverfront": "Ward 28 - Shahpur & Dariapur",
    "sabarmati riverfront": "Ward 28 - Shahpur & Dariapur",
    
    # North Zone
    "chandkheda": "Ward 03 - Chandkheda",
    "motera": "Ward 04 - Motera",
    "motera stadium": "Ward 04 - Motera",
    "narendra modi stadium": "Ward 04 - Motera",
    "sabarmati": "Ward 04 - Motera",
    "saijpur": "Ward 05 - Saijpur Bogha",
    "naroda": "Ward 06 - Naroda",
    
    # East Zone
    "bapunagar": "Ward 29 - Bapunagar",
    "amraiwadi": "Ward 30 - Amraiwadi",
    "gomtipur": "Ward 31 - Gomtipur",
    "odhav": "Ward 32 - Odhav",
    "nikol": "Ward 32 - Odhav",
    "vastral": "Ward 30 - Amraiwadi",
    
    # South West
    "vejalpur": "Ward 12 - Vejalpur & Maktampur",
    "sarkhej": "Ward 13 - Sarkhej & Okaf",
    "sarkhej roza": "Ward 13 - Sarkhej & Okaf",
    "bopal": "Ward 10 - Thaltej",
    "south bopal": "Ward 10 - Thaltej",
}

# ---------------------------------------------------------------------------
# Category → Department mapping
# ---------------------------------------------------------------------------
CATEGORY_TO_DEPARTMENT: dict[str, str] = {
    "pothole": "Roads & Buildings Project Dept",
    "road": "Roads & Buildings Project Dept",
    "road cavity": "Roads & Buildings Project Dept",
    "asphalt": "Roads & Buildings Project Dept",
    "cavity": "Roads & Buildings Project Dept",
    "crater": "Roads & Buildings Project Dept",
    "trench": "Roads & Buildings Project Dept",
    "excavation": "Roads & Buildings Project Dept",
    "construction debris": "Roads & Buildings Project Dept",
    "material on road": "Roads & Buildings Project Dept",
    "gravel": "Roads & Buildings Project Dept",
    "footpath": "Roads & Buildings Project Dept",
    "pedestrian": "Roads & Buildings Project Dept",
    "paver": "Roads & Buildings Project Dept",
    "sidewalk": "Roads & Buildings Project Dept",
    
    "garbage": "Solid Waste Management Dept",
    "solid waste": "Solid Waste Management Dept",
    "overflowing bin": "Solid Waste Management Dept",
    "roadside garbage": "Solid Waste Management Dept",
    "waste": "Solid Waste Management Dept",
    "trash": "Solid Waste Management Dept",
    "litter": "Solid Waste Management Dept",
    "debris": "Solid Waste Management Dept",
    "dump": "Solid Waste Management Dept",
    "dumping": "Solid Waste Management Dept",
    
    "streetlight": "Street Lighting & Electrical Dept",
    "street light": "Street Lighting & Electrical Dept",
    "electrical": "Street Lighting & Electrical Dept",
    "lighting": "Street Lighting & Electrical Dept",
    "wire": "Street Lighting & Electrical Dept",
    "pole": "Street Lighting & Electrical Dept",
    "lamp": "Street Lighting & Electrical Dept",
    "blackout": "Street Lighting & Electrical Dept",
    
    "water": "Water Supply & Drainage Dept",
    "drainage": "Water Supply & Drainage Dept",
    "pipeline": "Water Supply & Drainage Dept",
    "sewage": "Water Supply & Drainage Dept",
    "waterlogging": "Water Supply & Drainage Dept",
    "leak": "Water Supply & Drainage Dept",
    "burst": "Water Supply & Drainage Dept",
    "overflow": "Water Supply & Drainage Dept",
    "gutter": "Water Supply & Drainage Dept",
    
    "encroachment": "Estate & Encroachment Removal",
    "road space": "Estate & Encroachment Removal",
    "space reduction": "Estate & Encroachment Removal",
    "illegal construction": "Estate & Encroachment Removal",
    "hawker": "Estate & Encroachment Removal",
    "stall": "Estate & Encroachment Removal",
    "unauthorized": "Estate & Encroachment Removal",

    
    "park": "Parks & Garden Department",
    "garden": "Parks & Garden Department",
    "tree": "Parks & Garden Department",
    "fallen branch": "Parks & Garden Department",
}


def _ward_to_zone(ward_name: str) -> str:
    """Return the zone name for a given ward name."""
    for w in ALL_WARDS:
        if w["name"] == ward_name or ward_name.startswith(w["name"].split(" - ")[0]):
            return w["zoneName"]
    return "North West Zone"


def detect_ward(location_text: str) -> dict[str, str]:
    """
    Fuzzy-match *location_text* against ``AREA_TO_WARD_MAP``.
    Returns {"ward": "Ward X - Name", "zone": "Zone Name"}.
    """
    if not location_text:
        return {"ward": "Ward 9 - Bodakdev", "zone": "North West Zone"}

    text = location_text.lower().strip()

    # Exact match first
    if text in AREA_TO_WARD_MAP:
        ward = AREA_TO_WARD_MAP[text]
        return {"ward": ward, "zone": _ward_to_zone(ward)}

    # Substring match — longest matching area key wins
    best_match = ""
    best_ward = ""
    for area, ward in AREA_TO_WARD_MAP.items():
        if area in text and len(area) > len(best_match):
            best_match = area
            best_ward = ward

    if best_ward:
        return {"ward": best_ward, "zone": _ward_to_zone(best_ward)}

    return {"ward": "Ward 9 - Bodakdev", "zone": "North West Zone"}


def detect_ward_by_coords(lat: float, lng: float) -> dict[str, Any]:
    """
    Find closest AMC ward based on latitude and longitude using Euclidean distance.
    """
    best_ward = ALL_WARDS[0]
    min_dist = float("inf")

    for w in ALL_WARDS:
        w_lat = w.get("lat", 23.03)
        w_lng = w.get("lng", 72.55)
        d = math.hypot(lat - w_lat, lng - w_lng)
        if d < min_dist:
            min_dist = d
            best_ward = w

    return {
        "ward": best_ward["name"],
        "zone": best_ward["zoneName"],
        "distanceKm": round(min_dist * 111, 2),
        "office": best_ward.get("office", ""),
        "contact": best_ward.get("contact", ""),
    }


def extract_gps_from_image(image_bytes: bytes) -> tuple[float | None, float | None]:
    """
    Extract GPS latitude & longitude from photo EXIF metadata if present.
    Returns (lat, lng) as floats in decimal degrees, or (None, None).
    """
    try:
        img = Image.open(io.BytesIO(image_bytes))
        exif = img._getexif() if hasattr(img, "_getexif") else img.getexif()
        if not exif:
            return None, None

        gps_info = None
        for tag_id, value in exif.items():
            tag_name = ExifTags.TAGS.get(tag_id, tag_id)
            if tag_name == "GPSInfo" or tag_id == 34853:
                gps_info = value
                break

        if not gps_info:
            return None, None

        def dms_to_decimal(dms, ref):
            deg = float(dms[0])
            min_ = float(dms[1]) / 60.0
            sec = float(dms[2]) / 3600.0
            total = deg + min_ + sec
            if ref in ["S", "W"]:
                total = -total
            return total

        # EXIF GPS tags: 2=Latitude, 1=LatitudeRef, 4=Longitude, 3=LongitudeRef
        lat_data = gps_info.get(2)
        lat_ref = gps_info.get(1, "N")
        lon_data = gps_info.get(4)
        lon_ref = gps_info.get(3, "E")

        if lat_data and lon_data:
            lat = round(dms_to_decimal(lat_data, lat_ref), 5)
            lon = round(dms_to_decimal(lon_data, lon_ref), 5)
            return lat, lon
    except Exception:
        pass

    return None, None


def detect_department(category: str, description: str = "") -> str:
    """
    Map an issue category and description to the responsible AMC department.
    """
    combined = f"{category} {description}".lower()

    best_match = ""
    best_dept = ""
    for keyword, dept in CATEGORY_TO_DEPARTMENT.items():
        if keyword in combined and len(keyword) > len(best_match):
            best_match = keyword
            best_dept = dept

    return best_dept or "Roads & Buildings Project Dept"
