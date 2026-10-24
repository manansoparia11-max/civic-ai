import React, { useState, useEffect } from "react";
import { 
  Terminal, Activity, RefreshCw, Cpu, CheckCircle2, AlertTriangle, 
  MapPin, Eye, Building2, ShieldAlert, Sparkles, Filter, Clock
} from "lucide-react";
import { fetchAgentActivity } from "../services/api";

export const ActivityPage = ({ setActiveTab }) => {
  const [logs, setLogs] = useState([]);
  const [filterTool, setFilterTool] = useState("All");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await fetchAgentActivity(40);
      setLogs(data);
    } catch (err) {
      console.error("Failed to load activity logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(loadLogs, 3500);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const uniqueTools = ["All", ...new Set(logs.map((l) => l.tool))];

  const filteredLogs = logs.filter((l) => {
    if (filterTool === "All") return true;
    return l.tool === filterTool;
  });

  const getToolBadgeStyle = (tool) => {
    if (tool.includes("vision")) return "bg-purple-950 text-purple-300 border-purple-800/40";
    if (tool.includes("road_space")) return "bg-amber-950 text-amber-300 border-amber-800/40";
    if (tool.includes("gps")) return "bg-sky-950 text-sky-300 border-sky-800/40";
    if (tool.includes("ward")) return "bg-indigo-950 text-indigo-300 border-indigo-800/40";
    if (tool.includes("department")) return "bg-blue-950 text-blue-300 border-blue-800/40";
    if (tool.includes("registration")) return "bg-emerald-950 text-emerald-300 border-emerald-800/40";
    return "bg-slate-900 text-slate-300 border-slate-700";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
              Autonomous Agent Telemetry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Live AI Agent Activity
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Real-time audit stream of Gemini 2.0 Flash inferences, road space assessments, EXIF GPS extractions, and AMC municipal routing tool calls.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
              autoRefresh
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? "bg-emerald-400 animate-ping" : "bg-slate-500"}`}></span>
            <span>{autoRefresh ? "Live Stream (3.5s)" : "Stream Paused"}</span>
          </button>

          <button
            type="button"
            onClick={loadLogs}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-cyan-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Audited Operations</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{logs.length}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">100% Traceable</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Vision Model</span>
          <div className="text-base font-black text-purple-700 font-mono mt-1">gemini-2.0-flash</div>
          <span className="text-[11px] text-slate-500">Google GenAI SDK</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Heuristic Fallback</span>
          <div className="text-base font-black text-emerald-600 mt-1">High-Fidelity Rules</div>
          <span className="text-[11px] text-slate-500">Zero downtime safety net</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AMC Ward Cadastral</span>
          <div className="text-2xl font-black text-blue-600 mt-1">48 Wards</div>
          <span className="text-[11px] text-slate-500">7 Administrative Zones</span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar text-xs">
        <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> Filter Tool:
        </span>
        {uniqueTools.map((tool) => (
          <button
            key={tool}
            onClick={() => setFilterTool(tool)}
            className={`px-3 py-1.5 rounded-xl font-mono whitespace-nowrap transition-all ${
              filterTool === tool
                ? "bg-slate-900 text-white shadow-xs font-bold"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 font-medium"
            }`}
          >
            {tool}
          </button>
        ))}
      </div>

      {/* Terminal View */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 p-5 sm:p-6 text-white shadow-2xl space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400 text-[11px]">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>AGENT_EVENT_STREAM (JSON Logs)</span>
          </div>
          <span>Showing {filteredLogs.length} events</span>
        </div>

        {filteredLogs.length > 0 ? (
          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredLogs.map((log, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <div
                  key={log.id || idx}
                  className="rounded-2xl bg-slate-900/70 border border-slate-800 p-3.5 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${getToolBadgeStyle(log.tool)}`}>
                        {log.tool}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${log.status === "error" ? "bg-rose-500" : log.status === "warning" ? "bg-amber-400" : "bg-emerald-400"}`}></span>
                    </div>
                    <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                  </div>

                  <p className="text-slate-200 text-xs leading-relaxed font-sans font-medium">
                    {log.description}
                  </p>

                  {/* Details Toggle */}
                  {log.details && Object.keys(log.details).length > 0 && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono font-bold flex items-center gap-1"
                      >
                        <span>{isExpanded ? "Hide payload" : "View diagnostic payload"}</span>
                      </button>

                      {isExpanded && (
                        <pre className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 overflow-x-auto leading-normal">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500">
            No events logged yet for the selected filter.
          </div>
        )}
      </div>

    </div>
  );
};
