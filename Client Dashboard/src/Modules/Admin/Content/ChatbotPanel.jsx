import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
// import html2canvas from "html2canvas"; // Although imported, it's not strictly needed since only jsPDF/ExcelJS used in chatbot directly. Leaving here as in original.
import ExcelJS from "exceljs";

export default function ChatbotPanel({ chatOpen, setChatOpen, chatMode }) {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

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

    // 1. Markdown table → HTML table
    text = text.replace(
      /(\|.+\|\n\|[-| :]+\|\n)((\|.+\|\n?)+)/g,
      (match) => {
        const lines = match.trim().split("\n").filter(Boolean);
        const headers = lines[0].split("|").filter(s => s.trim());
        const rows = lines.slice(2).map(r =>
          r.split("|").filter(s => s.trim())
        );
        const thead = `<thead><tr>${headers.map(h =>
          `<th style="padding:8px 12px;text-align:left;
  background:#fe634e !important;
  color:#fff !important;
  font-size:13px;font-weight:600;">${h.trim()}</th>`
        ).join("")}</tr></thead>`;
        const tbody = `<tbody>${rows.map((row, i) =>
          `<tr style="background:${i % 2 === 0 ? "#fff" : "#fff5f3"}">${row.map(c =>
            `<td style="padding:7px 12px;font-size:13px;
           border-bottom:1px solid #ffe0da;">${c.trim()}</td>`
          ).join("")}</tr>`
        ).join("")}</tbody>`;
        return `<div style="overflow-x:auto;margin:8px 0">
        <table style="border-collapse:collapse;width:100%;
        border-radius:8px;overflow:hidden;
        border:1px solid #ffe0da;">
        ${thead}${tbody}</table></div>`;
      }
    );

    // 2. Image markdown
    text = text.replace(
      /!\[.*?\]\((.*?)\)/g,
      `<img src="$1" style="max-width:100%;margin-top:10px;
     border-radius:8px;border:1px solid #ffe0da;">`
    );

    // 3. Newlines
    return text.replace(/\n/g, "<br>");
  };

  const parseTable = (text) => {
    const match = text.match(/(\|.+\|\n\|[-| :]+\|\n)((\|.+\|\n?)+)/);
    if (!match) return null;
    const lines = match[0].trim().split("\n").filter(Boolean);
    return [lines[0], ...lines.slice(2)]
      .map(r => r.split("|").filter(s => s.trim()).map(s => s.trim()));
  };

  // Helper: extract chart image URL
  const getChartUrl = (text) => {
    const m = text.match(/!\[.*?\]\((.*?)\)/);
    return m ? m[1] : null;
  };

  // PDF download
  const downloadPDF = async (msg) => {
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    let y = 40;

    // Table
    const tableData = parseTable(msg.text);
    if (tableData) {
      pdf.setFontSize(11);
      tableData.forEach((row, ri) => {
        const isHeader = ri === 0;
        row.forEach((cell, ci) => {
          if (isHeader) {
            pdf.setFillColor(254, 99, 78);
            pdf.rect(ci * 120 + 20, y, 115, 20, "F");
            pdf.setTextColor(255, 255, 255);
          } else {
            pdf.setFillColor(ri % 2 === 0 ? 255 : 255, ri % 2 === 0 ? 245 : 243, ri % 2 === 0 ? 243 : 255);
            pdf.rect(ci * 120 + 20, y, 115, 18, "F");
            pdf.setTextColor(30, 30, 30);
          }
          pdf.text(cell, ci * 120 + 25, y + (isHeader ? 14 : 13));
        });
        y += isHeader ? 22 : 20;
      });
      y += 20;
    }

    // Chart image
    const chartUrl = getChartUrl(msg.text);
    if (chartUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = chartUrl;
      await new Promise(res => { img.onload = res; img.onerror = res; });
      const canvas = document.createElement("canvas");
      canvas.width = img.width; canvas.height = img.height;
      canvas.getContext("2d").drawImage(img, 0, 0);
      pdf.addImage(canvas.toDataURL(), "PNG", 20, y, 500, 280);
    }
    pdf.save("report.pdf");
  };

  // Excel download
  const downloadExcel = async (msg) => {
    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet("Report");

    // Table data add karo with styling
    const tableData = parseTable(msg.text);
    if (tableData) {
      tableData.forEach((row, i) => {
        const excelRow = ws.addRow(row);
        if (i === 0) {
          // Header row styling
          excelRow.eachCell(cell => {
            cell.fill = {
              type: "pattern", pattern: "solid",
              fgColor: { argb: "FFFE634E" }
            };
            cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
            cell.alignment = { vertical: "middle", horizontal: "center" };
          });
          excelRow.height = 22;
        } else {
          // Alternate row colors
          excelRow.eachCell(cell => {
            cell.fill = {
              type: "pattern", pattern: "solid",
              fgColor: { argb: i % 2 === 0 ? "FFFFFFFF" : "FFFFF5F3" }
            };
          });
        }
      });

      // Column width auto-fit
      ws.columns.forEach(col => { col.width = 18; });
    }

    // Chart image add karo
    const chartUrl = getChartUrl(msg.text);
    if (chartUrl) {
      try {
        const res = await fetch(chartUrl);
        const blob = await res.blob();
        const arrayBuf = await blob.arrayBuffer();

        const imageId = workbook.addImage({
          buffer: arrayBuf,
          extension: "png",
        });

        const tableRows = tableData ? tableData.length + 2 : 2;
        ws.addImage(imageId, {
          tl: { col: 0, row: tableRows },
          ext: { width: 620, height: 380 },
        });

        // Image ke liye rows reserve karo
        for (let i = 0; i < 22; i++) ws.addRow([]);
      } catch (err) {
        console.error("Chart fetch failed:", err);
      }
    }

    // Download trigger
    const buffer = await workbook.xlsx.writeBuffer();
    const url = URL.createObjectURL(new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }));
    const a = document.createElement("a");
    a.href = url; a.download = "report.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSend = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { type: "user", text: chatInput };
    const currentInput = chatInput;
    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: getChatId(), chatInput: currentInput }),
      });
      const data = await res.json();
      const text = data.response || data.output || data.text || "No response";
      setMessages((prev) => [...prev, { type: "bot", text }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    const el = document.getElementById("chat-body");
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  useEffect(() => {
    if (chatOpen) {
      setTimeout(() => document.querySelector("input")?.focus(), 100);
    }
  }, [chatOpen]);

  if (!chatOpen) return null;

  return (
    <div
      className={`fixed bg-white shadow-2xl z-[9999] border-l
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
            <div key={i}>
              <div
                className={`p-2 rounded ${msg.type === "user"
                  ? "bg-gray-100"
                  : "bg-[#ffe5e0] text-[#fe634e]"
                  }`}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }}
              />

              { /* Download buttons — sirf bot messages pe */}
              {msg.type === "bot" && (
                <div className="flex gap-2 mt-1 mb-2">
                  <button
                    onClick={() => downloadPDF(msg)}
                    className="text-xs px-3 py-1 rounded border
        border-[#fe634e] text-[#fe634e]
        hover:bg-[#fe634e] hover:text-white transition"
                  >
                    ⬇ PDF
                  </button>
                  <button
                    onClick={() => downloadExcel(msg)}
                    className="text-xs px-3 py-1 rounded border
        border-green-600 text-green-600
        hover:bg-green-600 hover:text-white transition"
                  >
                    ⬇ Excel
                  </button>
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-1 p-2 rounded bg-[#ffe5e0] w-14 mt-1">
              <div className="w-2 h-2 bg-[#fe634e] rounded-full typing-dot"></div>
              <div className="w-2 h-2 bg-[#fe634e] rounded-full typing-dot"></div>
              <div className="w-2 h-2 bg-[#fe634e] rounded-full typing-dot"></div>
            </div>
          )}
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
  );
}
