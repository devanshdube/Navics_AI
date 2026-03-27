import React, { useState } from "react";
import DashboardAnalytics from "./DashboardAnalytics";
import DashboardTwitter from "./DashboardTwitter";
import YoutubeAnalytics from "./YoutubeAnalytics";

export default function SocialMedia() {
  const [activeTab, setActiveTab] = useState("facebook");

  const tabs = [
    { id: "facebook", label: "Facebook", color: "#1877F2" },
    { id: "instagram", label: "Instagram", color: "#C13584" },
    { id: "youtube", label: "YouTube", color: "#FF0000" },
    { id: "twitter", label: "Twitter", color: "#000000" },
    // { id: "performance", label: "Performance", color: "#FFC107" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "facebook":
        return <div>📘 Facebook Data</div>;
      case "instagram":
        return <div>📸 Instagram Data</div>;
      case "youtube":
        return <YoutubeAnalytics />;
      case "twitter":
        return <DashboardTwitter />;
      // case "performance":
      //   return <DashboardAnalytics />;
      default:
        return <div>Select Tab</div>;
    }
  };

  return (
    <div className="w-full h-full bg-gray-100 p-6">
      
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-md`}
            style={{
              backgroundColor:
                activeTab === tab.id ? tab.color : "#e5e7eb",
              color: activeTab === tab.id ? "#fff" : "#000",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow p-6 min-h-[400px]">
        {renderContent()}
      </div>
    </div>
  );
}