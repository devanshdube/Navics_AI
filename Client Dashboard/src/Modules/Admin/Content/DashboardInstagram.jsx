import React, { useState } from "react";
import CommentsTrendChart from "./instagramChart/CommentsTrendChart";
import AvgLikesChart from "./instagramChart/AvgLikesChart";
import PostTypeChart from "./instagramChart/PostTypeChart";
import LikesChart from "./instagramChart/LikesChart";
import SummaryBoxes from "./instagramChart/SummaryBoxes";
import Filters from "./instagramChart/Filters";
import { Instagram } from "lucide-react";
import { downloadIGPDF, downloadIGExcel } from "./downloadIGReport";

export default function DashboardInstagram() {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: ""
  });

  const [instagramChatOpen, setInstagramChatOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    await downloadIGPDF(filters);
    setPdfLoading(false);
  };

  const handleDownloadExcel = async () => {
    setExcelLoading(true);
    await downloadIGExcel(filters);
    setExcelLoading(false);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Filters */}
      <Filters filters={filters} setFilters={setFilters} />

      {/* Download Buttons */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={handleDownloadPDF}
          disabled={pdfLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold shadow active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}
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

// import React, { useState } from "react";
// import CommentsTrendChart from "./instagramChart/CommentsTrendChart";
// import AvgLikesChart from "./instagramChart/AvgLikesChart";
// import PostTypeChart from "./instagramChart/PostTypeChart";
// import LikesChart from "./instagramChart/LikesChart";
// import SummaryBoxes from "./instagramChart/SummaryBoxes";
// import Filters from "./instagramChart/Filters";

// export default function DashboardInstagram() {
//   const [filters, setFilters] = useState({
//     startDate: "",
//     endDate: ""
//   });

//   return (
//     <div className="p-4 md:p-6 space-y-6">
//       {/* Filters */}
//       <Filters filters={filters} setFilters={setFilters} />

//       {/* KPI */}
//       <SummaryBoxes filters={filters} />

//       {/* Charts - 2x2 grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <LikesChart filters={filters} />
//         <PostTypeChart filters={filters} />
//         <AvgLikesChart filters={filters} />
//         <CommentsTrendChart filters={filters} />
//       </div>
//     </div>
//   );
// }