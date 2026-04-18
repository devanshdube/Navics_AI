import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import html2canvas from "html2canvas";

const BASE = "http://localhost:5555/auth/navics/auth";
const TW_COLOR = "#1DA1F2"; // Twitter blue

// ─────────────────────────────────────────────
// Capture DOM element by id → Canvas
// ─────────────────────────────────────────────
const captureChart = async (id) => {
  const el = document.getElementById(id);
  if (!el) return null;
  return html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });
};

const canvasToDataUrl = (canvas) => canvas?.toDataURL("image/png") ?? null;

const canvasToBuffer = (canvas) => {
  if (!canvas) return null;
  const base64 = canvas.toDataURL("image/png").split(",")[1];
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
};

// ─────────────────────────────────────────────
// Fetch data
// Note: getTweetAnalytics is shared by 3 charts,
//       getChart is separate for Daily Engagement Trend
// ─────────────────────────────────────────────
const fetchAllTWData = async (filters) => {
  const params = filters || {};
  const [tweetAnalytics, chartData] = await Promise.all([
    axios.get(`${BASE}/getTweetAnalytics`, { params }).then((r) => r.data.data ?? []),
    axios.get(`${BASE}/getChart`, { params }).then((r) => r.data.data ?? []),
  ]);
  return { tweetAnalytics, chartData };
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const fmt = (val) => {
  const n = Number(val);
  if (isNaN(n)) return val ?? "-";
  return n.toLocaleString("en-IN");
};

const fmtDate = (val) => {
  if (!val) return "-";
  try {
    return new Date(val).toLocaleDateString("en-IN");
  } catch {
    return String(val);
  }
};

const filterLabel = (filters) => {
  if (!filters || !Object.keys(filters).length) return "All Data (No Filters)";
  return Object.entries(filters)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}: ${v}`)
    .join(" | ");
};

// ══════════════════════════════════════════════
// 📄 PDF DOWNLOAD
// ══════════════════════════════════════════════
export const downloadTWPDF = async (filters) => {
  // 1️⃣ Capture charts
  const [canvasLikes, canvasEngagement, canvasBubble, canvasTrend] =
    await Promise.all([
      captureChart("tw-chart-likes"),
      captureChart("tw-chart-engagement"),
      captureChart("tw-chart-views-bubble"),
      captureChart("tw-chart-daily-trend"),
    ]);

  // 2️⃣ Fetch data
  let data;
  try {
    data = await fetchAllTWData(filters);
  } catch (err) {
    console.error("Twitter data fetch failed:", err);
    alert("Data fetch failed. Please check your server.");
    return;
  }

  // 3️⃣ Build PDF
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 30;
  const contentW = pageW - margin * 2;
  let y = 40;

  // ── Header ──
  doc.setFontSize(18);
  doc.setTextColor(TW_COLOR);
  doc.setFont("helvetica", "bold");
  doc.text("Twitter / X Analytics Report", pageW / 2, y, { align: "center" });
  y += 22;

  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.setFont("helvetica", "normal");
  doc.text(`Applied Filters: ${filterLabel(filters)}`, pageW / 2, y, { align: "center" });
  y += 14;

  doc.setFontSize(8);
  doc.setTextColor(160, 160, 160);
  doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, pageW / 2, y, { align: "center" });
  y += 14;

  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageW - margin, y);
  y += 18;

  // ── Table style (Twitter blue theme) ──
  const tableStyle = {
    headStyles: { fillColor: [29, 161, 242], textColor: 255, fontStyle: "bold", fontSize: 10 },
    alternateRowStyles: { fillColor: [235, 248, 255] },
    styles: { fontSize: 9, cellPadding: 5 },
    margin: { left: margin, right: margin },
  };

  // ── Helper: section = title + table + chart ──
  const addSection = (title, head, body, canvas) => {
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin, y);
    y += 10;

    autoTable(doc, { startY: y, head: [head], body, ...tableStyle });
    y = doc.lastAutoTable.finalY + 14;

    if (canvas) {
      const imgData = canvasToDataUrl(canvas);
      const imgH = Math.min((canvas.height / canvas.width) * contentW, 270);

      if (y + imgH + 20 > pageH - 40) {
        doc.addPage();
        y = 40;
      }

      doc.addImage(imgData, "PNG", margin, y, contentW, imgH);
      y += imgH + 24;
    }

    if (y > pageH - 80) {
      doc.addPage();
      y = 40;
    }
  };

  // ── 1. Tweet vs Likes (Bar) ──
  addSection(
    "1. Tweet vs Likes",
    ["Tweet ID", "Likes"],
    data.tweetAnalytics.map((r) => [r.tweet_id ?? "-", fmt(r.likes)]),
    canvasLikes
  );

  // ── 2. Retweet vs Replies (Grouped Bar) ──
  addSection(
    "2. Retweet vs Replies",
    ["Tweet ID", "Retweets", "Replies"],
    data.tweetAnalytics.map((r) => [r.tweet_id ?? "-", fmt(r.retweet), fmt(r.replies)]),
    canvasEngagement
  );

  // ── 3. Tweet Views Bubble (Scatter → table: date + views) ──
  addSection(
    "3. Tweet Views",
    ["Tweet ID", "Date", "Views"],
    data.tweetAnalytics.map((r) => [
      r.tweet_id ?? "-",
      fmtDate(r.tweet_date),
      fmt(r.views),
    ]),
    canvasBubble
  );

  // ── 4. Daily Engagement Trend (Line) ──
  addSection(
    "4. Daily Engagement Trend",
    ["Date", "Likes", "Views", "Retweets"],
    data.chartData.map((r) => [
      fmtDate(r.date),
      fmt(r.likes),
      fmt(r.views),
      fmt(r.retweet),
    ]),
    canvasTrend
  );

  // ── Footer ──
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(190, 190, 190);
    doc.text(
      `Page ${i} of ${totalPages}  |  Navics Twitter Analytics`,
      pageW / 2,
      pageH - 15,
      { align: "center" }
    );
  }

  doc.save(`Twitter_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
};

// ══════════════════════════════════════════════
// 📊 EXCEL DOWNLOAD
// ══════════════════════════════════════════════
export const downloadTWExcel = async (filters) => {
  // 1️⃣ Capture charts
  const [canvasLikes, canvasEngagement, canvasBubble, canvasTrend] =
    await Promise.all([
      captureChart("tw-chart-likes"),
      captureChart("tw-chart-engagement"),
      captureChart("tw-chart-views-bubble"),
      captureChart("tw-chart-daily-trend"),
    ]);

  // 2️⃣ Fetch data
  let data;
  try {
    data = await fetchAllTWData(filters);
  } catch (err) {
    console.error("Twitter data fetch failed:", err);
    alert("Data fetch failed. Please check your server.");
    return;
  }

  // 3️⃣ Build workbook
  const wb = new ExcelJS.Workbook();
  wb.creator = "Navics Twitter Analytics";
  wb.created = new Date();

  // Twitter blue theme
  const headerFill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1DA1F2" } };
  const headerFont = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
  const altFill    = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEBF8FF" } };
  const whiteFill  = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } };
  const cellBorder = {
    top:    { style: "thin", color: { argb: "FFB3E5FC" } },
    left:   { style: "thin", color: { argb: "FFB3E5FC" } },
    bottom: { style: "thin", color: { argb: "FFB3E5FC" } },
    right:  { style: "thin", color: { argb: "FFB3E5FC" } },
  };

  const buildSheet = async (name, headers, rows, canvas) => {
    const ws = wb.addWorksheet(name);

    // Filter info
    const fRow = ws.addRow([`Filters: ${filterLabel(filters)}`]);
    fRow.getCell(1).font = { italic: true, color: { argb: "FF888888" }, size: 9 };
    ws.mergeCells(fRow.number, 1, fRow.number, headers.length);
    ws.addRow([]); // spacer

    // Header
    const hRow = ws.addRow(headers);
    hRow.height = 22;
    hRow.eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = cellBorder;
    });

    // Data rows
    rows.forEach((rowData, i) => {
      const row = ws.addRow(rowData);
      row.height = 18;
      row.eachCell((cell) => {
        cell.fill = i % 2 === 0 ? whiteFill : altFill;
        cell.border = cellBorder;
        cell.alignment = { vertical: "middle" };
      });
    });

    ws.columns.forEach((col) => { col.width = 22; });

    // Chart image
    if (canvas) {
      const buf = canvasToBuffer(canvas);
      if (buf) {
        const imageId = wb.addImage({ buffer: buf, extension: "png" });
        const tableEndRow = ws.rowCount + 2;
        ws.addImage(imageId, {
          tl: { col: 0, row: tableEndRow },
          ext: { width: 620, height: 340 },
        });
        for (let i = 0; i < 24; i++) ws.addRow([]);
      }
    }
  };

  await buildSheet(
    "Tweet vs Likes",
    ["Tweet ID", "Likes"],
    data.tweetAnalytics.map((r) => [r.tweet_id ?? "-", fmt(r.likes)]),
    canvasLikes
  );

  await buildSheet(
    "Retweet vs Replies",
    ["Tweet ID", "Retweets", "Replies"],
    data.tweetAnalytics.map((r) => [r.tweet_id ?? "-", fmt(r.retweet), fmt(r.replies)]),
    canvasEngagement
  );

  await buildSheet(
    "Tweet Views",
    ["Tweet ID", "Date", "Views"],
    data.tweetAnalytics.map((r) => [
      r.tweet_id ?? "-",
      fmtDate(r.tweet_date),
      fmt(r.views),
    ]),
    canvasBubble
  );

  await buildSheet(
    "Daily Engagement Trend",
    ["Date", "Likes", "Views", "Retweets"],
    data.chartData.map((r) => [
      fmtDate(r.date),
      fmt(r.likes),
      fmt(r.views),
      fmt(r.retweet),
    ]),
    canvasTrend
  );

  // 4️⃣ Trigger download
  const buffer = await wb.xlsx.writeBuffer();
  const url = URL.createObjectURL(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `Twitter_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
};
