import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid
} from "recharts";

const SentimentBarChart = ({ filters }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    const res = await axios.get("http://localhost:5555/auth/navics/auth/chart", {
      params: filters,
    });
    setData(res.data.data);
  };

  return (
    <div className="bg-white p-4 shadow rounded">
      <h3 className="mb-3 font-semibold">Bar Chart</h3>

      <BarChart width={500} height={350} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="sentiment" />
        <YAxis />
        <Tooltip />

        <Bar dataKey="count">
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.sentiment === "positive"
                  ? "#22c55e"   // green
                  : entry.sentiment === "negative"
                  ? "#ef4444"   // red
                  : "#9ca3af"   // gray
              }
            />
          ))}
        </Bar>

      </BarChart>
    </div>
  );
};

export default SentimentBarChart;