import React, { useState } from "react";
import { ComplaintProvider } from "./context/ComplaintContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { ReportPage } from "./pages/ReportPage";
import { TrackPage } from "./pages/TrackPage";
import { AdminPage } from "./pages/AdminPage";
import { ActivityPage } from "./pages/ActivityPage";
import { SettingsPage } from "./pages/SettingsPage";

export function AppContent() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Page Area */}
      <main className="flex-1">
        {activeTab === "home" && <HomePage setActiveTab={setActiveTab} />}
        {activeTab === "report" && <ReportPage setActiveTab={setActiveTab} />}
        {activeTab === "track" && <TrackPage setActiveTab={setActiveTab} />}
        {activeTab === "admin" && <AdminPage setActiveTab={setActiveTab} />}
        {activeTab === "activity" && <ActivityPage setActiveTab={setActiveTab} />}
        {activeTab === "settings" && <SettingsPage setActiveTab={setActiveTab} />}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <ComplaintProvider>
      <AppContent />
    </ComplaintProvider>
  );
}
