import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import html2canvas from "html2canvas";

const BASE = "http://localhost:5555/auth/navics/auth";

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
// Fetch all 4 Instagram chart datasets in parallel
// Note: AvgLikesChart has no filters (static API)
// ─────────────────────────────────────────────
const fetchAllIGData = async (filters) => {
  const params = filters || {};
  const [likes, postType, avgLikes, commentsTrend] = await Promise.all([
    axios.get(`${BASE}/getLikesOverTime`, { params }).then((r) => r.data),
    axios.get(`${BASE}/getPostTypeBreakdown`, { params }).then((r) => r.data),
    axios.get(`${BASE}/getAvgLikesByType`).then((r) => r.data),           // no filter
    axios.get(`${BASE}/getCommentsTrend`, { params }).then((r) => r.data),
  ]);
  return { likes, postType, avgLikes, commentsTrend };
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const fmt = (val) => {
  const n = Number(val);
  if (isNaN(n)) return val ?? "-";
  return n.toLocaleString("en-IN");
};

const fmtDate = (d) => (d ? d.split("T")[0] : "-");

const filterLabel = (filters) => {
  if (!filters || !Object.keys(filters).length) return "All Data (No Filters)";
  return Object.entries(filters)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}: ${v}`)
    .join(" | ");
};

// Instagram gradient → use a solid color for PDF/Excel since gradients aren't supported
const IG_COLOR = "#E1306C"; // Instagram pink-red

// ══════════════════════════════════════════════
// 📄 PDF DOWNLOAD
// ══════════════════════════════════════════════
export const downloadIGPDF = async (filters) => {
  // 1️⃣ Capture charts first
  const [canvasLikes, canvasPostType, canvasAvgLikes, canvasComments] =
    await Promise.all([
      captureChart("ig-chart-likes"),
      captureChart("ig-chart-post-type"),
      captureChart("ig-chart-avg-likes"),
      captureChart("ig-chart-comments-trend"),
    ]);

  // 2️⃣ Fetch data
  let data;
  try {
    data = await fetchAllIGData(filters);
  } catch (err) {
    console.error("IG data fetch failed:", err);
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
  doc.setTextColor(IG_COLOR);
  doc.setFont("helvetica", "bold");
  doc.text("Instagram Analytics Report", pageW / 2, y, { align: "center" });
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

  // ── Table style (Instagram pink theme) ──
  const tableStyle = {
    headStyles: { fillColor: [225, 48, 108], textColor: 255, fontStyle: "bold", fontSize: 10 },
    alternateRowStyles: { fillColor: [255, 240, 246] },
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

  // ── 1. Likes Over Time (Bar) ──
  addSection(
    "1. Likes Over Time",
    ["Date", "Likes"],
    data.likes.map((r) => [fmtDate(r.timestamp), fmt(r.likes)]),
    canvasLikes
  );

  // ── 2. Post Type Breakdown (Pie) ──
  addSection(
    "2. Post Type Breakdown",
    ["Post Type", "Count"],
    data.postType.map((r) => [r.type ?? "-", fmt(r.count)]),
    canvasPostType
  );

  // ── 3. Avg Likes by Type (Bar) ──
  addSection(
    "3. Average Likes by Post Type",
    ["Post Type", "Avg Likes"],
    data.avgLikes.map((r) => [r.type ?? "-", fmt(r.avgLikes)]),
    canvasAvgLikes
  );

  // ── 4. Comments Trend (Line) ──
  addSection(
    "4. Comments Trend Over Time",
    ["Date", "Comments"],
    data.commentsTrend.map((r) => [fmtDate(r.timestamp), fmt(r.comments)]),
    canvasComments
  );

  // ── Footer ──
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(190, 190, 190);
    doc.text(
      `Page ${i} of ${totalPages}  |  Navics Instagram Analytics`,
      pageW / 2,
      pageH - 15,
      { align: "center" }
    );
  }

  doc.save(`Instagram_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
};

// ══════════════════════════════════════════════
// 📊 EXCEL DOWNLOAD
// ══════════════════════════════════════════════
export const downloadIGExcel = async (filters) => {
  // 1️⃣ Capture charts
  const [canvasLikes, canvasPostType, canvasAvgLikes, canvasComments] =
    await Promise.all([
      captureChart("ig-chart-likes"),
      captureChart("ig-chart-post-type"),
      captureChart("ig-chart-avg-likes"),
      captureChart("ig-chart-comments-trend"),
    ]);

  // 2️⃣ Fetch data
  let data;
  try {
    data = await fetchAllIGData(filters);
  } catch (err) {
    console.error("IG data fetch failed:", err);
    alert("Data fetch failed. Please check your server.");
    return;
  }

  // 3️⃣ Build workbook
  const wb = new ExcelJS.Workbook();
  wb.creator = "Navics Instagram Analytics";
  wb.created = new Date();

  // Instagram pink theme
  const headerFill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE1306C" } };
  const headerFont = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
  const altFill    = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF0F6" } };
  const whiteFill  = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } };
  const cellBorder = {
    top:    { style: "thin", color: { argb: "FFFFC0D9" } },
    left:   { style: "thin", color: { argb: "FFFFC0D9" } },
    bottom: { style: "thin", color: { argb: "FFFFC0D9" } },
    right:  { style: "thin", color: { argb: "FFFFC0D9" } },
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
          ext: { width: 620, height: 320 },
        });
        for (let i = 0; i < 22; i++) ws.addRow([]);
      }
    }
  };

  await buildSheet(
    "Likes Over Time",
    ["Date", "Likes"],
    data.likes.map((r) => [fmtDate(r.timestamp), fmt(r.likes)]),
    canvasLikes
  );

  await buildSheet(
    "Post Type Breakdown",
    ["Post Type", "Count"],
    data.postType.map((r) => [r.type ?? "-", fmt(r.count)]),
    canvasPostType
  );

  await buildSheet(
    "Avg Likes by Type",
    ["Post Type", "Avg Likes"],
    data.avgLikes.map((r) => [r.type ?? "-", fmt(r.avgLikes)]),
    canvasAvgLikes
  );

  await buildSheet(
    "Comments Trend",
    ["Date", "Comments"],
    data.commentsTrend.map((r) => [fmtDate(r.timestamp), fmt(r.comments)]),
    canvasComments
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
  a.download = `Instagram_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
};
