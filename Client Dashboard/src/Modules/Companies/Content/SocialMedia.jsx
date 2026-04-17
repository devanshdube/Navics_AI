import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardTwitter from "./DashboardTwitter";
import YoutubeAnalytics from "./YoutubeAnalytics";
import FacebookDashboard from "./FacebookDashboard";
import DashboardInstagram from "./DashboardInstagram";

export default function SocialMedia() {
    const { enabledFeatures = [] } = useSelector((state) => state.features);

    const [activeTab, setActiveTab] = useState("facebook");

    // 🔥 Dynamic Tabs based on features
    const tabs = [
        enabledFeatures.includes("facebook") && {
            id: "facebook",
            label: "Facebook",
            color: "#1877F2",
        },
        enabledFeatures.includes("instagram") && {
            id: "instagram",
            label: "Instagram",
            color: "#C13584",
        },
        enabledFeatures.includes("youtube") && {
            id: "youtube",
            label: "YouTube",
            color: "#FF0000",
        },
        enabledFeatures.includes("twitter") && {
            id: "twitter",
            label: "Twitter",
            color: "#000000",
        },
    ].filter(Boolean);

    // 🔥 Fix activeTab if disabled
    useEffect(() => {
        if (!enabledFeatures.includes(activeTab)) {
            setActiveTab(enabledFeatures[0] || "");
        }
    }, [enabledFeatures]);

    const renderContent = () => {
        switch (activeTab) {
            case "facebook":
                return <FacebookDashboard />;
            case "instagram":
                return <DashboardInstagram />;
            case "youtube":
                return <YoutubeAnalytics />;
            case "twitter":
                return <DashboardTwitter />;
            default:
                return <div>Select Tab</div>;
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-100 p-3 sm:p-4 md:p-6">

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="flex-1 sm:flex-none px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-xl font-semibold transition-all shadow-md text-sm sm:text-base whitespace-nowrap"
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
            <div className="bg-white rounded-xl shadow p-3 sm:p-4 md:p-6 min-h-[300px] sm:min-h-[350px] md:min-h-[400px] w-full overflow-x-auto">
                {renderContent()}
            </div>
        </div>
    );
}




// import React, { useState } from "react";
// import DashboardTwitter from "./DashboardTwitter";
// import YoutubeAnalytics from "./YoutubeAnalytics";
// import FacebookDashboard from "./FacebookDashboard";
// import DashboardInstagram from "./DashboardInstagram";

// export default function SocialMedia() {
//     const [activeTab, setActiveTab] = useState("facebook");

//     const tabs = [
//         { id: "facebook", label: "Facebook", color: "#1877F2" },
//         { id: "instagram", label: "Instagram", color: "#C13584" },
//         { id: "youtube", label: "YouTube", color: "#FF0000" },
//         { id: "twitter", label: "Twitter", color: "#000000" },
//     ];

//     const renderContent = () => {
//         switch (activeTab) {
//             case "facebook":
//                 return <FacebookDashboard />;
//             case "instagram":
//                 return <DashboardInstagram />;
//             case "youtube":
//                 return <YoutubeAnalytics />;
//             case "twitter":
//                 return <DashboardTwitter />;
//             default:
//                 return <div>Select Tab</div>;
//         }
//     };

//     return (
//         <div className="w-full min-h-screen bg-gray-100 p-3 sm:p-4 md:p-6">

//             {/* Tabs */}
//             <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
//                 {tabs.map((tab) => (
//                     <button
//                         key={tab.id}
//                         onClick={() => setActiveTab(tab.id)}
//                         className="flex-1 sm:flex-none px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-xl font-semibold transition-all shadow-md text-sm sm:text-base whitespace-nowrap"
//                         style={{
//                             backgroundColor: activeTab === tab.id ? tab.color : "#e5e7eb",
//                             color: activeTab === tab.id ? "#fff" : "#000",
//                         }}
//                     >
//                         {tab.label}
//                     </button>
//                 ))}
//             </div>

//             {/* Content Area */}
//             <div className="bg-white rounded-xl shadow p-3 sm:p-4 md:p-6 min-h-[300px] sm:min-h-[350px] md:min-h-[400px] w-full overflow-x-auto">
//                 {renderContent()}
//             </div>
//         </div>
//     );
// }