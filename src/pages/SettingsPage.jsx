import React, { useState, useEffect } from "react";
import { 
  Key, Sparkles, CheckCircle2, AlertTriangle, Cpu, Database, 
  RefreshCw, ShieldCheck, ExternalLink, Zap, Eye, EyeOff, Server, HardDrive
} from "lucide-react";
import { fetchSettings, saveSettings, testGeminiKey } from "../services/api";
import { useComplaints } from "../context/ComplaintContext";

export const SettingsPage = ({ setActiveTab }) => {
  const { complaints, resetToSampleData } = useComplaints();
  const [apiKey, setApiKey] = useState("");
  const [maskedKey, setMaskedKey] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [saveMessage, setSaveMessage] = useState(null);

  // Load current settings
  useEffect(() => {
    fetchSettings()
      .then((data) => {
        setHasKey(data.hasKey);
        setMaskedKey(data.maskedKey || "");
      })
      .catch((err) => console.error("Failed to load settings:", err));
  }, []);

  const handleSaveKey = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await saveSettings(apiKey.trim());
      setHasKey(res.hasKey);
      setMaskedKey(apiKey.length > 8 ? `${apiKey.slice(0, 4)}••••••••••••${apiKey.slice(-4)}` : "••••••••");
      setApiKey("");
      setSaveMessage({ type: "success", text: "Gemini API key saved and activated successfully!" });
    } catch (err) {
      setSaveMessage({ type: "error", text: "Failed to save API key. Please check backend connection." });
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testGeminiKey(apiKey.trim() || undefined);
      setTestResult(res);
    } catch (err) {
      setTestResult({
        status: "error",
        message: err.message || "Failed to contact backend testing service",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Hackathon Configuration</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
          AI & Platform Settings
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Configure your Google Gemini API key, verify vision model status, and inspect local JSON persistence.
        </p>
      </div>

      {/* API Key Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-glass overflow-hidden">
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Google Gemini API Key</h3>
                <p className="text-xs text-slate-500">
                  Power live Gemini 2.0 Flash Vision inspection and CivicBot conversational synthesis
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {hasKey ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  API Key Configured
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Fallback Heuristic Mode
                </span>
              )}
            </div>
          </div>

          {/* Masked Key Status */}
          {maskedKey && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Active Key</span>
                <span className="font-mono font-bold text-slate-800">{maskedKey}</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                Active
              </span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSaveKey} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Enter New or Updated Gemini API Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full text-xs sm:text-sm font-mono bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                <span>Stored securely in backend environment (`backend/.env`)</span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline font-bold inline-flex items-center gap-1"
                >
                  <span>Get a free key from Google AI Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving || !apiKey.trim()}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
              >
                {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Save API Key</span>
              </button>

              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors flex items-center gap-2"
              >
                {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" /> : <Zap className="w-3.5 h-3.5 text-amber-500" />}
                <span>Test Connection</span>
              </button>
            </div>
          </form>

          {/* Messages */}
          {saveMessage && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                saveMessage.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              {saveMessage.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
              <span>{saveMessage.text}</span>
            </div>
          )}

          {/* Test Result Display */}
          {testResult && (
            <div
              className={`p-4 rounded-2xl text-xs border space-y-2 animate-fadeIn ${
                testResult.status === "connected"
                  ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                  : testResult.status === "not_configured"
                  ? "bg-amber-50/70 border-amber-200 text-amber-950"
                  : "bg-rose-50/70 border-rose-200 text-rose-950"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                  {testResult.status === "connected" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {testResult.status === "not_configured" && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                  {testResult.status === "error" && <AlertTriangle className="w-4 h-4 text-rose-600" />}
                  Diagnostics Result: {testResult.status}
                </span>
                {testResult.latencyMs && (
                  <span className="font-mono font-bold bg-white/80 px-2 py-0.5 rounded border border-emerald-200">
                    Latency: {testResult.latencyMs}ms
                  </span>
                )}
              </div>
              <p className="text-[11px] leading-relaxed">{testResult.message}</p>
              {testResult.sampleResponse && (
                <div className="font-mono text-[10px] bg-white/90 p-2 rounded-lg border border-emerald-200">
                  Model Output: "{testResult.sampleResponse}"
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Model & Architecture Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Model Specs */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Vision & NLP Engine</h4>
              <p className="text-[11px] text-slate-500">Google Gemini 2.0 Flash</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 flex justify-between">
              <span className="text-slate-500">Active Model:</span>
              <strong className="text-slate-800 font-mono">gemini-2.0-flash</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 flex justify-between">
              <span className="text-slate-500">Fallback Heuristics:</span>
              <strong className="text-emerald-700">Enabled (Auto-Switch)</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 flex justify-between">
              <span className="text-slate-500">Road Space Loss Metric:</span>
              <strong className="text-amber-700">Active (0–100%)</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 flex justify-between">
              <span className="text-slate-500">EXIF GPS Parsing:</span>
              <strong className="text-blue-700">Pillow EXIF Reader</strong>
            </div>
          </div>
        </div>

        {/* Database & Persistence */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Local JSON Persistence</h4>
              <p className="text-[11px] text-slate-500">Self-contained offline file store</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 flex justify-between">
              <span className="text-slate-500">Storage Location:</span>
              <span className="font-mono font-semibold text-slate-800 truncate max-w-xs">backend/data/complaints.json</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 flex justify-between">
              <span className="text-slate-500">Total Saved Records:</span>
              <strong className="text-slate-900">{complaints.length} Complaints</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 flex justify-between">
              <span className="text-slate-500">Government Portal Sync:</span>
              <strong className="text-slate-600">Simulated AMC Cadastral</strong>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={resetToSampleData}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold inline-flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to default 5 complaints</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
