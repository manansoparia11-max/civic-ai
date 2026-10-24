import React, { useState, useEffect } from "react";
import { Search, MapPin, Building2, User, Clock, CheckCircle2, AlertCircle, Calendar, Sparkles, ChevronRight, PhoneCall, ShieldCheck, ArrowRight, Image as ImageIcon } from "lucide-react";
import { useComplaints } from "../context/ComplaintContext";
import { StatusBadge, SeverityBadge } from "../components/StatusBadge";
import { CivicChatbot } from "../components/CivicChatbot";

export const TrackPage = ({ setActiveTab }) => {
  const { complaints, activeComplaintId, setActiveComplaintId, getComplaintById } = useComplaints();
  const [searchInput, setSearchInput] = useState(activeComplaintId || "");
  const [activeTabMedia, setActiveTabMedia] = useState("photo"); // "photo" | "before-after"
  const [viewMode, setViewMode] = useState("track"); // "track" | "history"
  const [historyFilter, setHistoryFilter] = useState("All");

  // Current selected complaint
  const currentComplaint = getComplaintById(activeComplaintId) || complaints[0];

  useEffect(() => {
    if (activeComplaintId) {
      setSearchInput(activeComplaintId);
    }
  }, [activeComplaintId]);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (!searchInput.trim()) return;
    const found = getComplaintById(searchInput.trim());
    if (found) {
      setActiveComplaintId(found.id);
      setViewMode("track");
    }
  };

  const selectTicket = (id) => {
    setSearchInput(id);
    setActiveComplaintId(id);
    setViewMode("track");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header & Search Bar */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Ahmedabad Municipal Corporation • Central Tracking System
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Track Your Civic Complaint
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Inspect real-time GPS work order progress, assigned junior engineer updates, and verified remediation photos.
        </p>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="pt-2">
          <div className="relative flex items-center shadow-lg rounded-2xl bg-white border border-slate-200 p-2">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Ticket ID (e.g. AMC-2026-X89B4)..."
              className="w-full text-xs sm:text-sm px-3 py-2 bg-transparent focus:outline-none text-slate-800 font-medium"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              Track
            </button>
          </div>
        </form>

        {/* Quick Sample IDs */}
        <div className="flex items-center justify-center flex-wrap gap-2 pt-1 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold">Quick Sample Tickets:</span>
          {complaints.slice(0, 4).map((c) => (
            <button
              key={c.id}
              onClick={() => selectTicket(c.id)}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold border transition-all ${
                currentComplaint?.id === c.id && viewMode === "track"
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:border-blue-400"
              }`}
            >
              {c.id} ({c.status})
            </button>
          ))}
        </div>

        {/* View Mode Toggle: Track Active Ticket vs Complaint History */}
        <div className="pt-2 flex items-center justify-center gap-2">
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode("track")}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === "track"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Track Active Ticket
            </button>
            <button
              type="button"
              onClick={() => setViewMode("history")}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === "history"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Complaint History</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-800 font-bold">
                {complaints.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {viewMode === "history" ? (
        <div className="space-y-6 animate-fadeIn">
          {/* History Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your Submitted Complaints History</h2>
              <p className="text-xs text-slate-500">
                All registered demo complaints stored in the local AMC database
              </p>
            </div>

            <div className="flex items-center gap-2">
              {["All", "Open", "In Progress", "Resolved"].map((status) => (
                <button
                  key={status}
                  onClick={() => setHistoryFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    historyFilter === status
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Complaint Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints
              .filter((c) => historyFilter === "All" || c.status === historyFilter)
              .map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-glass hover:shadow-glass-hover transition-all duration-200 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                      <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-xs text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-lg">
                        {c.id}
                      </div>
                      <div className="absolute top-3 right-3">
                        <StatusBadge status={c.status} size="sm" />
                      </div>
                      {c.roadSpaceReductionPct && (
                        <div className="absolute bottom-2 left-2 right-2 bg-amber-950/85 backdrop-blur-xs text-amber-200 text-[10px] font-semibold px-2.5 py-1 rounded-lg truncate">
                          ⚠️ {c.roadSpaceReductionPct}% Road Space Lost • {c.roadDamageType || "Defect"}
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 text-slate-600 font-semibold truncate max-w-[180px]">
                          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          {c.ward}
                        </span>
                        <SeverityBadge severity={c.severity} size="sm" />
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                        {c.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2">
                        {c.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-100 mt-2">
                    <div className="flex items-center justify-between pt-3">
                      <div className="text-[11px] text-slate-400 font-mono">
                        {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                      </div>
                      <button
                        type="button"
                        onClick={() => selectTicket(c.id)}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors flex items-center gap-1.5"
                      >
                        <span>Track & AI Chat</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : currentComplaint ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Complaint Details & Timeline (8 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Complaint Summary Banner */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-glass p-6 sm:p-8 space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 border border-blue-200">
                      {currentComplaint.id}
                    </span>
                    <StatusBadge status={currentComplaint.status} size="sm" />
                    <SeverityBadge severity={currentComplaint.severity} size="sm" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                    {currentComplaint.title}
                  </h2>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Reported On</span>
                  <span className="text-xs font-semibold text-slate-700">
                    {new Date(currentComplaint.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {currentComplaint.description}
              </p>

              {/* Road Space Reduction Callout if present */}
              {(currentComplaint.roadSpaceReductionPct || currentComplaint.roadDamageType) && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
                    <span className="font-semibold text-amber-950">
                      Road Space Reduction: <strong>{currentComplaint.roadSpaceReductionPct || 35}% Blocked</strong>
                    </span>
                    <span className="text-slate-400 hidden sm:inline">•</span>
                    <span className="text-slate-600 truncate max-w-sm">
                      {currentComplaint.roadDamageType || "Pavement Structural Damage"}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold shrink-0">
                    TRAFFIC OBSTRUCTION
                  </span>
                </div>
              )}

              {/* Key Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Ward</span>
                  <span className="font-semibold text-slate-800 block truncate">{currentComplaint.ward}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Department</span>
                  <span className="font-semibold text-blue-700 block truncate">{currentComplaint.department.split(" ")[0]}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Assigned AE</span>
                  <span className="font-semibold text-slate-800 block truncate">{currentComplaint.assignedEngineer.split(" ")[1]}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Target SLA</span>
                  <span className="font-semibold text-emerald-700 block truncate">
                    {new Date(currentComplaint.slaDeadline).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                  </span>
                </div>
              </div>

              {/* Photo Display with Before / After Toggle */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Site Evidence & Verification
                  </label>
                  {currentComplaint.status === "Resolved" && (
                    <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold">
                      <button
                        onClick={() => setActiveTabMedia("photo")}
                        className={`px-2.5 py-1 rounded-md transition-all ${activeTabMedia === "photo" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600"}`}
                      >
                        Citizen Photo
                      </button>
                      <button
                        onClick={() => setActiveTabMedia("before-after")}
                        className={`px-2.5 py-1 rounded-md transition-all ${activeTabMedia === "before-after" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600"}`}
                      >
                        Before / After Comparison
                      </button>
                    </div>
                  )}
                </div>

                {activeTabMedia === "before-after" && currentComplaint.status === "Resolved" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-rose-600 uppercase">Before Repair</span>
                      <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                        <img src={currentComplaint.imageUrl} alt="Before" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase">After Remediation (Verified)</span>
                      <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-emerald-300">
                        <img
                          src={currentComplaint.resolutionImageUrl || currentComplaint.imageUrl}
                          alt="After"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={currentComplaint.imageUrl}
                      alt={currentComplaint.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-slate-900/85 backdrop-blur-xs text-white text-[11px] p-2.5 rounded-xl flex items-center justify-between">
                      <span className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span className="truncate">{currentComplaint.location}</span>
                      </span>
                      <span className="font-mono text-emerald-400 font-bold shrink-0 ml-2">
                        AI CONF: {currentComplaint.confidence}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* INTERACTIVE PROGRESS TIMELINE */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-glass p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Remediation Progress Timeline
                  </h3>
                  <p className="text-xs text-slate-500">
                    Track field inspection, contractor work order, and final quality audit
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  AMC SLA Live
                </span>
              </div>

              {/* Vertical Stepper */}
              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {currentComplaint.timeline?.map((step, idx) => {
                  const isCompleted = step.status === "completed";
                  const isCurrent = step.status === "current";

                  return (
                    <div key={idx} className="relative group">
                      {/* Status Node Icon */}
                      <div
                        className={`absolute -left-6 sm:-left-8 top-0.5 w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                          isCompleted
                            ? "bg-emerald-500 text-white ring-4 ring-emerald-100"
                            : isCurrent
                            ? "bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse"
                            : "bg-slate-100 text-slate-400 border border-slate-300"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                        ) : isCurrent ? (
                          <Clock className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-slate-300" />
                        )}
                      </div>

                      {/* Content */}
                      <div className={`p-4 rounded-2xl border transition-all ${
                        isCurrent
                          ? "bg-blue-50/70 border-blue-200 shadow-xs"
                          : isCompleted
                          ? "bg-slate-50/60 border-slate-200"
                          : "bg-white border-dashed border-slate-200 opacity-60"
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className={`text-xs sm:text-sm font-bold ${isCurrent ? "text-blue-900" : isCompleted ? "text-slate-800" : "text-slate-500"}`}>
                            {step.stage}
                          </h4>
                          <span className="text-[11px] font-mono text-slate-400">
                            {step.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {step.note}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {currentComplaint.resolutionNotes && (
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900">
                  <strong>Official Closure Note:</strong> {currentComplaint.resolutionNotes}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: AI Chatbot & AMC Contact Desk (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Embedded CivicBot AI */}
            <CivicChatbot complaint={currentComplaint} />

            {/* Ward Office Support Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-glass p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                AMC Ward Help Desk
              </h4>
              <p className="text-xs text-slate-600">
                Need to speak with the field supervisor directly? Contact the designated zonal desk:
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="font-semibold text-slate-800">{currentComplaint.ward}</div>
                <div className="text-slate-500">Nodal AE: {currentComplaint.assignedEngineer}</div>
                <div className="text-blue-700 font-bold flex items-center gap-1.5 pt-1">
                  <PhoneCall className="w-3.5 h-3.5" />
                  Direct Desk: 079-26871020
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No Complaint Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Please check the Tracking ID entered or click on one of the quick sample tickets above.
          </p>
        </div>
      )}

    </div>
  );
};
