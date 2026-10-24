// CivicSnap AI — Backend API Service Layer
// All API calls to the FastAPI backend

const API_BASE = "/api";

/**
 * Analyze an uploaded image using Gemini Vision AI
 * @param {File} imageFile - The image file to analyze
 * @param {string} location - Optional location text
 * @param {string} ward - Optional ward name
 * @returns {Promise<{analysis, ward, zone, department, tool_calls}>}
 */
export async function analyzeImage(imageFile, location = "", ward = "") {
  const formData = new FormData();
  formData.append("image", imageFile);
  if (location) formData.append("location", location);
  if (ward) formData.append("ward", ward);

  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Analysis failed" }));
    throw new Error(err.detail || "Image analysis failed");
  }

  return res.json();
}

/**
 * Create a new complaint
 * @param {Object} complaintData
 * @returns {Promise<Object>} The created complaint
 */
export async function createComplaint(complaintData) {
  const res = await fetch(`${API_BASE}/complaints`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(complaintData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to create complaint" }));
    throw new Error(err.detail || "Failed to create complaint");
  }

  return res.json();
}

/**
 * Fetch all complaints with optional filters
 * @param {Object} filters - { status, ward, severity, department, search }
 * @returns {Promise<Array>}
 */
export async function fetchComplaints(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, val]) => {
    if (val && val !== "All") params.append(key, val);
  });

  const res = await fetch(`${API_BASE}/complaints?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch complaints");
  return res.json();
}

/**
 * Fetch a single complaint by ID
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function fetchComplaintById(id) {
  const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(id)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch complaint");
  return res.json();
}

/**
 * Update a complaint's status
 * @param {string} id
 * @param {string} status
 * @param {string} notes
 * @param {string} resolutionImageUrl
 * @returns {Promise<Object>}
 */
export async function updateComplaintStatus(id, status, notes = "", resolutionImageUrl = "") {
  const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status,
      resolutionNotes: notes || undefined,
      resolutionImageUrl: resolutionImageUrl || undefined,
    }),
  });

  if (!res.ok) throw new Error("Failed to update complaint");
  return res.json();
}

/**
 * Delete a complaint
 * @param {string} id
 */
export async function deleteComplaint(id) {
  const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete complaint");
  return res.json();
}

/**
 * Reset complaints to seed data
 */
export async function resetComplaints() {
  const res = await fetch(`${API_BASE}/complaints/reset`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to reset complaints");
  return res.json();
}

/**
 * Fetch metrics summary
 * @returns {Promise<Object>}
 */
export async function fetchMetrics() {
  const res = await fetch(`${API_BASE}/metrics`);
  if (!res.ok) throw new Error("Failed to fetch metrics");
  return res.json();
}

/**
 * Send a chat message to CivicBot AI
 * @param {string} message
 * @param {string|null} complaintId
 * @returns {Promise<{reply: string, tool_calls: Array}>}
 */
export async function sendChatMessage(message, complaintId = null) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, complaintId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Chat failed" }));
    throw new Error(err.detail || "Chat failed");
  }

  return res.json();
}

/**
 * Upload an image file to the server
 * @param {File} file
 * @returns {Promise<{url: string}>}
 */
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_BASE}/upload-image`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload image");
  return res.json();
}

/**
 * Fetch live AI agent activity log (tool calls)
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function fetchAgentActivity(limit = 15) {
  const res = await fetch(`${API_BASE}/agent/activity?limit=${limit}`);
  if (!res.ok) return [];
  return res.json();
}

/**
 * Fetch system settings and Gemini API key status
 * @returns {Promise<Object>}
 */
export async function fetchSettings() {
  const res = await fetch(`${API_BASE}/settings`);
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
}

/**
 * Save / Update Gemini API key
 * @param {string} apiKey
 * @returns {Promise<Object>}
 */
export async function saveSettings(apiKey) {
  const res = await fetch(`${API_BASE}/settings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey }),
  });
  if (!res.ok) throw new Error("Failed to save settings");
  return res.json();
}

/**
 * Test Gemini API connection
 * @param {string} apiKey (optional)
 * @returns {Promise<Object>}
 */
export async function testGeminiKey(apiKey = "") {
  const res = await fetch(`${API_BASE}/settings/test-key`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(apiKey ? { apiKey } : {}),
  });
  if (!res.ok) throw new Error("Failed to test Gemini API key");
  return res.json();
}


