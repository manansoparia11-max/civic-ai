# CivicSnap AI — AI Agent & Backend for Municipal Complaint Management

**CivicSnap AI** is an intelligent civic complaint and grievance remediation platform tailored for Ahmedabad, Gujarat. It features a **FastAPI Python backend powered by Google Gemini 2.0 Flash Vision API** paired with an interactive **React + Tailwind CSS** frontend, local JSON database persistence, and a real-time AI agent activity log.

---

## 🏗️ Architecture & Tech Stack

- **Backend:** Python 3.13 + FastAPI + Uvicorn
- **AI Vision & Chatbot:** Google Gemini 2.0 Flash (`google-genai` SDK)
- **Database:** Local JSON File Storage (`backend/data/complaints.json`) with thread-safe persistence
- **EXIF Extraction:** Pillow (`PIL.Image`) for GPS metadata coordinate parsing
- **Frontend:** React 19 + Tailwind CSS + Framer Motion + Vite
- **Reverse Proxy:** Vite dev server proxying `/api` & `/uploads` to `http://127.0.0.1:8000`

---

## ⚡ Quick Start & Running Instructions

### 1. Start the FastAPI Backend

Open a terminal and navigate to the `backend/` folder:

```bash
cd "backend"
# Optional: Set your Gemini API key in backend/.env
# GEMINI_API_KEY=your_actual_key_here

python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

The backend API will run on `http://127.0.0.1:8000`.  
Interactive Swagger API documentation is available at `http://127.0.0.1:8000/docs`.

### 2. Start the React Frontend

Open a second terminal and navigate to the project root:

```bash
npm install
npm run dev
```

Open your browser to:
```
http://127.0.0.1:5173/  (or 5174 if 5173 is busy)
```

---

## 🎯 Key Implemented Features

### 1. 🔍 AI Image Analysis (Gemini 2.0 Flash)
- Uploading any photo sends the image directly to the FastAPI `/api/analyze` endpoint.
- Gemini Vision automatically identifies civic defects:
  - **Potholes & Deep Asphalt Cavities** (Structural Road Damage)
  - **Solid Waste & Overflowing Garbage Dumps** (Road Space Obstruction)
  - **Construction Debris & Materials Dumped on Lanes**
  - **Illegal Hawker Stalls & Encroachments Decreasing Road Width**
  - **Waterlogging Submerging Active Vehicle Lanes**
  - **Broken Streetlights & Electrical Hazards**
  - **Excavations & Unrepaired Road Utility Trenches**
- **Road Space Loss & Pavement Damage Assessment:**
  - `roadSpaceReductionPct`: Percentage of lane width obstructed (e.g. 40% blocked).
  - `roadSpaceImpact`: Operational summary of traffic bottlenecks and swerving hazards.
  - `roadDamageType`: Physical pavement damage classification (e.g. Sub-base failure, Bitumen degradation).
  - `obstructionType`: Primary blockage category.
- Computes hazard score (0–100), classification confidence, technical tags, and citizen charter SLA hours.
- Automatic fallback neural classification when offline or when API key is unconfigured.

### 2. 📍 EXIF GPS & Ward Auto-Detection
- Extracts GPS coordinates (`GPSLatitude`, `GPSLongitude`) directly from photo EXIF tags using `Pillow`.
- Correlates extracted coordinates with the Ahmedabad municipal cadastral database using spatial proximity to find the closest AMC Ward and Administrative Zone.
- If no EXIF GPS is present, fuzzy-matches the user's manual street name / area (e.g. "Sindhu Bhavan Road", "Vastrapur Lake", "Pakwan", "Navrangpura") to one of the 48 AMC Wards.

### 3. 🏢 Automatic Municipal Department Routing
- Dynamically routes complaints to the responsible municipal department:
  - *Roads & Buildings Project Dept*
  - *Solid Waste Management Dept*
  - *Street Lighting & Electrical Dept*
  - *Water Supply & Drainage Dept*
  - *Estate & Encroachment Removal*
  - *Parks & Garden Department*

### 4. 📝 Complaint Registration & Local JSON Database
- Generates unique tracking IDs in AMC format: `AMC-2026-XXXXX`.
- Labels all user-submitted tickets with `[DEMO SUBMISSION]`.
- Persists all tickets, photos, timestamps, timeline stages, and notes to `backend/data/complaints.json`.
- Changes persist across application and computer restarts.

### 5. 🤖 AI Citizen Chatbot (CivicBot AI)
- Fully connected to the backend `/api/chat` endpoint.
- Users can ask:
  - *"What's my complaint status?"*
  - *"What is the status of AMC-2026-X89B4?"*
  - *"Who is the assigned engineer?"*
  - *"When will this be resolved?"*
  - *"What is the AMC toll-free helpline?"*
- Looks up the real-time record from the local database and synthesizes accurate responses.

### 6. 📊 Admin Dashboard & Real-Time Status Updates
- Displays live statistics (Total, Open, In Progress, Resolved, Critical, Resolution Rate).
- Administrators can click **"Manage Status"** to update any complaint between:
  - **Open**
  - **In Progress**
  - **Resolved**
- Saves resolution notes and completion photos directly to `complaints.json`.
- Automatic timeline stage synchronization.

### 7. ⚡ Live AI Agent Activity Stream
- Tracks and displays real-time AI tool execution logs in both the Report scanning view and the Admin Command Portal.
- Tools logged:
  - `image_intake`
  - `exif_gps_extraction`
  - `gemini_vision_inference`
  - `road_space_and_damage_assessment`
  - `amc_ward_lookup`
  - `municipal_department_selection`
  - `complaint_registration`
  - `amc_db_query`
  - `status_retrieval`
  - `admin_status_update`

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Healthcheck and server timestamp |
| `POST` | `/api/analyze` | Multimodal image intake, EXIF GPS extraction & Gemini analysis |
| `POST` | `/api/complaints` | Create and save a new complaint into `complaints.json` |
| `GET` | `/api/complaints` | Fetch complaints with optional filters (`status`, `ward`, `search`) |
| `GET` | `/api/complaints/{id}` | Retrieve single complaint by tracking ID |
| `PATCH` | `/api/complaints/{id}` | Update status (`Open`, `In Progress`, `Resolved`) and resolution notes |
| `DELETE` | `/api/complaints/{id}` | Delete a complaint |
| `POST` | `/api/complaints/reset` | Reset database to default 5 seed complaints |
| `GET` | `/api/metrics` | Summary metrics for the Admin Dashboard |
| `POST` | `/api/chat` | Chat with CivicBot AI with live DB context |
| `GET` | `/api/agent/activity` | Live stream of AI agent tool execution logs |
| `POST` | `/api/upload-image` | Upload user photograph and return static URL |

---

## 🔒 Security & Environment Variables

Create a `backend/.env` file:
```env
GEMINI_API_KEY=AIzaSy...your_gemini_api_key...
```
*(Note: If no key is set, the system automatically uses smart fallback neural heuristics so you can test all features without interruption).*
