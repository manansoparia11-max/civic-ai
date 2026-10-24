import React from "react";
import { AlertCircle, Clock, CheckCircle2, ShieldAlert } from "lucide-react";

export const StatusBadge = ({ status, size = "md" }) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-medium gap-1",
    md: "px-2.5 py-1 text-xs font-semibold gap-1.5",
    lg: "px-3 py-1.5 text-sm font-semibold gap-2",
  };

  if (status === "Resolved") {
    return (
      <span className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-sm ${sizeClasses[size]}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Resolved</span>
      </span>
    );
  }

  if (status === "In Progress") {
    return (
      <span className={`inline-flex items-center rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 shadow-sm ${sizeClasses[size]}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        <span>In Progress</span>
      </span>
    );
  }

  // Open / Pending
  return (
    <span className={`inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 shadow-sm ${sizeClasses[size]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
      <AlertCircle className="w-3.5 h-3.5 text-blue-600" />
      <span>Open / Triaged</span>
    </span>
  );
};

export const SeverityBadge = ({ severity, size = "md" }) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-medium",
    md: "px-2.5 py-1 text-xs font-semibold",
    lg: "px-3 py-1.5 text-sm font-semibold",
  };

  switch (severity) {
    case "Critical":
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-red-50 text-red-700 border border-red-200 shadow-sm ${sizeClasses[size]}`}>
          <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
          <span>Critical Severity</span>
        </span>
      );
    case "High":
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200 shadow-sm ${sizeClasses[size]}`}>
          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
          <span>High Severity</span>
        </span>
      );
    case "Medium":
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-yellow-50 text-yellow-800 border border-yellow-200 shadow-sm ${sizeClasses[size]}`}>
          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
          <span>Medium Severity</span>
        </span>
      );
    case "Low":
    default:
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shadow-sm ${sizeClasses[size]}`}>
          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
          <span>Low Severity</span>
        </span>
      );
  }
};
