import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  fetchComplaints,
  createComplaint as apiCreateComplaint,
  updateComplaintStatus as apiUpdateStatus,
  deleteComplaint as apiDeleteComplaint,
  resetComplaints as apiResetComplaints,
  fetchComplaintById,
  fetchMetrics,
} from "../services/api";

const ComplaintContext = createContext(null);

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([]);
  const [activeComplaintId, setActiveComplaintId] = useState(null);
  const [metrics, setMetrics] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    critical: 0,
    high: 0,
    resolutionRate: 0,
    avgResolutionHours: "34.5",
  });
  const [loading, setLoading] = useState(true);

  // Load all complaints from backend
  const loadComplaints = useCallback(async () => {
    try {
      const [data, metricsData] = await Promise.all([
        fetchComplaints(),
        fetchMetrics(),
      ]);
      setComplaints(data);
      setMetrics(metricsData);
      // Set first complaint as active if none selected
      if (!activeComplaintId && data.length > 0) {
        setActiveComplaintId(data[0].id);
      }
    } catch (err) {
      console.error("Failed to load complaints from backend:", err);
    } finally {
      setLoading(false);
    }
  }, [activeComplaintId]);

  useEffect(() => {
    loadComplaints();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // Add a new complaint via backend
  const addComplaint = async (complaintData) => {
    try {
      const newComplaint = await apiCreateComplaint(complaintData);
      setComplaints((prev) => [newComplaint, ...prev]);
      setActiveComplaintId(newComplaint.id);
      // Refresh metrics
      fetchMetrics().then(setMetrics).catch(console.error);
      return newComplaint;
    } catch (err) {
      console.error("Failed to create complaint:", err);
      // Fallback: create locally if backend is down
      const fallback = createLocalComplaint(complaintData);
      setComplaints((prev) => [fallback, ...prev]);
      setActiveComplaintId(fallback.id);
      return fallback;
    }
  };

  // Update complaint status via backend
  const updateComplaintStatus = async (id, newStatus, notes, resolutionImg) => {
    try {
      const updated = await apiUpdateStatus(id, newStatus, notes, resolutionImg);
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? updated : c))
      );
      // Refresh metrics
      fetchMetrics().then(setMetrics).catch(console.error);
    } catch (err) {
      console.error("Failed to update complaint:", err);
      // Fallback: update locally
      updateLocalComplaint(id, newStatus, notes, resolutionImg);
    }
  };

  // Delete a complaint via backend
  const deleteComplaint = async (id) => {
    try {
      await apiDeleteComplaint(id);
      setComplaints((prev) => prev.filter((c) => c.id !== id));
      fetchMetrics().then(setMetrics).catch(console.error);
    } catch (err) {
      console.error("Failed to delete complaint:", err);
      setComplaints((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // Reset to seed data via backend
  const resetToSampleData = async () => {
    try {
      await apiResetComplaints();
      await loadComplaints();
    } catch (err) {
      console.error("Failed to reset complaints:", err);
    }
  };

  const getComplaintById = (id) => {
    if (!id) return null;
    const cleanId = id.trim().toUpperCase();
    return complaints.find((c) => c.id.toUpperCase() === cleanId) || null;
  };

  // Local fallback for complaint creation (when backend is down)
  const createLocalComplaint = (complaintData) => {
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const trackingId = `AMC-2026-${randomSuffix}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });

    return {
      id: trackingId,
      title: `[DEMO] ${complaintData.title || complaintData.category}`,
      category: complaintData.category || "General Civic Issue",
      description: complaintData.description || "Citizen reported civic issue.",
      severity: complaintData.severity || "Medium",
      hazardScore: complaintData.hazardScore || 75,
      confidence: complaintData.confidence || 96.2,
      roadSpaceReductionPct: complaintData.roadSpaceReductionPct || 35,
      roadSpaceImpact: complaintData.roadSpaceImpact || "Reduces active road space and disrupts traffic flow",
      roadDamageType: complaintData.roadDamageType || "Surface Defect & Traffic Obstruction",
      obstructionType: complaintData.obstructionType || complaintData.category,
      status: "Open",
      ward: complaintData.ward || "Ward 9 - Bodakdev",
      zone: complaintData.zone || "North West Zone",
      location: complaintData.location || "Ahmedabad, Gujarat",
      coordinates: complaintData.coordinates || { lat: 23.0338, lng: 72.5467 },
      department: complaintData.department || "Roads & Buildings Project Dept",
      assignedEngineer: "Er. Rahul Patel (Assigned AMC Zonal AE)",
      fieldContractor: "AMC Quick Response Squad",
      reportedBy: complaintData.reportedBy || "Civic Citizen",
      citizenPhone: complaintData.citizenPhone || "+91 98250 XXXXX",
      createdAt: now.toISOString(),
      slaDeadline: new Date(now.getTime() + (complaintData.slaHours || 36) * 3600 * 1000).toISOString(),
      imageUrl: complaintData.imageUrl,
      resolutionImageUrl: null,
      resolutionNotes: null,
      timeline: [
        {
          stage: "Complaint Registered",
          status: "completed",
          timestamp: formattedDate,
          note: `Complaint created locally (backend unavailable).`
        },
        { stage: "Ward Officer Verification", status: "current", timestamp: "In Progress", note: "Pending backend sync." },
        { stage: "Work Order Issued", status: "upcoming", timestamp: "Pending", note: "" },
        { stage: "Repair in Progress", status: "upcoming", timestamp: "Pending", note: "" },
        { stage: "Quality Audit & Resolved", status: "upcoming", timestamp: "Pending", note: "" }
      ]
    };
  };

  // Local fallback for status update
  const updateLocalComplaint = (id, newStatus, notes, resolutionImg) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        return { ...c, status: newStatus, resolutionNotes: notes || c.resolutionNotes, resolutionImageUrl: resolutionImg || c.resolutionImageUrl };
      })
    );
  };

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        activeComplaintId,
        setActiveComplaintId,
        addComplaint,
        updateComplaintStatus,
        deleteComplaint,
        resetToSampleData,
        getComplaintById,
        metrics,
        loading,
        refreshComplaints: loadComplaints,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error("useComplaints must be used within a ComplaintProvider");
  }
  return context;
};
