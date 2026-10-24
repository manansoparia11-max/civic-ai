import React from "react";
import { Camera, Sparkles, PhoneCall, ShieldCheck, MapPin, ExternalLink, Heart } from "lucide-react";

export const Footer = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950/20 rounded-[10px] flex items-center justify-center text-white">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">
                  Civic<span className="text-blue-400">Snap</span> AI
                </span>
                <p className="text-[11px] font-medium text-slate-400 tracking-wider uppercase">
                  Ahmedabad Municipal Corporation
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Ahmedabad's citizen-first AI governance platform. Instant defect detection, automated GIS ward routing, and transparent SLA tracking across all 48 municipal wards.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-blue-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>AMC Citizen Charter Certified</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Vision AI v4.2</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Platform Features
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => { setActiveTab("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Home & Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab("report"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="hover:text-blue-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <span>Report Civic Issue</span>
                  <span className="text-[10px] px-1 rounded bg-blue-500/20 text-blue-400">AI</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab("track"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Track Complaint & Timeline
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab("admin"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  AMC Officer Command Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab("activity"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Live AI Agent Activity Log
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab("settings"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Gemini API & Settings
                </button>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("home");
                    setTimeout(() => {
                      document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  How Computer Vision Works
                </a>
              </li>
            </ul>
          </div>

          {/* Ahmedabad Zones */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Ahmedabad Zonal Wings
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>North West (Bodakdev, Vastrapur)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>West (Navrangpura, Paldi, Sabarmati)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>South West (Satellite, Vejalpur, Bopal)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Central (Khadia, Shahpur, Jamalpur)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>South (Maninagar, Vatva, Danilimda)</span>
              </li>
            </ul>
          </div>

          {/* Emergency & Helpline */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              AMC Emergency Contacts
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-[11px] text-slate-400 block">AMC Citizen Helpline</span>
                <span className="text-base font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <PhoneCall className="w-4 h-4" />
                  155303 (24x7)
                </span>
              </div>
              <div className="text-slate-400 space-y-1">
                <p>Fire & Emergency: <strong className="text-slate-200">101</strong></p>
                <p>Ambulance: <strong className="text-slate-200">108</strong></p>
                <p>Mahanagar Seva Sadan, Danapith, Ahmedabad 380001</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CivicSnap AI. Built for the Citizens & Administration of Ahmedabad.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">Swachh Bharat Mission (Urban)</span>
            <span className="text-slate-400">Digital India</span>
            <span className="text-slate-400">Smart Cities Council</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
