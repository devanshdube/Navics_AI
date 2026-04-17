import React, { useState } from "react";
import Filters from "./facebookChart/Filters";
import KPIStats from "./facebookChart/KPIStats";
import TopPostsChart from "./facebookChart/TopPostsChart";
import EngagementChart from "./facebookChart/EngagementChart";
import PostsOverTime from "./facebookChart/PostsOverTime";
import PageComparison from "./facebookChart/PageComparison";
import { Facebook } from "lucide-react";

export default function FacebookDashboard() {
    const [filters, setFilters] = useState({ page: "", sort: "likes" });
    const [facebookChatOpen, setFacebookChatOpen] = useState(false);

    return (
        <div className="p-3 sm:p-4 md:p-6">
            {/* Filters */}
            <Filters filters={filters} setFilters={setFilters} />

            {/* KPI Stats */}
            <KPIStats filters={filters} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <TopPostsChart filters={filters} />
                <EngagementChart filters={filters} />
                <PostsOverTime filters={filters} />
                <PageComparison filters={filters} />
            </div>

            {/* Facebook Chat Panel (Full Screen Overlay) */}
            {facebookChatOpen && (
                <div className="fixed inset-0 bg-white z-40">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h3 className="font-semibold">Facebook AI Chat</h3>
                        <button
                            onClick={() => setFacebookChatOpen(false)}
                            className="text-red-500 font-bold text-lg"
                        >
                            ✕
                        </button>
                    </div>
                    <iframe
                        src="/facebook-chat.html"
                        className="w-full h-[calc(100%-64px)] border-none"
                        title="Facebook Chat"
                    />
                </div>
            )}

            {/* Floating Facebook Chatbot Icon */}
            <div className="fixed right-6 top-[69%] -translate-y-1/2 z-40">
                <button
                    onClick={() => setFacebookChatOpen(true)}
                    className="w-14 h-14 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-lg hover:scale-110 transition text-2xl"
                >
                    <Facebook size={28} />
                </button>
            </div>
        </div>
    );
}