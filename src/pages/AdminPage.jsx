import React, { useState, useMemo, useEffect } from "react";
import { 
  LayoutDashboard, Search, Filter, ShieldAlert, CheckCircle2, Clock, 
  AlertCircle, Building2, MapPin, Download, RefreshCw, Eye, Edit3, 
  BarChart3, TrendingUp, Users, ArrowUpRight, ChevronDown, Sparkles,
  Terminal, Activity, Cpu
} from "lucide-react";
import { useComplaints } from "../context/ComplaintContext";
import { StatusBadge, SeverityBadge } from "../components/StatusBadge";
import { ComplaintModal } from "../components/ComplaintModal";
import { ALL_WARDS, AMC_DEPARTMENTS } from "../data/ahmedabadWards";
import { fetchAgentActivity } from "../services/api";

export const AdminPage = ({ setActiveTab }) => {
  const { complaints, metrics, updateComplaintStatus, deleteComplaint, resetToSampleData } = useComplaints();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [wardFilter, setWardFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("All");

  // Live AI Agent Activity Log
  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    const loadActivity = () => {
      fetchAgentActivity(12)
        .then((data) => {
          if (data && data.length > 0) setActivityLog(data);
        })
        .catch(() => {});
    };

    loadActivity();
    const interval = setInterval(loadActivity, 4000);
    return () => clearInterval(interval);
  }, []);

  // Modal State
  const [modalComplaint, setModalComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtered Complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      // Search
      const search = searchTerm.toLowerCase();
      const matchesSearch = 
        !search ||
        c.id.toLowerCase().includes(search) ||
        c.title.toLowerCase().includes(search) ||
        c.location.toLowerCase().includes(search) ||
        c.ward.toLowerCase().includes(search) ||
        c.reportedBy.toLowerCase().includes(search);

      // Status
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;

      // Ward
      const matchesWard = wardFilter === "All" || c.ward.includes(wardFilter);

      // Severity
      const matchesSeverity = severityFilter === "All" || c.severity === severityFilter;

      // Dept
      const matchesDept = selectedDeptFilter === "All" || c.department.includes(selectedDeptFilter);

      return matchesSearch && matchesStatus && matchesWard && matchesSeverity && matchesDept;
    });
  }, [complaints, searchTerm, statusFilter, wardFilter, severityFilter, selectedDeptFilter]);

  const openEditModal = (complaint) => {
    setModalComplaint(complaint);
    setIsModalOpen(true);
  };

  // Issue Category Distribution for Chart
  const categoryStats = useMemo(() => {
    const counts = {};
    complaints.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      pct: Math.round((count / complaints.length) * 100) || 0
    }));
  }, [complaints]);

  // Ward Distribution
  const wardStats = useMemo(() => {
    const counts = {};
    complaints.forEach((c) => {
      const wardKey = c.ward.split(" - ")[1] || c.ward;
      counts[wardKey] = (counts[wardKey] || 0) + 1;
    });
    return Object.entries(counts).slice(0, 5);
  }, [complaints]);

  const exportReportCSV = () => {
    const headers = "ID,Title,Category,Ward,Status,Severity,Department,CreatedAt\n";
    const rows = filteredComplaints.map(c => 
      `"${c.id}","${c.title}","${c.category}","${c.ward}","${c.status}","${c.severity}","${c.department}","${c.createdAt}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `AMC_CivicSnap_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono font-bold tracking-wider text-cyan-300 uppercase">
              AMC Central Command & Monitoring Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Municipal Grievance Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Real-time multi-ward dashboard for Ahmedabad Municipal Corporation executive engineers, contractors, and zonal inspectors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportReportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all"
          >
            <Download className="w-4 h-4 text-cyan-300" />
            <span>Export CSV Report</span>
          </button>
          <button
            onClick={resetToSampleData}
            title="Reset to default mock dataset"
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Data</span>
          </button>
        </div>
      </div>

      {/* KPI STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-glass">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Complaints</span>
            <BarChart3 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{metrics.total}</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>100% AI Triaged</span>
          </div>
        </div>

        {/* Open */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-glass">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Open / Triage</span>
            <AlertCircle className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-blue-600">{metrics.open}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Awaiting field inspection
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-glass">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">In Progress</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600">{metrics.inProgress}</div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">
            Field crew mobilized
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-glass">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-600">{metrics.resolved}</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            {metrics.resolutionRate}% Resolution Rate
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="col-span-2 lg:col-span-1 bg-rose-50/70 p-5 rounded-3xl border border-rose-200/80 shadow-glass">
          <div className="flex items-center justify-between text-rose-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Critical Hazards</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-rose-700">{metrics.critical}</div>
          <div className="text-[11px] text-rose-600 font-bold mt-1">
            Requires &lt; 12h resolution
          </div>
        </div>

      </div>

      {/* ANALYTICS & VISUAL BREAKDOWN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Issue Category Distribution Bar Chart Visual (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-glass p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Civic Issues by Category (Ahmedabad Wards)
              </h3>
              <p className="text-xs text-slate-500">
                AI automated classification distribution across all reported cases
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              Live Breakdown
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {categoryStats.map((item, idx) => {
              const colors = [
                "from-blue-600 to-indigo-600",
                "from-emerald-500 to-teal-600",
                "from-amber-500 to-orange-600",
                "from-sky-500 to-blue-500",
                "from-purple-500 to-pink-500"
              ];
              const barColor = colors[idx % colors.length];

              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span className="truncate max-w-[70%]">{item.name}</span>
                    <span className="font-mono text-slate-500">
                      {item.count} tickets ({item.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-700 shadow-xs`}
                      style={{ width: `${Math.max(item.pct, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Active Wards & SLA Performance (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-glass p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                High-Volume Municipal Wards
              </h3>
              <p className="text-xs text-slate-500">
                Active civic ticket volume by sub-division
              </p>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            {wardStats.map(([wardName, count], idx) => (
              <div
                key={wardName}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-800">{wardName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-700">{count} Active</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    94% SLA
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200/70 text-xs text-blue-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Average Ahmedabad SLA resolution index: <strong>34.2 hours</strong></span>
          </div>
        </div>

      </div>

      {/* COMPLAINTS MANAGEMENT TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-glass overflow-hidden space-y-4 p-6">

        
        {/* Table Filter & Search Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Complaints Work Order Registry
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredComplaints.length} of {complaints.length} total municipal reports
            </p>
          </div>

          {/* Search Box */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ticket, ward, citizen..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-semibold text-[11px] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Filters:
          </span>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Ward Filter */}
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700"
          >
            <option value="All">All Wards</option>
            <option value="Bodakdev">Bodakdev</option>
            <option value="Vastrapur">Vastrapur</option>
            <option value="Navrangpura">Navrangpura</option>
            <option value="Satellite">Satellite</option>
            <option value="Maninagar">Maninagar</option>
          </select>

          {(statusFilter !== "All" || severityFilter !== "All" || wardFilter !== "All" || searchTerm) && (
            <button
              onClick={() => {
                setStatusFilter("All");
                setSeverityFilter("All");
                setWardFilter("All");
                setSearchTerm("");
              }}
              className="text-xs text-blue-600 hover:underline font-semibold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Table View */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Ticket & Photo</th>
                <th className="py-3 px-4">Issue Details</th>
                <th className="py-3 px-4">Ward & Zone</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                    
                    {/* ID & Photo thumbnail */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <img src={item.imageUrl} alt={item.id} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="font-mono font-bold text-blue-700 block">{item.id}</span>
                          <span className="text-[10px] text-slate-400 font-mono">Conf: {item.confidence}%</span>
                        </div>
                      </div>
                    </td>

                    {/* Details */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 truncate">{item.title}</div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">{item.location}</div>
                      {item.roadSpaceReductionPct && (
                        <div className="text-[10px] text-amber-700 font-semibold mt-0.5 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                          <span className="truncate">-{item.roadSpaceReductionPct}% road space • {item.roadDamageType || 'Defect'}</span>
                        </div>
                      )}
                    </td>

                    {/* Ward */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{item.ward}</div>
                      <div className="text-[10px] text-slate-400">{item.zone}</div>
                    </td>

                    {/* Severity */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <SeverityBadge severity={item.severity} size="sm" />
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={item.status} size="sm" />
                    </td>

                    {/* Department */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-slate-700 font-medium">{item.department.split(" ")[0]}</span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Manage Status</span>
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No complaints matched your active filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* LIVE AI AGENT ACTIVITY AUDIT STREAM */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 text-white space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-950 border border-blue-500/30 flex items-center justify-center text-cyan-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight text-white">
                  Live AI Agent Activity & Tool Calls
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-[11px] text-slate-400">
                Audited streaming log of neural vision inferences, ward lookups, department routing, and DB operations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ● REAL-TIME AGENT AUDIT
            </span>
          </div>
        </div>

        {activityLog.length > 0 ? (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1 font-mono text-xs">
            {activityLog.map((log, idx) => (
              <div
                key={log.id || idx}
                className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-cyan-400 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/40 text-[10px] shrink-0">
                    {log.tool}
                  </span>
                  <span className="text-slate-300 text-[11px] leading-relaxed">
                    {log.description}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${log.status === "error" ? "bg-rose-500" : log.status === "warning" ? "bg-amber-400" : "bg-emerald-400"}`}></span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-slate-500 text-xs font-mono">
            Awaiting next AI agent tool call (Upload photo or ask CivicBot to view real-time log).
          </div>
        )}
      </div>

      {/* Edit & Status Modal */}
      <ComplaintModal
        complaint={modalComplaint}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdateStatus={updateComplaintStatus}
      />

    </div>
  );
};
