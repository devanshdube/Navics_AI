import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
  Legend,
} from "recharts";

// ✅ Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;

    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid #eee",
          padding: "8px",
          borderRadius: "6px",
        }}
      >
        <p>
          <b>Video:</b> {label}
        </p>
        <p style={{ color: "#3b82f6" }}>Positive: {d.positive.toFixed(1)}%</p>
        <p style={{ color: "#1e3a8a" }}>Negative: {d.negative.toFixed(1)}%</p>
        <p style={{ color: "#f97316" }}>Neutral: {d.neutral.toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

// ✅ Label inside bar
const renderPercentLabel = (props) => {
  const { x, y, width, height, value } = props;

  if (!value || width < 30) return null;

  return (
    <text
      x={x + width / 2}
      y={y + height / 2}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight="bold"
    >
      {value.toFixed(0)}%{" "}
    </text>
  );
};

const SentimentBarVChart = ({ filters }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5555/auth/navics/auth/sentimentByVideo",
        {
          params: {
            startDate: filters?.startDate || "",
            endDate: filters?.endDate || "",
          },
        },
      );

      // ✅ Convert to percentage
      const formatted = res.data.data.map((item) => {
        const total =
          Number(item.positive) + Number(item.negative) + Number(item.neutral);

        return {
          video_id: item.video_id || "N/A",

          positive: total ? (item.positive / total) * 100 : 0,

          negative: total ? (item.negative / total) * 100 : 0,

          neutral: total ? (item.neutral / total) * 100 : 0,
        };
      });

      setData(formatted);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #eee",
        padding: "16px",
      }}
    >
      <h3 style={{ marginBottom: "10px" }}>Sentiment by Video</h3>

      <div style={{ height: "400px", overflowY: "auto" }}>
        <ResponsiveContainer
          width="100%"
          height={Math.max(data.length * 60, 300)}
        >
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
            barSize={25}
          >
            <CartesianGrid strokeDasharray="3 3" />

            {/* ✅ FIXED 100% scale */}
            <XAxis
              type="number"
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(val) => `${val}%`}
            />

            <YAxis type="category" dataKey="video_id" width={100} />

            <Tooltip content={<CustomTooltip />} />
            <Legend />

            <Bar dataKey="positive" stackId="a" fill="#3b82f6">
              <LabelList content={renderPercentLabel} />
            </Bar>

            <Bar dataKey="negative" stackId="a" fill="#1e3a8a">
              <LabelList content={renderPercentLabel} />
            </Bar>

            <Bar dataKey="neutral" stackId="a" fill="#f97316">
              <LabelList content={renderPercentLabel} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SentimentBarVChart;
