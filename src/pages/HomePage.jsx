import React, { useState } from "react";
import { Camera, Search, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, Clock, MapPin, Building2, Flame, Users, ChevronRight, BarChart3, AlertCircle } from "lucide-react";
import { useComplaints } from "../context/ComplaintContext";
import { AMC_ZONES } from "../data/ahmedabadWards";
import { StatusBadge } from "../components/StatusBadge";

export const HomePage = ({ setActiveTab }) => {
  const { complaints, metrics, setActiveComplaintId } = useComplaints();
  const [selectedZone, setSelectedZone] = useState(AMC_ZONES[0].id);

  const resolvedShowcases = complaints.filter(c => c.status === "Resolved").slice(0, 3);
  const activeShowcases = complaints.filter(c => c.status !== "Resolved").slice(0, 3);

  const activeZoneObj = AMC_ZONES.find(z => z.id === selectedZone) || AMC_ZONES[0];

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden">
        {/* Soft background ambient gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-indigo-400/15 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headline and CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-xs font-bold text-blue-800 tracking-wide">
                  Ahmedabad Municipal Corporation • AI Vision Platform
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white uppercase">
                  v4.2 Live
                </span>
              </div>

              {/* Tagline */}
              <h1 className="text-4xl sm:text-6xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Snap It. <br />
                <span className="text-gradient">Report It.</span> <br />
                Resolve It.
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Take a quick photo of any pothole, overflowing garbage bin, or broken streetlight in Ahmedabad. 
                Our AI instantly detects the flaw, pins the GPS ward jurisdiction, and triggers direct AMC engineering work orders.
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => setActiveTab("report")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl font-bold text-base bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/25 hover:shadow-2xl hover:shadow-blue-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  <Camera className="w-5 h-5 text-blue-200" />
                  <span>Report an Issue</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={() => setActiveTab("track")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-semibold text-base bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <Search className="w-5 h-5 text-slate-500" />
                  <span>Track Complaint</span>
                </button>

                <button
                  onClick={() => setActiveTab("admin")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-4 rounded-2xl font-semibold text-sm text-slate-600 hover:text-blue-700 hover:bg-blue-50/50 transition-colors"
                >
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>Admin Hub</span>
                </button>
              </div>

              {/* Micro Stats Bar */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-center sm:text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">48</div>
                  <div className="text-xs font-semibold text-slate-500">Wards in Ahmedabad</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-blue-600">97.8%</div>
                  <div className="text-xs font-semibold text-slate-500">AI Triage Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-600">&lt; 36 hrs</div>
                  <div className="text-xs font-semibold text-slate-500">Average Resolution</div>
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Hero Mockup Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl p-1 bg-gradient-to-b from-blue-500 via-indigo-500 to-sky-400 shadow-2xl shadow-blue-500/20">
                <div className="bg-slate-950 rounded-[22px] overflow-hidden text-white p-5 space-y-4">
                  
                  {/* Mock Device Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                      <span className="text-xs font-mono font-bold text-cyan-300">AMC AI SCANNER</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">GPS: SINDHU BHAVAN RD</span>
                  </div>

                  {/* Mock Scanned Photo View with Bounding Box */}
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-900 border border-cyan-500/30">
                    <img
                      src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=700&q=80"
                      alt="Road pothole in Ahmedabad"
                      className="w-full h-full object-cover filter brightness-95"
                    />

                    {/* Laser Scan Bar */}
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-scan pointer-events-none" />

                    {/* Bounding Box */}
                    <div className="absolute inset-8 border-2 border-cyan-400/90 rounded-lg bg-cyan-500/10 p-2 flex flex-col justify-between pointer-events-none animate-pulse">
                      <span className="self-start text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500 text-slate-950">
                        DETECTED: POTHOLE (98.4%)
                      </span>
                      <span className="self-end text-[9px] font-mono text-cyan-200 bg-slate-900/80 px-1 rounded">
                        DEPTH: 14 CM
                      </span>
                    </div>
                  </div>

                  {/* AI Diagnosis Pill Output */}
                  <div className="space-y-2 bg-slate-900/90 p-3.5 rounded-xl border border-white/10 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[11px]">Auto Ward Assignment:</span>
                      <span className="text-cyan-300 font-bold font-mono">Ward 9 (Bodakdev)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[11px]">Nodal Department:</span>
                      <span className="text-white font-semibold">Roads & Buildings AMC</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[11px]">Severity Rating:</span>
                      <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">
                        High (Hazard Score: 86)
                      </span>
                    </div>
                  </div>

                  {/* Interactive Button */}
                  <button
                    onClick={() => setActiveTab("report")}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs tracking-wide shadow-md uppercase transition-all"
                  >
                    Test Live Scanner Now
                  </button>
                </div>
              </div>

              {/* Floating Citizen Badge */}
              <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-200/80 items-center gap-3 animate-bounce [animation-duration:4s]">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">18,420+ Resolved</div>
                  <div className="text-[11px] text-slate-500">Across Ahmedabad this year</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Intelligent Citizen Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            How CivicSnap AI Works in 3 Steps
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Eliminating traditional bureaucratic delays through automated computer vision and instant GIS dispatch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-glass hover:shadow-glass-hover transition-all duration-300 relative group">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Camera className="w-7 h-7" />
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest block mb-1">
              Step 01
            </span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Snap & Geo-Detect
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Capture or upload a photo of the defect. CivicSnap extracts exact GPS metadata and pinpoints the Ahmedabad ward.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-blue-600">
              <Sparkles className="w-4 h-4" />
              <span>Auto Geotagging & Ward Mapping</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-glass hover:shadow-glass-hover transition-all duration-300 relative group">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7" />
            </div>
            <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest block mb-1">
              Step 02
            </span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              AI Vision & Triage
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our neural network classifies the issue, calculates the hazard index, determines the SLA, and routes directly to the AMC engineer.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-indigo-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>Zero Manual Intervention</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-glass hover:shadow-glass-hover transition-all duration-300 relative group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-widest block mb-1">
              Step 03
            </span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Track & Verified Fix
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Receive live milestone alerts. When fixed, AMC field crews upload verified geotagged after-photos for citizen sign-off.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
              <span>Dual-Inspection Guaranteed</span>
            </div>
          </div>

        </div>
      </section>

      {/* RECENT RESOLVED COMPLAINTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Ahmedabad Ground Impact
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Recent Resolved Civic Issues
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Transparent before-and-after proof from AMC field crews across different zones.
            </p>
          </div>

          <button
            onClick={() => setActiveTab("track")}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors self-start sm:self-auto"
          >
            <span>Track your own ticket</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resolvedShowcases.map((complaint) => (
            <div
              key={complaint.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-glass overflow-hidden flex flex-col group hover:shadow-glass-hover transition-all duration-200"
            >
              {/* Photo Area */}
              <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                <img
                  src={complaint.imageUrl}
                  alt={complaint.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-slate-950/80 text-white backdrop-blur-xs">
                    {complaint.id}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <StatusBadge status="Resolved" size="sm" />
                </div>
                <div className="absolute bottom-2 left-2 right-2 bg-slate-900/85 backdrop-blur-xs text-white text-[11px] p-2 rounded-xl flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-400" />
                    {complaint.ward}
                  </span>
                  <span className="text-emerald-400 font-bold">100% Fixed</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1">
                    {complaint.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {complaint.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    Dept: <strong className="text-slate-700">{complaint.department.split(" ")[0]}</strong>
                  </div>
                  <button
                    onClick={() => {
                      setActiveComplaintId(complaint.id);
                      setActiveTab("track");
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <span>View Timeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AHMEDABAD ZONAL EXPLORER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-blue-500/20">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              Jurisdictional Mapping
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Ahmedabad 7-Zone AMC Grid
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5">
              Select any municipal zone to inspect active wards, civic center offices, and direct contact desk lines.
            </p>
          </div>

          {/* Zone Selector Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
            {AMC_ZONES.map((zone) => (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedZone === zone.id
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-white/5"
                }`}
              >
                {zone.name}
              </button>
            ))}
          </div>

          {/* Wards Grid in selected Zone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {activeZoneObj.wards.map((ward) => (
              <div
                key={ward.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/40 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300 font-mono">{ward.id.toUpperCase()}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">{ward.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1">{ward.office}</p>
                </div>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-300">
                  <span>Desk: <strong>{ward.contact}</strong></span>
                  <button
                    onClick={() => setActiveTab("report")}
                    className="text-[11px] font-bold text-cyan-400 hover:underline"
                  >
                    Report in Ward →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white uppercase tracking-wider">
              Be an Active Citizen
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Notice a civic issue in Ahmedabad?
            </h2>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              Takes less than 30 seconds. Snap a photo, let the AI diagnose, and track the AMC crew until it is completely resolved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab("report")}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-blue-700 font-extrabold text-sm shadow-xl hover:bg-slate-50 transition-all hover:scale-105 active:scale-95"
            >
              Report Issue Now
            </button>
            <button
              onClick={() => setActiveTab("track")}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-blue-800/60 hover:bg-blue-800 text-white font-semibold text-sm border border-white/20 transition-all"
            >
              Track by Ticket ID
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
