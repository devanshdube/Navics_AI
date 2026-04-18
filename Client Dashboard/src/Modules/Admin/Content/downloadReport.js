import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import html2canvas from "html2canvas";

const BASE = "http://localhost:5555/auth/navics/auth";

// ─────────────────────────────────────────────
// Capture a DOM element by id → returns Canvas
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

// Canvas → PNG base64 data URL
const canvasToDataUrl = (canvas) => canvas?.toDataURL("image/png") ?? null;

// Canvas → Uint8Array buffer (for ExcelJS)
const canvasToBuffer = (canvas) => {
  if (!canvas) return null;
  const base64 = canvas.toDataURL("image/png").split(",")[1];
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
};

// ─────────────────────────────────────────────
// Fetch all 4 chart datasets in parallel
// ─────────────────────────────────────────────
const fetchAllData = async (filters) => {
  const params = filters || {};
  const [region, trend, country, target] = await Promise.all([
    axios.get(`${BASE}/getRevenueByRegion`, { params }).then((r) => r.data),
    axios.get(`${BASE}/getRevenueTrend`, { params }).then((r) => r.data),
    axios.get(`${BASE}/getRevenueByCountry`, { params }).then((r) => r.data),
    axios.get(`${BASE}/getTargetVsRevenueByRegion`, { params }).then((r) => r.data),
  ]);
  return { region, trend, country, target };
};

// ─────────────────────────────────────────────
// Formatting helpers
// ─────────────────────────────────────────────
const fmt = (val) => {
  const n = Number(val);
  if (isNaN(n)) return val ?? "-";
  if (n >= 10000000) return (n / 10000000).toFixed(2) + " Cr";
  if (n >= 100000) return (n / 100000).toFixed(2) + " L";
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

// ══════════════════════════════════════════════
// 📄 PDF DOWNLOAD  (table + chart image)
// ══════════════════════════════════════════════
export const downloadPDF = async (filters) => {
  // 1️⃣ Capture chart screenshots first (DOM is visible right now)
  const [canvasRegion, canvasTrend, canvasCountry, canvasTarget] =
    await Promise.all([
      captureChart("chart-revenue-region"),
      captureChart("chart-revenue-trend"),
      captureChart("chart-revenue-country"),
      captureChart("chart-target-vs-revenue"),
    ]);

  // 2️⃣ Fetch table data
  let data;
  try {
    data = await fetchAllData(filters);
  } catch (err) {
    console.error("Data fetch failed:", err);
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

  // ── Report header ──
  doc.setFontSize(18);
  doc.setTextColor("#FE634E");
  doc.setFont("helvetica", "bold");
  doc.text("Navics Analytics Report", pageW / 2, y, { align: "center" });
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

  // ── Shared table style ──
  const tableStyle = {
    headStyles: { fillColor: [254, 99, 78], textColor: 255, fontStyle: "bold", fontSize: 10 },
    alternateRowStyles: { fillColor: [255, 245, 243] },
    styles: { fontSize: 9, cellPadding: 5 },
    margin: { left: margin, right: margin },
  };

  // ── Helper: add one section (title + table + chart image) ──
  const addSection = (title, head, body, canvas) => {
    // Section title
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin, y);
    y += 10;

    // Table
    autoTable(doc, { startY: y, head: [head], body, ...tableStyle });
    y = doc.lastAutoTable.finalY + 14;

    // Chart image
    if (canvas) {
      const imgData = canvasToDataUrl(canvas);
      const imgH = (canvas.height / canvas.width) * contentW;
      const safeImgH = Math.min(imgH, 260); // max height cap

      // Page break if image won't fit
      if (y + safeImgH + 20 > pageH - 40) {
        doc.addPage();
        y = 40;
      }

      doc.addImage(imgData, "PNG", margin, y, contentW, safeImgH);
      y += safeImgH + 24;
    }

    // Page break before next section if needed
    if (y > pageH - 80) {
      doc.addPage();
      y = 40;
    }
  };

  // ── 1. Revenue by Region (Pie) ──
  addSection(
    "1. Contribution of Revenue by Region",
    ["Region", "Revenue"],
    data.region.map((r) => [r.region_name ?? "-", fmt(r.revenue)]),
    canvasRegion
  );

  // ── 2. Revenue Trend (Line) ──
  addSection(
    "2. Trend Analysis — Revenue by Channel",
    ["Month", "Revenue"],
    data.trend.map((r) => [fmtDate(r.month), fmt(r.revenue)]),
    canvasTrend
  );

  // ── 3. Revenue by Country (Bar) ──
  addSection(
    "3. Revenue by Country",
    ["Country", "Revenue"],
    data.country.map((r) => [r.country_name ?? "-", fmt(r.revenue)]),
    canvasCountry
  );

  // ── 4. Target vs Revenue (Grouped Bar) ──
  addSection(
    "4. Target vs Revenue by Region",
    ["Region", "Target", "Revenue", "Achievement %"],
    data.target.map((r) => {
      const pct = r.target > 0 ? ((r.revenue / r.target) * 100).toFixed(1) + "%" : "N/A";
      return [r.region_name ?? "-", fmt(r.target), fmt(r.revenue), pct];
    }),
    canvasTarget
  );

  // ── Footer on every page ──
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(190, 190, 190);
    doc.text(
      `Page ${i} of ${totalPages}  |  Navics Analytics`,
      pageW / 2,
      pageH - 15,
      { align: "center" }
    );
  }

  doc.save(`Navics_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
};

// ══════════════════════════════════════════════
// 📊 EXCEL DOWNLOAD  (sheet per chart: table + image)
// ══════════════════════════════════════════════
export const downloadExcel = async (filters) => {
  // 1️⃣ Capture charts
  const [canvasRegion, canvasTrend, canvasCountry, canvasTarget] =
    await Promise.all([
      captureChart("chart-revenue-region"),
      captureChart("chart-revenue-trend"),
      captureChart("chart-revenue-country"),
      captureChart("chart-target-vs-revenue"),
    ]);

  // 2️⃣ Fetch data
  let data;
  try {
    data = await fetchAllData(filters);
  } catch (err) {
    console.error("Data fetch failed:", err);
    alert("Data fetch failed. Please check your server.");
    return;
  }

  // 3️⃣ Build workbook
  const wb = new ExcelJS.Workbook();
  wb.creator = "Navics Analytics";
  wb.created = new Date();

  const headerFill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFE634E" } };
  const headerFont = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
  const altFill    = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF5F3" } };
  const whiteFill  = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } };
  const cellBorder = {
    top:    { style: "thin", color: { argb: "FFFFE0DA" } },
    left:   { style: "thin", color: { argb: "FFFFE0DA" } },
    bottom: { style: "thin", color: { argb: "FFFFE0DA" } },
    right:  { style: "thin", color: { argb: "FFFFE0DA" } },
  };

  // Helper: build one sheet
  const buildSheet = async (name, headers, rows, canvas) => {
    const ws = wb.addWorksheet(name);

    // Filter info row
    const fRow = ws.addRow([`Filters: ${filterLabel(filters)}`]);
    fRow.getCell(1).font = { italic: true, color: { argb: "FF888888" }, size: 9 };
    ws.mergeCells(fRow.number, 1, fRow.number, headers.length);

    ws.addRow([]); // blank spacer

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

    // Auto column width
    ws.columns.forEach((col) => { col.width = 22; });

    // Chart image (placed below the table)
    if (canvas) {
      const buf = canvasToBuffer(canvas);
      if (buf) {
        const imageId = wb.addImage({ buffer: buf, extension: "png" });
        const tableEndRow = ws.rowCount + 2; // 2-row gap after data
        const imgHeightPx = 300;
        const imgWidthPx  = 600;

        ws.addImage(imageId, {
          tl: { col: 0, row: tableEndRow },
          ext: { width: imgWidthPx, height: imgHeightPx },
        });

        // Reserve rows for image (approx 20 rows ≈ 300px)
        for (let i = 0; i < 22; i++) ws.addRow([]);
      }
    }
  };

  await buildSheet(
    "Revenue by Region",
    ["Region", "Revenue"],
    data.region.map((r) => [r.region_name ?? "-", fmt(r.revenue)]),
    canvasRegion
  );

  await buildSheet(
    "Revenue Trend",
    ["Month", "Revenue"],
    data.trend.map((r) => [fmtDate(r.month), fmt(r.revenue)]),
    canvasTrend
  );

  await buildSheet(
    "Revenue by Country",
    ["Country", "Revenue"],
    data.country.map((r) => [r.country_name ?? "-", fmt(r.revenue)]),
    canvasCountry
  );

  await buildSheet(
    "Target vs Revenue",
    ["Region", "Target", "Revenue", "Achievement %"],
    data.target.map((r) => {
      const pct = r.target > 0 ? ((r.revenue / r.target) * 100).toFixed(1) + "%" : "N/A";
      return [r.region_name ?? "-", fmt(r.target), fmt(r.revenue), pct];
    }),
    canvasTarget
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
  a.download = `Navics_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
};
