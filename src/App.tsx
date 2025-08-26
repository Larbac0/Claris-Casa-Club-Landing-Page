import { useState, useEffect } from "react";
import { HeroSection } from "./components/HeroSection";
import { WhyClaris } from "./components/WhyClaris";
import { VisualTour } from "./components/VisualTour";
import { ExclusiveServices } from "./components/ExclusiveServices";
import { ExcellenceSection } from "./components/ExcellenceSection";
import { StrategicLocation } from "./components/StrategicLocation";
import { TargetAudience } from "./components/TargetAudience";
import { FinalCTA } from "./components/FinalCTA";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { AdminDashboard } from "./components/AdminDashboard";
import { Analytics } from "@vercel/analytics/next"


export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  // Check URL for admin access
  useEffect(() => {
    const urlParams = new URLSearchParams(
      window.location.search,
    );
    if (urlParams.get("admin") === "claris2024") {
      setShowAdmin(true);
    }
  }, []);

  // Admin Dashboard View
  if (showAdmin) {
    return <AdminDashboard />;
  }

  // Main Landing Page
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <WhyClaris />
      <VisualTour />
      <ExclusiveServices />
      <ExcellenceSection />
      <StrategicLocation />
      <TargetAudience />
      <FinalCTA />
      <WhatsAppButton />
      <Analytics />

      {/* Hidden admin access link */}
      <div className="fixed bottom-0 left-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => setShowAdmin(true)}
          className="text-xs text-gray-400 p-2"
        >
          Admin
        </button>
      </div>
    </div>
  );
}