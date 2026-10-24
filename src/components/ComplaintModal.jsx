import React, { useState } from "react";
import { X, CheckCircle2, Clock, AlertTriangle, Building2, MapPin, User, Calendar, ExternalLink, ShieldCheck, Sparkles, Image as ImageIcon } from "lucide-react";
import { StatusBadge, SeverityBadge } from "./StatusBadge";

export const ComplaintModal = ({ complaint, isOpen, onClose, onUpdateStatus }) => {
  if (!isOpen || !complaint) return null;

  const [selectedStatus, setSelectedStatus] = useState(complaint.status);
  const [notes, setNotes] = useState(complaint.resolutionNotes || "");
  const [resolutionImg, setResolutionImg] = useState(complaint.resolutionImageUrl || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdateStatus(complaint.id, selectedStatus, notes, resolutionImg);
      setIsSaving(false);
      onClose();
    }, 400);
  };

  const sampleResolutionPhotos = [
    { label: "Clean Road", url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80" },
    { label: "Cleared Waste Area", url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=900&q=80" }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 border border-blue-200">
              {complaint.id}
            </span>
            <StatusBadge status={complaint.status} size="sm" />
            <SeverityBadge severity={complaint.severity} size="sm" />
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Title & Description */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {complaint.title}
            </h2>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              {complaint.description}
            </p>
          </div>

          {/* Photo & AI Diagnostics side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Citizen Photo */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Citizen Evidence Photo
              </label>
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={complaint.imageUrl}
                  alt={complaint.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-xs text-white text-[11px] p-2 rounded-xl flex items-center justify-between font-mono">
                  <span>AI CONFIDENCE</span>
                  <span className="text-emerald-400 font-bold">{complaint.confidence || 96.5}%</span>
                </div>
              </div>
            </div>

            {/* Jurisdictional & Municipal Info */}
            <div className="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 text-xs">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                AMC Jurisdiction & Routing
              </h4>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Ward</span>
                  <span className="font-semibold text-slate-800">{complaint.ward}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Zone</span>
                  <span className="font-semibold text-slate-800">{complaint.zone}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Responsible Department</span>
                <span className="font-semibold text-blue-700">{complaint.department}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Location & Landmark</span>
                <span className="font-medium text-slate-700 flex items-start gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                  {complaint.location}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Reported By</span>
                  <span className="font-semibold text-slate-800">{complaint.reportedBy} ({complaint.citizenPhone})</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Hazard Score</span>
                  <span className="font-black text-rose-600 text-sm">{complaint.hazardScore || 85}/100</span>
                </div>
              </div>

              {complaint.roadSpaceReductionPct && (
                <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-amber-800 block text-[10px] uppercase font-bold">Road Space & Damage Impact</span>
                    <span className="font-bold text-amber-950 text-xs">
                      {complaint.roadSpaceReductionPct}% Width Blocked • {complaint.roadDamageType || "Pavement Defect"}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                    OBSTRUCTION
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Admin Workflow & Status Controls */}
          <div className="border-t border-slate-200 pt-5 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Update AMC Dispatch & Resolution Status
            </h4>

            {/* Status Selector Pills */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { status: "Open", label: "Open / Triage", desc: "Awaiting field visit", color: "blue" },
                { status: "In Progress", label: "In Progress", desc: "Crew deployed on site", color: "amber" },
                { status: "Resolved", label: "Resolved", desc: "Work completed & tested", color: "emerald" }
              ].map((item) => (
                <button
                  key={item.status}
                  type="button"
                  onClick={() => setSelectedStatus(item.status)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedStatus === item.status
                      ? "border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900">{item.label}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                </button>
              ))}
            </div>

            {/* Engineer Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Field Engineer Remediation Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe remedial measures taken (e.g., asphalt hot-mix filled, 1100L bins cleared, breaker replaced)..."
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Attach Resolution Photo */}
            {selectedStatus === "Resolved" && (
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Resolution Proof Photo (Mandatory for AMC Quality Audit)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={resolutionImg}
                    onChange={(e) => setResolutionImg(e.target.value)}
                    placeholder="Enter image URL or select a verified sample photo below..."
                    className="flex-1 text-xs bg-white border border-emerald-300 rounded-xl px-3 py-2"
                  />
                  {sampleResolutionPhotos.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setResolutionImg(s.url)}
                      className="text-[11px] font-semibold px-2.5 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-200/60 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/25 active:scale-95 transition-all flex items-center gap-1.5"
          >
            {isSaving ? "Saving..." : "Update Complaint Status"}
          </button>
        </div>
      </div>
    </div>
  );
};
