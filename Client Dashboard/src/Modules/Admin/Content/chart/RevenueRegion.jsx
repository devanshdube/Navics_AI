import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#2bc155", "#3b82f6", "#ff7f50"];

export default function RevenueRegion({ filters }) {
  const [data, setData] = useState([]);
  const [chartSize, setChartSize] = useState({ height: 300, outerRadius: 100 });

  useEffect(() => {
    axios
      .get("http://localhost:5555/auth/navics/auth/getRevenueByRegion", {
        params: filters,
      })
      .then((res) => setData(res.data));
  }, [filters]);

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;

      if (width < 640) {
        // Mobile
        setChartSize({ height: 320, outerRadius: 90 });
      } else if (width < 768) {
        // Large Mobile / Small Tablet
        setChartSize({ height: 340, outerRadius: 100 });
      } else if (width < 1024) {
        // Tablet
        setChartSize({ height: 360, outerRadius: 110 });
      } else if (width < 1280) {
        // Laptop
        setChartSize({ height: 380, outerRadius: 120 });
      } else {
        // PC / Large Screen
        setChartSize({ height: 400, outerRadius: 130 });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div id="chart-revenue-region" className="bg-white p-3 sm:p-4 md:p-5 lg:p-6 rounded shadow w-full">
      <h3 className="mb-2 font-semibold text-sm sm:text-base md:text-lg">
        Contribution of Revenue by Region
      </h3>

      <ResponsiveContainer width="100%" height={chartSize.height}>
        <PieChart>
          <Pie
            data={data}
            dataKey="revenue"
            nameKey="region_name"
            outerRadius={chartSize.outerRadius}
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}