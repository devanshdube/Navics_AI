import React, { useState, useEffect } from "react";
import Filters from "./chart/Filters";
import RevenueRegion from "./chart/RevenueRegion";
import RevenueTrend from "./chart/RevenueTrend";
import RevenueCountry from "./chart/RevenueCountry";
import TargetVsRevenue from "./chart/TargetVsRevenue";
import GeoAnalytics from "./chart/GeoAnalytics";
import GeoCouAnalytics from "./chart/GeoCouAnalytics";
import DashboardStats from "./chart/DashboardStats";

export default function DashboardAnalytics() {
    const [filters, setFilters] = useState({});

    const [chatOpen, setChatOpen] = useState(false);
    const [chatMode, setChatMode] = useState("panel");
    const [formOpen, setFormOpen] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState([]);

    const WEBHOOK_URL =
        "https://n8n.navics.info/webhook/56ef24f7-5fbe-42c3-add8-dfb4dce257b7/chat";

    const getChatId = () => {
        let id = sessionStorage.getItem("chatId");
        if (!id) {
            id = "chat_" + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem("chatId", id);
        }
        return id;
    };

    const renderMarkdown = (text) => {
        if (!text) return "";
        text = text.replace(
            /!\[.*?\]\((.*?)\)/g,
            `<img src="$1" style="max-width:100%;margin-top:10px;border-radius:6px;">`
        );
        return text.replace(/\n/g, "<br>");
    };

    const handleSend = async () => {
        if (!chatInput.trim()) return;
        const userMsg = { type: "user", text: chatInput };
        setMessages((prev) => [...prev, userMsg]);
        try {
            const res = await fetch(WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chatId: getChatId(), chatInput }),
            });
            const data = await res.json();
            const text = data.response || data.output || data.text || "No response";
            setMessages((prev) => [...prev, { type: "bot", text }]);
        } catch (err) {
            console.error(err);
        }
        setChatInput("");
    };

    useEffect(() => {
        const el = document.getElementById("chat-body");
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages]);

    useEffect(() => {
        if (chatOpen) {
            setTimeout(() => document.querySelector("input")?.focus(), 100);
        }
    }, [chatOpen]);

    return (
        <div className="relative p-3 sm:p-4 md:p-6">
            {/* Filters */}
            <Filters filters={filters} setFilters={setFilters} />

            {/* Dashboard Stats */}
            <DashboardStats filters={filters} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <RevenueRegion filters={filters} />
                <RevenueTrend filters={filters} />
                <RevenueCountry filters={filters} />
                <TargetVsRevenue filters={filters} />
                <div className="col-span-1 sm:col-span-2">
                    <GeoAnalytics filters={filters} />
                </div>
            </div>

            {/* Form Panel (Full Screen Overlay) */}
            {formOpen && (
                <div className="fixed inset-0 bg-white z-40">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h3 className="font-semibold">Data Analysis Form</h3>
                        <button
                            onClick={() => setFormOpen(false)}
                            className="text-red-500 font-bold text-lg"
                        >
                            ✕
                        </button>
                    </div>
                    <iframe
                        src="/form.html"
                        className="w-full h-[calc(100%-64px)] border-none"
                        title="Form"
                    />
                </div>
            )}

            {/* Chatbot Panel */}
            {chatOpen && (
                <div
                    className={`fixed bg-white shadow-2xl z-30 border-l
          ${chatMode === "panel"
                            ? "right-0 top-[64px] h-[calc(100%-64px)] w-[400px]"
                            : "left-0 top-0 w-full h-full"
                        }`}
                >
                    <div className="flex items-center justify-between p-4 border-b">
                        <h3 className="font-semibold">AI Assistant</h3>
                        <button
                            onClick={() => setChatOpen(false)}
                            className="text-red-500 font-bold"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="p-4 flex flex-col h-[calc(100%-64px)]">
                        <div id="chat-body" className="flex-1 overflow-y-auto space-y-2 mb-3">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`p-2 rounded ${msg.type === "user"
                                        ? "bg-gray-100"
                                        : "bg-[#ffe5e0] text-[#fe634e]"
                                        }`}
                                    dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }}
                                />
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Type your message..."
                                className="flex-1 border p-2 rounded"
                            />
                            <button
                                onClick={handleSend}
                                className="bg-[#fe634e] text-white px-4 rounded"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Form Icon */}
            <div className="fixed right-6 top-[45%] z-40">
                <button
                    onClick={() => { setChatOpen(false); setFormOpen(true); }}
                    className="w-14 h-14 rounded-full bg-[#2bc155] text-white flex items-center justify-center shadow-lg hover:scale-110 transition"
                >
                    📄
                </button>
            </div>

            {/* Floating Chatbot Icon */}
            <div className="fixed right-6 top-[55%] z-40">
                <button
                    onClick={() => { setFormOpen(false); setChatMode("panel"); setChatOpen(true); }}
                    onDoubleClick={() => { setFormOpen(false); setChatMode("full"); setChatOpen(true); }}
                    className="w-14 h-14 rounded-full bg-[#fe634e] text-white flex items-center justify-center shadow-lg hover:scale-110 transition"
                >
                    💬
                </button>
            </div>
        </div>
    );
}