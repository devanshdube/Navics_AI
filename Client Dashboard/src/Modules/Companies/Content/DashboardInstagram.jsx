import React, { useState } from "react";
import CommentsTrendChart from "./instagramChart/CommentsTrendChart";
import AvgLikesChart from "./instagramChart/AvgLikesChart";
import PostTypeChart from "./instagramChart/PostTypeChart";
import LikesChart from "./instagramChart/LikesChart";
import SummaryBoxes from "./instagramChart/SummaryBoxes";
import Filters from "./instagramChart/Filters";
import { Instagram } from "lucide-react";

export default function DashboardInstagram() {
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: ""
    });

    const [instagramChatOpen, setInstagramChatOpen] = useState(false);

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Filters */}
            <Filters filters={filters} setFilters={setFilters} />

            {/* KPI */}
            <SummaryBoxes filters={filters} />

            {/* Charts - 2x2 grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LikesChart filters={filters} />
                <PostTypeChart filters={filters} />
                <AvgLikesChart filters={filters} />
                <CommentsTrendChart filters={filters} />
            </div>

            {/* Instagram Chat Panel (Full Screen Overlay) */}
            {instagramChatOpen && (
                <div className="fixed inset-0 bg-white z-40">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h3 className="font-semibold">Instagram AI Chat</h3>
                        <button
                            onClick={() => setInstagramChatOpen(false)}
                            className="text-red-500 font-bold text-lg"
                        >
                            ✕
                        </button>
                    </div>
                    <iframe
                        src="/instagram-chat.html"
                        className="w-full h-[calc(100%-64px)] border-none"
                        title="Instagram Chat"
                    />
                </div>
            )}

            {/* Floating Instagram Chatbot Icon */}
            <div className="fixed right-6 top-[69%] -translate-y-1/2 z-40">
                <button
                    onClick={() => setInstagramChatOpen(true)}
                    className="w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg hover:scale-110 transition text-2xl"
                    style={{
                        background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)"
                    }}
                >
                    <Instagram size={28} />
                </button>
            </div>
        </div>
    );
}