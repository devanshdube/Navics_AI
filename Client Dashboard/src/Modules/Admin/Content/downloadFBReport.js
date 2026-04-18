import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import html2canvas from "html2canvas";

const BASE = "http://localhost:5555/auth/navics/auth";

// ─────────────────────────────────────────────
// Capture a DOM element by id → Canvas
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
// Fetch all 4 Facebook chart datasets in parallel
// ─────────────────────────────────────────────
const fetchAllFBData = async (filters) => {
  const params = filters || {};
  const [topPosts, engagement, postsOverTime, pageComparison] =
    await Promise.all([
      axios.get(`${BASE}/getTopPosts`, { params }).then((r) => r.data),
      axios.get(`${BASE}/getEngagement`, { params }).then((r) => r.data),
      axios.get(`${BASE}/getPostsOverTime`, { params }).then((r) => r.data),
      axios.get(`${BASE}/getPageComparison`, { params }).then((r) => r.data),
    ]);
  return { topPosts, engagement, postsOverTime, pageComparison };
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const fmt = (val) => {
  const n = Number(val);
  if (isNaN(n)) return val ?? "-";
  return n.toLocaleString("en-IN");
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
export const downloadFBPDF = async (filters) => {
  // 1️⃣ Capture charts (DOM must be visible)
  const [canvasTopPosts, canvasEngagement, canvasPostsOverTime, canvasPageComp] =
    await Promise.all([
      captureChart("fb-chart-top-posts"),
      captureChart("fb-chart-engagement"),
      captureChart("fb-chart-posts-over-time"),
      captureChart("fb-chart-page-comparison"),
    ]);

  // 2️⃣ Fetch data
  let data;
  try {
    data = await fetchAllFBData(filters);
  } catch (err) {
    console.error("FB data fetch failed:", err);
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
  doc.setTextColor("#1877F2"); // Facebook blue
  doc.setFont("helvetica", "bold");
  doc.text("Facebook Analytics Report", pageW / 2, y, { align: "center" });
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

  // ── Table style (Facebook blue theme) ──
  const tableStyle = {
    headStyles: { fillColor: [24, 119, 242], textColor: 255, fontStyle: "bold", fontSize: 10 },
    alternateRowStyles: { fillColor: [235, 245, 255] },
    styles: { fontSize: 9, cellPadding: 5 },
    margin: { left: margin, right: margin },
  };

  // ── Helper: section = title + table + chart image ──
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
      const imgH = Math.min((canvas.height / canvas.width) * contentW, 260);

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

  // ── 1. Top Posts (Bar) ──
  addSection(
    "1. Top Posts by Likes",
    ["Post Label", "Likes", "Comments", "Shares"],
    data.topPosts.map((r) => [
      r.label ?? r.fullcontent?.slice(0, 40) ?? "-",
      fmt(r.likes),
      fmt(r.comments),
      fmt(r.shares),
    ]),
    canvasTopPosts
  );

  // ── 2. Engagement Breakdown (Pie) ──
  addSection(
    "2. Engagement Breakdown",
    ["Metric", "Value"],
    data.engagement.map((r) => [r.name ?? "-", fmt(r.value)]),
    canvasEngagement
  );

  // ── 3. Posts Over Time (Line) ──
  addSection(
    "3. Posts Over Time",
    ["Month", "Total Posts"],
    data.postsOverTime.map((r) => [r.month ?? "-", fmt(r.total_posts)]),
    canvasPostsOverTime
  );

  // ── 4. Page Comparison (Bar) ──
  addSection(
    "4. Page Comparison",
    ["Page Name", "Avg Likes", "Avg Comments", "Avg Shares"],
    data.pageComparison.map((r) => [
      r.page_name ?? "-",
      fmt(r.avg_likes),
      fmt(r.avg_comments),
      fmt(r.avg_shares),
    ]),
    canvasPageComp
  );

  // ── Footer on every page ──
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(190, 190, 190);
    doc.text(
      `Page ${i} of ${totalPages}  |  Navics Facebook Analytics`,
      pageW / 2,
      pageH - 15,
      { align: "center" }
    );
  }

  doc.save(`Facebook_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
};

// ══════════════════════════════════════════════
// 📊 EXCEL DOWNLOAD
// ══════════════════════════════════════════════
export const downloadFBExcel = async (filters) => {
  // 1️⃣ Capture charts
  const [canvasTopPosts, canvasEngagement, canvasPostsOverTime, canvasPageComp] =
    await Promise.all([
      captureChart("fb-chart-top-posts"),
      captureChart("fb-chart-engagement"),
      captureChart("fb-chart-posts-over-time"),
      captureChart("fb-chart-page-comparison"),
    ]);

  // 2️⃣ Fetch data
  let data;
  try {
    data = await fetchAllFBData(filters);
  } catch (err) {
    console.error("FB data fetch failed:", err);
    alert("Data fetch failed. Please check your server.");
    return;
  }

  // 3️⃣ Build workbook
  const wb = new ExcelJS.Workbook();
  wb.creator = "Navics Facebook Analytics";
  wb.created = new Date();

  // Facebook blue theme for headers
  const headerFill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1877F2" } };
  const headerFont = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
  const altFill    = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEBF5FF" } };
  const whiteFill  = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } };
  const cellBorder = {
    top:    { style: "thin", color: { argb: "FFB8D9F8" } },
    left:   { style: "thin", color: { argb: "FFB8D9F8" } },
    bottom: { style: "thin", color: { argb: "FFB8D9F8" } },
    right:  { style: "thin", color: { argb: "FFB8D9F8" } },
  };

  const buildSheet = async (name, headers, rows, canvas) => {
    const ws = wb.addWorksheet(name);

    // Filter info
    const fRow = ws.addRow([`Filters: ${filterLabel(filters)}`]);
    fRow.getCell(1).font = { italic: true, color: { argb: "FF888888" }, size: 9 };
    ws.mergeCells(fRow.number, 1, fRow.number, headers.length);
    ws.addRow([]); // spacer

    // Header row
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

    // Chart image below table
    if (canvas) {
      const buf = canvasToBuffer(canvas);
      if (buf) {
        const imageId = wb.addImage({ buffer: buf, extension: "png" });
        const tableEndRow = ws.rowCount + 2;
        ws.addImage(imageId, {
          tl: { col: 0, row: tableEndRow },
          ext: { width: 620, height: 320 },
        });
        for (let i = 0; i < 22; i++) ws.addRow([]);
      }
    }
  };

  await buildSheet(
    "Top Posts",
    ["Post Label", "Likes", "Comments", "Shares"],
    data.topPosts.map((r) => [
      r.label ?? r.fullcontent?.slice(0, 40) ?? "-",
      fmt(r.likes),
      fmt(r.comments),
      fmt(r.shares),
    ]),
    canvasTopPosts
  );

  await buildSheet(
    "Engagement Breakdown",
    ["Metric", "Value"],
    data.engagement.map((r) => [r.name ?? "-", fmt(r.value)]),
    canvasEngagement
  );

  await buildSheet(
    "Posts Over Time",
    ["Month", "Total Posts"],
    data.postsOverTime.map((r) => [r.month ?? "-", fmt(r.total_posts)]),
    canvasPostsOverTime
  );

  await buildSheet(
    "Page Comparison",
    ["Page Name", "Avg Likes", "Avg Comments", "Avg Shares"],
    data.pageComparison.map((r) => [
      r.page_name ?? "-",
      fmt(r.avg_likes),
      fmt(r.avg_comments),
      fmt(r.avg_shares),
    ]),
    canvasPageComp
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
  a.download = `Facebook_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
};
