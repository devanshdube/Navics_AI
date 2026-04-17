import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Cell
} from "recharts";
import { useSelector } from "react-redux";

const COLORS = [
  "#378ADD", "#1D9E75", "#D85A30", "#7F77DD", "#D4537E",
  "#BA7517", "#639922", "#E24B4A", "#5DCAA5", "#EF9F27",
  "#85B7EB", "#9FE1CB", "#F0997B", "#AFA9EC", "#ED93B1",
  "#97C459", "#B4B2A9", "#F09595", "#FAC775", "#5DCAA5"
];

const METRICS = [
  { key: "avg_likes", label: "Likes" },
  { key: "avg_comments", label: "Comments" },
  { key: "avg_shares", label: "Shares" },
];

export default function PageComparison({ filters }) {
  const [data, setData] = useState([]);
  const [active, setActive] = useState("avg_likes");
  const company_id = useSelector((state) => state.user?.currentUser?.company_id);

  useEffect(() => {
    console.log(`Facebok Company ID: ${company_id}`);
    if (!company_id) return;
    axios
      .get(`http://localhost:5555/auth/navics/companies/charts/page-comparison/${company_id}`, { params: filters })
      .then((res) => setData(res.data));
  }, [filters, company_id]);

  // X-axis = companies, Y = selected metric
  const chartData = data.map((p) => ({
    name: p.page_name,
    value: p[active],
  }));

  // 20 companies = horizontal bar better lagta hai
  const isMany = data.length > 6;
  const barH = Math.max(320, data.length * 42);

  return (
    <div className="bg-white p-4 rounded shadow">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontWeight: 600 }}>Page Comparison</h3>
        <div style={{ display: "flex", gap: 8 }}>
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setActive(m.key)}
              style={{
                padding: "4px 14px",
                borderRadius: 20,
                border: "1px solid",
                fontSize: 13,
                cursor: "pointer",
                background: active === m.key ? "#378ADD" : "transparent",
                color: active === m.key ? "#fff" : "#888",
                borderColor: active === m.key ? "#378ADD" : "#ddd",
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={isMany ? barH : 320}>
        <BarChart
          data={chartData}
          layout={isMany ? "vertical" : "horizontal"}
          margin={{ left: isMany ? 100 : 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={!isMany} vertical={isMany} />

          {isMany ? (
            <>
              <YAxis dataKey="name" type="category" width={95} tick={{ fontSize: 12 }} />
              <XAxis type="number" tickFormatter={(v) => v.toLocaleString()} />
            </>
          ) : (
            <>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => v.toLocaleString()} />
            </>
          )}

          <Tooltip
            formatter={(value, name) => [value.toLocaleString(), METRICS.find(m => m.key === active)?.label]}
            labelFormatter={(label) => label}
          />

          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={48}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}