import React, { useState } from "react";
import Filters from "./chart/Filters";
import RevenueRegion from "./chart/RevenueRegion";
import RevenueTrend from "./chart/RevenueTrend";
import RevenueCountry from "./chart/RevenueCountry";
import TargetVsRevenue from "./chart/TargetVsRevenue";
import GeoAnalytics from "./chart/GeoAnalytics";
import GeoCouAnalytics from "./chart/GeoCouAnalytics";
import DashboardStats from "./chart/DashboardStats";
import ChatbotPanel from "./ChatbotPanel";
import { downloadPDF, downloadExcel } from "./downloadReport";

export default function DashboardAnalytics() {
  const [filters, setFilters] = useState({});

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMode, setChatMode] = useState("panel");
  const [formOpen, setFormOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    await downloadPDF(filters);
    setPdfLoading(false);
  };

  const handleDownloadExcel = async () => {
    setExcelLoading(true);
    await downloadExcel(filters);
    setExcelLoading(false);
  };

  return (
    <div className="relative p-3 sm:p-4 md:p-6">
      {/* Filters */}
      <Filters filters={filters} setFilters={setFilters} />

      {/* Download Buttons */}
      <div className="flex gap-3 justify-end mb-4 mt-2">
        <button
          onClick={handleDownloadPDF}
          disabled={pdfLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#fe634e] text-white text-sm font-semibold shadow hover:bg-[#e55540] active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pdfLoading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
          ) : (
            <span>📄</span>
          )}
          {pdfLoading ? "Generating..." : "Download PDF"}
        </button>

        <button
          onClick={handleDownloadExcel}
          disabled={excelLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2bc155] text-white text-sm font-semibold shadow hover:bg-[#24a348] active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {excelLoading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
          ) : (
            <span>📊</span>
          )}
          {excelLoading ? "Generating..." : "Download Excel"}
        </button>
      </div>

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
        <div className="fixed inset-0 bg-white z-[9999]">
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
      <ChatbotPanel
        chatOpen={chatOpen}
        setChatOpen={setChatOpen}
        chatMode={chatMode}
      />

      {/* Floating Form Icon */}
      <div className="fixed right-6 top-[45%] z-[9999]">
        <button
          onClick={() => { setChatOpen(false); setFormOpen(true); }}
          className="w-14 h-14 rounded-full bg-[#2bc155] text-white flex items-center justify-center shadow-lg hover:scale-110 transition"
        >
          📄
        </button>
      </div>

      {/* Floating Chatbot Icon */}
      <div className="fixed right-6 top-[55%] z-[9999]">
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