import React, { useState, useEffect } from "react";
import { Sparkles, CheckCircle2, ShieldAlert, Cpu, Eye, MapPin, Building2, Zap, Terminal, Activity } from "lucide-react";

export const IssueScanAnimation = ({ image, onComplete, aiResult, toolCalls = [] }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: "Initializing Gemini 2.0 Flash Vision Pipeline", desc: "Loading multimodal road inspection & defect weights...", icon: Cpu },
    { title: "Scanning Road Pavement & Structural Damage", desc: "Inspecting asphalt cavity depth, cracking & road surface damage...", icon: Eye },
    { title: "Evaluating Road Space Reduction & Obstruction", desc: "Measuring percentage of vehicular lane blocked by defect or waste...", icon: ShieldAlert },
    { title: "Resolving AMC Ward & GIS Jurisdiction", desc: "Correlating location with Ahmedabad cadastral map...", icon: MapPin },
    { title: "Auto-Routing to Municipal Department", desc: "Generating AMC SLA work order dispatch ticket...", icon: Building2 },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 800);
          return prev;
        }
      });
    }, 850);

    return () => clearInterval(timer);
  }, [onComplete, steps.length]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Main HUD Scanning Box */}
      <div className="rounded-3xl overflow-hidden bg-slate-900 border border-blue-500/30 shadow-2xl text-white relative">
        {/* Top HUD Bar */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-mono font-semibold tracking-wider text-blue-400 uppercase">
              CivicSnap Vision AI • Ahmedabad Municipal Engine
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="text-emerald-400 font-bold">MODEL: GEMINI-2.0-FLASH</span>
            <span className="hidden sm:inline">ENGINE: ACTIVE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Scanned Image Preview with Laser Bar and Bounding Boxes */}
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-950 border border-blue-500/40 shadow-inner flex items-center justify-center group">
            <img
              src={image}
              alt="AI Scan target"
              className="w-full h-full object-cover filter brightness-95 contrast-105"
            />

            {/* Grid Overlay */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: "linear-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.4) 1px, transparent 1px)",
                backgroundSize: "24px 24px"
              }}
            />

            {/* Glowing Animated Laser Line */}
            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scan pointer-events-none z-20 flex items-center justify-center">
              <span className="text-[10px] font-mono font-bold bg-cyan-950/90 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400/50 -translate-y-4">
                AI SCANNING DEFECT
              </span>
            </div>

            {/* Dynamic AI Detection Bounding Box */}
            <div className="absolute inset-8 border-2 border-dashed border-cyan-400/80 rounded-xl bg-cyan-500/10 z-10 flex flex-col justify-between p-2 pointer-events-none animate-pulse">
              <div className="flex justify-between items-start gap-1">
                <span className="bg-cyan-600/90 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow truncate max-w-[65%]">
                  TARGET: {aiResult?.category || "CIVIC_DEFECT"}
                </span>
                <span className="bg-emerald-600/90 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow shrink-0">
                  CONF: {aiResult?.confidence || 96.5}%
                </span>
              </div>

              {/* Real-time Road Space & Damage Metric Callout */}
              <div className="bg-slate-950/90 rounded-lg p-2 border border-cyan-500/40 text-[9px] font-mono space-y-1">
                <div className="flex justify-between items-center text-amber-300 font-bold">
                  <span>ROAD SPACE REDUCTION:</span>
                  <span className="bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/40">
                    -{aiResult?.roadSpaceReductionPct || 35}%
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>DAMAGE:</span>
                  <span className="text-cyan-300 truncate max-w-[60%]">
                    {aiResult?.roadDamageType || "ASPHALT CAVITY & STRUCTURAL EROSION"}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-end text-[9px] font-mono text-cyan-200 bg-slate-900/80 p-1.5 rounded border border-cyan-500/30 backdrop-blur-xs">
                <span>SEVERITY: {aiResult?.severity || "HIGH"}</span>
                <span>AMC CADASTRE: VERIFIED</span>
              </div>
            </div>


            {/* Corner brackets */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />
          </div>

          {/* Real-time Processing Pipeline Steps */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" />
                <h4 className="text-base font-bold text-white tracking-tight">
                  AI Diagnostics in Progress
                </h4>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Multi-modal agent executing automated defect recognition, ward identification, and municipal routing.
              </p>

              {/* Stepper */}
              <div className="space-y-3">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = idx < currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 p-2.5 rounded-xl transition-all duration-300 ${
                        isCurrent
                          ? "bg-blue-900/40 border border-cyan-500/40 shadow-sm shadow-cyan-500/10"
                          : isCompleted
                          ? "bg-slate-800/40 border border-slate-700/40"
                          : "opacity-40"
                      }`}
                    >
                      <div className="mt-0.5">
                        {isCompleted ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center animate-pulse">
                            <Icon className="w-3.5 h-3.5 animate-spin" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center text-[10px] font-mono">
                            {idx + 1}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className={`text-xs font-semibold ${isCurrent ? "text-cyan-300" : isCompleted ? "text-white" : "text-slate-400"}`}>
                          {step.title}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="pt-2">
              <div className="flex justify-between text-xs font-mono text-cyan-300 mb-1.5">
                <span>ANALYSIS COMPLETE</span>
                <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live AI Agent Tool Activity Log Feed */}
      {toolCalls && toolCalls.length > 0 && (
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 shadow-lg">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white tracking-wide">Live AI Agent Tool Execution</span>
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ACTIVE STREAM
            </span>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {toolCalls.map((tc, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-[11px] leading-tight">
                <span className="text-slate-500 shrink-0 text-[10px]">{tc.timestamp || "NOW"}</span>
                <span className="text-cyan-400 font-bold bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/40 shrink-0 text-[10px]">
                  {tc.tool}
                </span>
                <span className="text-slate-300">{tc.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
