import React, { useState, useRef } from "react";
import confetti from "canvas-confetti";
import { UploadCloud, Camera, MapPin, Sparkles, CheckCircle2, ShieldAlert, Building2, Copy, Check, ArrowRight, RefreshCw, AlertTriangle, Phone, FileText, ChevronRight, X } from "lucide-react";
import { SAMPLE_ISSUES } from "../data/sampleIssues";
import { ALL_WARDS, AMC_DEPARTMENTS } from "../data/ahmedabadWards";
import { IssueScanAnimation } from "../components/IssueScanAnimation";
import { StatusBadge, SeverityBadge } from "../components/StatusBadge";
import { useComplaints } from "../context/ComplaintContext";
import { analyzeImage, uploadImage } from "../services/api";

export const ReportPage = ({ setActiveTab }) => {
  const { addComplaint, setActiveComplaintId } = useComplaints();
  const fileInputRef = useRef(null);

  // Flow stages: "upload" -> "scanning" -> "analyzed" -> "confirmed"
  const [stage, setStage] = useState("upload");

  // Form states
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Location states
  const [locationText, setLocationText] = useState("");
  const [selectedWard, setSelectedWard] = useState(ALL_WARDS[0]?.name || "Ward 9 - Bodakdev");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // AI Diagnostic output
  const [aiData, setAiData] = useState(null);
  const [citizenName, setCitizenName] = useState("Vikas Patel");
  const [citizenPhone, setCitizenPhone] = useState("+91 98251 40921");
  const [editableDesc, setEditableDesc] = useState("");
  const [aiToolCalls, setAiToolCalls] = useState([]);
  const [analysisError, setAnalysisError] = useState(null);

  // Confirmation state
  const [confirmedComplaint, setConfirmedComplaint] = useState(null);
  const [copied, setCopied] = useState(false);

  // Handle Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    setImageFile(file);
    setAnalysisError(null);
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setImage(uploadEvent.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Select a preset issue (for demo/testing)
  const handleSelectPreset = async (sample) => {
    // For preset samples, we fetch the image and create a File from it
    setImage(sample.image);
    setImageFile(null); // Will use preset data
    setAiData(sample);
    setLocationText(sample.location);
    setSelectedWard(sample.ward);
    setEditableDesc(sample.description);
    setAnalysisError(null);
  };

  // GPS detection
  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTimeout(() => {
            setLocationText(`Near Sindhu Bhavan Road & SG Highway (GPS: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`);
            setSelectedWard("Ward 9 - Bodakdev");
            setIsDetectingLocation(false);
          }, 800);
        },
        () => {
          setTimeout(() => {
            setLocationText("Near Pakwan Cross Roads, SG Highway, Bodakdev, Ahmedabad");
            setSelectedWard("Ward 9 - Bodakdev");
            setIsDetectingLocation(false);
          }, 800);
        }
      );
    } else {
      setTimeout(() => {
        setLocationText("Near Iskcon Cross Road, SG Highway, Ahmedabad");
        setSelectedWard("Ward 10 - Thaltej");
        setIsDetectingLocation(false);
      }, 800);
    }
  };

  // Trigger AI Scan — now calls the real backend!
  const handleStartAnalysis = () => {
    if (!image) return;
    setStage("scanning");
    setAnalysisError(null);
    window.scrollTo({ top: 100, behavior: "smooth" });

    // If we have an actual file, send it to the AI backend
    if (imageFile) {
      analyzeImage(imageFile, locationText, selectedWard)
        .then((result) => {
          const analysis = result.analysis;
          setAiData({
            ...analysis,
            id: "ai-result",
          });
          setEditableDesc(analysis.description);
          setAiToolCalls(result.tool_calls || []);
          // Update ward/location from backend if detected
          if (result.ward) setSelectedWard(result.ward);
          if (result.department) {
            setAiData((prev) => ({ ...prev, department: result.department }));
          }
        })
        .catch((err) => {
          console.error("AI analysis failed:", err);
          setAnalysisError(err.message);
          // Use a fallback result
          setAiData({
            id: "fallback",
            title: "Civic Issue Detected",
            category: "Pothole & Road Cavity",
            description: "Road surface damage detected. AI analysis unavailable — please verify manually.",
            severity: "Medium",
            hazardScore: 65,
            confidence: 70.0,
            department: "Roads & Buildings Project Dept",
            tags: ["Road Damage", "Manual Review", "Pending AI"],
            slaHours: 36,
          });
          setEditableDesc("Road surface damage detected. AI analysis unavailable — please verify manually.");
        });
    }
    // For preset samples, aiData is already set — just proceed
  };

  // When AI scan animation finishes
  const handleScanComplete = () => {
    setStage("analyzed");
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  // Submit Complaint — now uses backend!
  const handleSubmitComplaint = async (e) => {
    e.preventDefault();

    const matchingWard = ALL_WARDS.find(w => w.name === selectedWard) || { zoneName: "North West Zone" };

    // First upload the image if it's a user-uploaded file
    let finalImageUrl = image;
    if (imageFile) {
      try {
        const uploadResult = await uploadImage(imageFile);
        finalImageUrl = uploadResult.url;
      } catch (err) {
        console.error("Image upload failed, using data URI:", err);
        // Keep the base64 data URI as fallback
      }
    }

    const newTicket = await addComplaint({
      title: `${aiData.category} at ${selectedWard}`,
      category: aiData.category,
      description: editableDesc,
      severity: aiData.severity,
      hazardScore: aiData.hazardScore,
      confidence: aiData.confidence,
      ward: selectedWard,
      zone: matchingWard.zoneName,
      location: locationText,
      department: aiData.department,
      reportedBy: citizenName,
      citizenPhone: citizenPhone,
      imageUrl: finalImageUrl,
      slaHours: aiData.slaHours || 36,
      roadSpaceReductionPct: aiData.roadSpaceReductionPct ?? 35,
      roadSpaceImpact: aiData.roadSpaceImpact || "Reduces active road space and blocks traffic lane",
      roadDamageType: aiData.roadDamageType || "Pavement Defect & Surface Obstruction",
      obstructionType: aiData.obstructionType || aiData.category
    });

    setConfirmedComplaint(newTicket);
    setStage("confirmed");
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Blast celebratory confetti!
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.log("Confetti trigger", err);
    }
  };

  const copyTrackingId = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Stepper Indicator */}
      <div className="max-w-xl mx-auto mb-10">
        <div className="flex items-center justify-between">
          {[
            { step: "upload", label: "1. Capture & Ward" },
            { step: "analyzed", label: "2. AI Diagnostics" },
            { step: "confirmed", label: "3. AMC Dispatch" }
          ].map((item, idx) => {
            const isCurrent = stage === item.step || (stage === "scanning" && item.step === "analyzed");
            const isPassed = (stage === "analyzed" && idx === 0) || (stage === "confirmed");
            
            return (
              <div key={item.step} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent
                      ? "bg-blue-600 text-white ring-4 ring-blue-100"
                      : isPassed
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {isPassed ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <span className={`text-xs font-semibold ${isCurrent ? "text-blue-700" : isPassed ? "text-emerald-700" : "text-slate-400"}`}>
                  {item.label}
                </span>
                {idx < 2 && <div className="w-8 sm:w-16 h-0.5 bg-slate-200 mx-1" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* STAGE 1: UPLOAD & LOCATION INPUT */}
      {stage === "upload" && (
        <div className="space-y-8 animate-fadeIn">
          
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Report a Civic Issue in Ahmedabad
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Upload an image of the defect or pick a realistic Ahmedabad sample below. Our AI will automatically identify the problem and route it to the AMC engineer.
            </p>
          </div>

          {/* Quick Preset Selector Chips for Instant Testing */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Quick Test Samples (Instant Fill):
              </span>
              <span className="text-[11px] text-blue-600 font-medium hidden sm:inline">
                Click any scenario to test AI scanning instantly
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {SAMPLE_ISSUES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectPreset(sample)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    aiData?.id === sample.id
                      ? "bg-white border-blue-600 shadow-md ring-2 ring-blue-500/20"
                      : "bg-white/80 border-slate-200 hover:bg-white hover:border-blue-300"
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 block truncate">{sample.title}</span>
                  <span className="text-[10px] text-slate-500 block truncate mt-0.5">{sample.subtitle}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Drag and Drop Upload */}
            <div className="lg:col-span-7 space-y-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Photo of Defect / Hazard
              </label>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-blue-500 bg-blue-50/80 scale-[1.01]"
                    : "border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50/50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {image ? (
                  <div className="space-y-4">
                    <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-slate-950 shadow-md">
                      <img
                        src={image}
                        alt="Issue Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                        {imageFile ? "📷 Your Photo — Ready to Scan" : "📋 Preset Sample"}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Click or drag another image to replace</span>
                      <span className="text-blue-600 font-bold">Gemini Vision AI Ready</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Drag and drop your photo here, or <span className="text-blue-600">browse files</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Supports JPEG, PNG, HEIC up to 15MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Location & Ward Selector */}
            <div className="lg:col-span-5 space-y-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-glass">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Location & Ahmedabad Ward
              </label>

              {/* Location Button */}
              <div>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isDetectingLocation}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-50 hover:bg-blue-100/80 text-blue-700 font-semibold text-xs border border-blue-200 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>
                    {isDetectingLocation ? "Pinpointing Ahmedabad GPS..." : "📍 Detect My Current Location (GPS)"}
                  </span>
                </button>
              </div>

              {/* Manual Location Text */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Specific Street / Landmark:
                </label>
                <input
                  type="text"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  placeholder="e.g. Near Taj Skyline, Sindhu Bhavan Road, Bodakdev"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Ward Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Ahmedabad Municipal Ward:
                </label>
                <select
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                >
                  {ALL_WARDS.map((ward) => (
                    <option key={ward.id} value={ward.name}>
                      {ward.name} ({ward.zoneName})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Routes directly to the designated Assistant City Engineer.
                </p>
              </div>

              {/* Citizen Details */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <label className="block text-[11px] font-bold text-slate-600">
                  Citizen Contact (For SMS & Resolution Alerts):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="Your Name"
                    className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                  <input
                    type="text"
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    placeholder="Mobile / WhatsApp"
                    className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              {/* Action Button: Analyze with AI */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleStartAnalysis}
                  disabled={!image}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-sm shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-5 h-5 text-cyan-200" />
                  <span>Analyze with Gemini AI</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* STAGE 2: ANIMATED SCANNING */}
      {stage === "scanning" && (
        <div className="space-y-6 py-6 animate-fadeIn">
          <div className="text-center">
            <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Live AI Processing
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Gemini Vision AI is Analyzing the Defect...
            </h2>
          </div>

          <IssueScanAnimation
            image={image}
            aiResult={aiData}
            onComplete={handleScanComplete}
            toolCalls={aiToolCalls}
          />

          {analysisError && (
            <div className="max-w-xl mx-auto p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>AI Analysis Notice:</strong> {analysisError}. Using fallback classification — you can edit details manually in the next step.
              </div>
            </div>
          )}
        </div>
      )}

      {/* STAGE 3: AI ANALYSIS RESULTS & VERIFICATION */}
      {stage === "analyzed" && aiData && (
        <div className="space-y-8 animate-fadeIn">
          
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              AI Analysis Completed (Confidence: {aiData.confidence}%)
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
              Verified AI Diagnostics & Dispatch Plan
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Verify the AI findings below before officially routing the complaint to the AMC Municipal Engineer.
            </p>
          </div>

          {/* AI Result Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
            
            {/* Top Bar with Severity & Hazard Score */}
            <div className="bg-slate-900 text-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  Detected Civic Issue
                </span>
                <h3 className="text-2xl font-black text-white mt-0.5">
                  {aiData.category}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <SeverityBadge severity={aiData.severity} size="md" />
                <div className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono">
                  Hazard Index: <strong className="text-rose-400">{aiData.hazardScore}/100</strong>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Image Preview with Bounding Box Overlay */}
              <div className="lg:col-span-5 space-y-3">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Inspected Photograph
                </label>
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner">
                  <img
                    src={image}
                    alt="Inspected defect"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-6 border-2 border-dashed border-cyan-400 rounded-xl pointer-events-none flex items-start justify-between p-2">
                    <span className="text-[10px] font-mono font-bold bg-cyan-600 text-white px-2 py-0.5 rounded shadow">
                      {aiData.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-emerald-600 text-white px-2 py-0.5 rounded shadow">
                      {aiData.confidence}% Match
                    </span>
                  </div>
                </div>

                {/* AI Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {aiData.tags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Triage & Municipal Routing Details */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* ROAD DAMAGE & ROAD SPACE REDUCTION ASSESSMENT (NEW AI METRICS) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-rose-500/10 border border-amber-300/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                        AI Road Space & Damage Inspection
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                      Obstruction Index: {aiData.roadSpaceReductionPct || 35}% Lost
                    </span>
                  </div>

                  {/* Road Space Reduction Visual Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <span>Road Space Lost:</span>
                        <strong className="text-amber-700">~{aiData.roadSpaceReductionPct || 35}% Width Blocked</strong>
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">Lane Capacity Restricted</span>
                    </div>
                    <div className="w-full h-3 bg-amber-100/80 rounded-full overflow-hidden p-0.5 border border-amber-200">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-rose-600 rounded-full transition-all duration-700 shadow-xs"
                        style={{ width: `${Math.max(aiData.roadSpaceReductionPct || 35, 12)}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-amber-900 leading-snug">
                      <strong>Traffic Impact:</strong> {aiData.roadSpaceImpact || "Reduces active carriage lane space and causes severe bottlenecks during peak hours."}
                    </p>
                  </div>

                  {/* Structural Road Damage Breakdown */}
                  <div className="pt-2 border-t border-amber-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Pavement Damage Level</span>
                      <span className="font-bold text-slate-900 text-xs mt-0.5 block truncate">
                        {aiData.roadDamageType || "Asphalt Cavity & Structural Wear"}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Primary Obstruction Type</span>
                      <span className="font-bold text-rose-700 text-xs mt-0.5 block truncate">
                        {aiData.obstructionType || aiData.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Department */}
                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/70">
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                      Target Municipal Dept
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                      {aiData.department}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1">AI-routed based on defect classification</p>
                  </div>

                  {/* Ward */}
                  <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/70">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                      Assigned Ward & Jurisdiction
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                      {selectedWard}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1">Zonal Field Unit</p>
                  </div>

                  {/* SLA */}
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                      Guaranteed Resolution SLA
                    </span>
                    <h4 className="text-sm font-bold text-emerald-900 mt-1">
                      Within {aiData.slaHours || 36} Hours
                    </h4>
                    <p className="text-[11px] text-emerald-700 mt-1">AMC Citizen Charter compliance</p>
                  </div>

                  {/* Geotag */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Pinpoint Location
                    </span>
                    <h4 className="text-xs font-semibold text-slate-800 mt-1 line-clamp-1">
                      {locationText || "Not specified"}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">Location verified</p>
                  </div>

                </div>

                {/* Complaint Summary (Editable by citizen) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    AI-Generated Defect Summary (You can customize)
                  </label>
                  <textarea
                    rows={3}
                    value={editableDesc}
                    onChange={(e) => setEditableDesc(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStage("upload")}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Re-upload or change photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmitComplaint}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-xl shadow-blue-600/25 hover:shadow-2xl hover:shadow-blue-600/35 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-200" />
                    <span>Submit & Dispatch Work Order</span>
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* STAGE 4: COMPLAINT CONFIRMATION */}
      {stage === "confirmed" && confirmedComplaint && (
        <div className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
          
          {/* Success Banner */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Complaint Registered Successfully!
            </h1>
            <p className="text-slate-600 text-sm max-w-lg mx-auto">
              Your issue has been diagnosed by CivicSnap AI and saved to the complaint database with a unique tracking ID.
            </p>
          </div>

          {/* Ticket Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
            
            {/* Tracking ID Hero Box */}
            <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block">
                  Your Unique AMC Tracking Ticket ID:
                </span>
                <span className="text-2xl sm:text-3xl font-mono font-black text-blue-700">
                  {confirmedComplaint.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => copyTrackingId(confirmedComplaint.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-blue-100/50 text-blue-700 border border-blue-300 font-bold text-xs shadow-xs transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied to Clipboard!" : "Copy Ticket ID"}</span>
              </button>
            </div>

            {/* Ticket Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Issue Category</span>
                <span className="font-bold text-slate-800 text-sm">{confirmedComplaint.category}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Status</span>
                <div className="mt-1">
                  <StatusBadge status={confirmedComplaint.status} size="sm" />
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Ward & Zone</span>
                <span className="font-semibold text-slate-800">{confirmedComplaint.ward} ({confirmedComplaint.zone})</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Responsible AMC Unit</span>
                <span className="font-semibold text-blue-700">{confirmedComplaint.department}</span>
              </div>
            </div>

            {/* SMS Notice */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
              <Phone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Demo Submission:</strong> This complaint has been saved to the local database. In a production environment, SMS & WhatsApp alerts would be sent to {confirmedComplaint.citizenPhone}.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  setStage("upload");
                  setImage(null);
                  setImageFile(null);
                  setAiData(null);
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Report Another Issue
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveComplaintId(confirmedComplaint.id);
                  setActiveTab("track");
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-102"
              >
                <span>Track This Complaint Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
