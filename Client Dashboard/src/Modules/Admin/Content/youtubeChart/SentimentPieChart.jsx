// SentimentPieChart.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["green", "red", "gray"];

const SentimentPieChart = ({ filters }) => {
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
      <h3>Pie Chart</h3>
      <PieChart width={400} height={300}>
        <Pie data={data} dataKey="count" label nameKey="sentiment">
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default SentimentPieChart;