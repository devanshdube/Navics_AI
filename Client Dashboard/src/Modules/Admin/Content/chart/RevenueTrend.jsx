import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function RevenueTrend({ filters }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    // axios
    //   .get("http://localhost:5555/auth/navics/auth/getRevenueTrend")
    axios
      .get("http://localhost:5555/auth/navics/auth/getRevenueTrend", {
        params: filters,
      })
      .then((res) => setData(res.data));
  }, [filters]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="mb-2 font-semibold">Trend Analysis Revenue by Channel</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
        >
          <XAxis dataKey="month" />
          <YAxis
            width={80}
            tickFormatter={(value) => (value / 1000000).toFixed(1) + "M"}
          />
          <Tooltip />
          <Legend />

          <Line type="monotone" dataKey="revenue" stroke="#2bc155" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
