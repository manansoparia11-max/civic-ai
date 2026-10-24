import React, { useState } from "react";
import { Camera, Search, LayoutDashboard, Home, PhoneCall, Menu, X, Sparkles, ShieldCheck, Activity, Settings } from "lucide-react";
import { useComplaints } from "../context/ComplaintContext";

export const Navbar = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { metrics } = useComplaints();

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "report", label: "Report Issue", icon: Camera, highlight: true },
    { id: "track", label: "Track & History", icon: Search },
    { id: "admin", label: "Admin Portal", icon: LayoutDashboard, badge: metrics.open },
    { id: "activity", label: "AI Activity", icon: Activity, pulse: true },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all duration-200">
      {/* Top micro banner for AMC / Ahmedabad */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium tracking-wide">Ahmedabad Smart City AI Governance Initiative</span>
            <span className="hidden sm:inline-block text-blue-200/60">•</span>
            <span className="hidden sm:inline-block text-blue-200">48 Wards Connected</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-blue-100 hover:text-white transition-colors">
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span>AMC Toll-Free: <strong>155303</strong></span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <button 
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-slate-950/10 rounded-[10px] flex items-center justify-center text-white backdrop-blur-xs">
                <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  Civic<span className="text-blue-600">Snap</span>
                </span>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                  <Sparkles className="w-2.5 h-2.5 text-blue-600" /> AI
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 tracking-wider uppercase">
                AMC • Ahmedabad
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              if (item.highlight) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="ml-2 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/30 active:scale-95 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4 text-sky-200" />
                    <span>{item.label}</span>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-white/20 text-white uppercase tracking-wider">
                      Instant
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? "text-blue-700 bg-blue-50/80 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                  {item.pulse && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  )}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action on Desktop */}
          <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>AMC SLA Guarantee</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick("report")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow-sm"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Snap</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-2 pb-5 space-y-1.5 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    {item.badge} pending
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500 px-3 py-2 bg-slate-50 rounded-lg">
              <span>Emergency Civic Helpline:</span>
              <span className="font-bold text-blue-700">155303 (24x7)</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
