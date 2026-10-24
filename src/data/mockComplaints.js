export const INITIAL_COMPLAINTS = [
  {
    id: "AMC-2026-X89B4",
    title: "Deep Pothole & Damaged Road Surface",
    category: "Pothole & Road Cavity",
    description: "Dangerous pothole directly in front of Taj Skyline traffic junction on Sindhu Bhavan Road. Two-wheelers frequently swerving into opposite lane.",
    severity: "High",
    hazardScore: 86,
    confidence: 97.4,
    status: "In Progress", // "Open" | "In Progress" | "Resolved"
    ward: "Ward 9 - Bodakdev",
    zone: "North West Zone",
    location: "Opposite Taj Skyline, Sindhu Bhavan Road, Bodakdev, Ahmedabad",
    coordinates: { lat: 23.0428, lng: 72.5065 },
    department: "Roads & Buildings Project Dept",
    assignedEngineer: "Er. Amit Soni (AE - Roads)",
    fieldContractor: "Apex Roadways Ltd. (AMC Contractor #402)",
    reportedBy: "Kavita Shah",
    citizenPhone: "+91 98250 XXXXX",
    createdAt: "2026-10-23T09:15:00.000Z",
    slaDeadline: "2026-10-25T09:15:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=900&q=80",
    resolutionImageUrl: null,
    resolutionNotes: "Milling machine deployed. Hot-mix bituminous asphalt surfacing scheduled for tonight 11:30 PM during low traffic.",
    timeline: [
      {
        stage: "Complaint Registered",
        status: "completed",
        timestamp: "23 Oct 2026, 09:15 AM",
        note: "AI Vision analysis verified defect geometry (1.2m diameter). Assigned to Roads & Buildings Dept."
      },
      {
        stage: "Ward Officer Verification",
        status: "completed",
        timestamp: "23 Oct 2026, 11:40 AM",
        note: "Er. Amit Soni conducted physical inspection. Marked as High Priority due to Sindhu Bhavan traffic volume."
      },
      {
        stage: "Work Order Issued",
        status: "completed",
        timestamp: "23 Oct 2026, 03:20 PM",
        note: "Work Order #AMC/RB/2026/894 issued to Apex Roadways. Asphalt material requisition approved."
      },
      {
        stage: "Repair in Progress",
        status: "current",
        timestamp: "24 Oct 2026, 10:00 AM",
        note: "Barricades installed. Base compaction underway. Final asphalt layer scheduled tonight."
      },
      {
        stage: "Quality Audit & Resolved",
        status: "upcoming",
        timestamp: "Estimated 25 Oct 2026",
        note: "Geotagged post-repair image verification & citizen feedback call."
      }
    ]
  },
  {
    id: "AMC-2026-K42P9",
    title: "Overflowing Garbage Dump & Bio-Hazard",
    category: "Solid Waste & Overflowing Bin",
    description: "Large commercial garbage bin overflowing onto walkway near Vastrapur Lake entrance. Stray cattle and odor nuisance.",
    severity: "Critical",
    hazardScore: 92,
    confidence: 99.1,
    status: "Resolved",
    ward: "Ward 8 - Vastrapur",
    zone: "North West Zone",
    location: "Gate 2, Vastrapur Lake Public Promenade, Vastrapur, Ahmedabad",
    coordinates: { lat: 23.0360, lng: 72.5298 },
    department: "Solid Waste Management Dept",
    assignedEngineer: "Dr. Mihir Trivedi (Sanitary Inspector)",
    fieldContractor: "AMC Sanitation Wing - North West",
    reportedBy: "Rahul Varma",
    citizenPhone: "+91 94260 XXXXX",
    createdAt: "2026-10-21T08:00:00.000Z",
    slaDeadline: "2026-10-22T08:00:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=900&q=80",
    resolutionImageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80",
    resolutionNotes: "Site cleaned with hydraulic compactor truck. Area disinfected with bleaching powder. Two extra 1100L secondary bins installed.",
    timeline: [
      {
        stage: "Complaint Registered",
        status: "completed",
        timestamp: "21 Oct 2026, 08:00 AM",
        note: "Automated AI classification flagged as Solid Waste bio-hazard."
      },
      {
        stage: "Ward Officer Verification",
        status: "completed",
        timestamp: "21 Oct 2026, 08:45 AM",
        note: "Sanitary Inspector dispatched compacting team immediately."
      },
      {
        stage: "Work Order Issued",
        status: "completed",
        timestamp: "21 Oct 2026, 09:15 AM",
        note: "Emergency vehicle GJ-01-CZ-4412 routed to site."
      },
      {
        stage: "Repair in Progress",
        status: "completed",
        timestamp: "21 Oct 2026, 11:30 AM",
        note: "Waste cleared, bins sanitized and repositioned."
      },
      {
        stage: "Quality Audit & Resolved",
        status: "completed",
        timestamp: "21 Oct 2026, 01:15 PM",
        note: "Verified by Zonal Health Officer. Citizen confirmed resolution over SMS."
      }
    ]
  },
  {
    id: "AMC-2026-M11R3",
    title: "Broken Streetlight Mast with Live Wires",
    category: "Streetlight & Electrical Hazard",
    description: "Streetlight fixture knocked down during thunderstorm. Live wires exposed at ground level near busy pedestrian footway.",
    severity: "Critical",
    hazardScore: 96,
    confidence: 98.6,
    status: "Open",
    ward: "Ward 14 - Navrangpura",
    zone: "West Zone",
    location: "Opposite Municipal Market, CG Road, Navrangpura, Ahmedabad",
    coordinates: { lat: 23.0335, lng: 72.5578 },
    department: "Street Lighting & Electrical Dept",
    assignedEngineer: "Er. Bhavesh Shah (Lighting Dept)",
    fieldContractor: "AMC Emergency Electrical Quick Response",
    reportedBy: "Mehul Parekh",
    citizenPhone: "+91 97120 XXXXX",
    createdAt: "2026-10-24T14:30:00.000Z",
    slaDeadline: "2026-10-25T02:30:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80",
    resolutionImageUrl: null,
    resolutionNotes: "Dispatched QRT team for power cutoff. New LED mast pole scheduled for erection.",
    timeline: [
      {
        stage: "Complaint Registered",
        status: "completed",
        timestamp: "24 Oct 2026, 02:30 PM",
        note: "AI detected exposed live terminal. High hazard alert sent to Torrent Power & AMC Electrical control room."
      },
      {
        stage: "Ward Officer Verification",
        status: "completed",
        timestamp: "24 Oct 2026, 03:00 PM",
        note: "Feeder breaker isolated remotely from Navrangpura substation."
      },
      {
        stage: "Work Order Issued",
        status: "current",
        timestamp: "24 Oct 2026, 03:45 PM",
        note: "Hydraulic crane van en route from Usmanpura electrical yard."
      },
      {
        stage: "Repair in Progress",
        status: "upcoming",
        timestamp: "Pending Arrival",
        note: "Replacement pole and LED luminaire will be mounted."
      },
      {
        stage: "Quality Audit & Resolved",
        status: "upcoming",
        timestamp: "Pending",
        note: "Illumination lux test and closure."
      }
    ]
  },
  {
    id: "AMC-2026-W55S1",
    title: "Drinking Water Pipeline Burst & Road Flooding",
    category: "Water Supply & Drainage Leak",
    description: "Main underground 300mm ductile iron potable water pipe burst, causing potable water to flood 200m stretch of road.",
    severity: "High",
    hazardScore: 82,
    confidence: 94.7,
    status: "In Progress",
    ward: "Ward 11 - Satellite & Jodhpur",
    zone: "South West Zone",
    location: "Near Prernatirth Derasar, Jodhpur Cross Road, Satellite, Ahmedabad",
    coordinates: { lat: 23.0182, lng: 72.5204 },
    department: "Water Supply & Drainage Dept",
    assignedEngineer: "Er. Kalpesh Modi (City Engineer)",
    fieldContractor: "Gujarat Water Infrastructure Tech",
    reportedBy: "Devang Patel",
    citizenPhone: "+91 99090 XXXXX",
    createdAt: "2026-10-23T18:00:00.000Z",
    slaDeadline: "2026-10-24T18:00:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=900&q=80",
    resolutionImageUrl: null,
    resolutionNotes: "Line isolated at Satellite distribution valve #4. Excavator deployed for clamp welding.",
    timeline: [
      {
        stage: "Complaint Registered",
        status: "completed",
        timestamp: "23 Oct 2026, 06:00 PM",
        note: "AI recognized high-volume water plume and water main signature."
      },
      {
        stage: "Ward Officer Verification",
        status: "completed",
        timestamp: "23 Oct 2026, 06:40 PM",
        note: "Hydraulic team verified pressure drop on SCADA network."
      },
      {
        stage: "Work Order Issued",
        status: "completed",
        timestamp: "23 Oct 2026, 07:15 PM",
        note: "Valve shut to conserve treated potable water. Excavation permit approved."
      },
      {
        stage: "Repair in Progress",
        status: "current",
        timestamp: "24 Oct 2026, 08:30 AM",
        note: "Excavation complete. New collar sleeve clamp being fitted."
      },
      {
        stage: "Quality Audit & Resolved",
        status: "upcoming",
        timestamp: "Expected 24 Oct 2026, 06:00 PM",
        note: "Pressure test & road backfill."
      }
    ]
  },
  {
    id: "AMC-2026-P88F2",
    title: "Cracked Tactile Footpath & Paver Blocks",
    category: "Footpath & Pedestrian Infrastructure",
    description: "Pedestrian walkway paver blocks broken and sunken for over 40 meters, causing hazard for elderly walkers near Kankaria.",
    severity: "Medium",
    hazardScore: 54,
    confidence: 93.2,
    status: "Resolved",
    ward: "Ward 22 - Maninagar",
    zone: "South Zone",
    location: "Walkway Outer Ring, Kankaria Lakefront, Maninagar, Ahmedabad",
    coordinates: { lat: 23.0063, lng: 72.5996 },
    department: "Roads & Buildings Project Dept",
    assignedEngineer: "Er. Nilesh Chauhan (JE)",
    fieldContractor: "Civil Pavers Gujarat",
    reportedBy: "Sunita Joshi",
    citizenPhone: "+91 98980 XXXXX",
    createdAt: "2026-10-18T10:20:00.000Z",
    slaDeadline: "2026-10-20T10:20:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=900&q=80",
    resolutionImageUrl: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=900&q=80",
    resolutionNotes: "Old damaged blocks excavated, concrete sand sub-base leveled, and 120 interlocking heavy-duty textured blocks installed.",
    timeline: [
      {
        stage: "Complaint Registered",
        status: "completed",
        timestamp: "18 Oct 2026, 10:20 AM",
        note: "AI logged pedestrian hazard score 54."
      },
      {
        stage: "Ward Officer Verification",
        status: "completed",
        timestamp: "18 Oct 2026, 02:00 PM",
        note: "Maninagar Ward Office verified inspection."
      },
      {
        stage: "Work Order Issued",
        status: "completed",
        timestamp: "19 Oct 2026, 11:00 AM",
        note: "Contractor mobilized materials to Kankaria site."
      },
      {
        stage: "Repair in Progress",
        status: "completed",
        timestamp: "20 Oct 2026, 09:00 AM",
        note: "Paving completed and compacted."
      },
      {
        stage: "Quality Audit & Resolved",
        status: "completed",
        timestamp: "20 Oct 2026, 04:30 PM",
        note: "Inspected by AMC Junior Engineer. Complaint closed successfully."
      }
    ]
  }
];
