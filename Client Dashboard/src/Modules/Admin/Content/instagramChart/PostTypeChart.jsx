import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

export default function PostTypeChart() {
  const [data, setData] = useState([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const res = await axios.get(
      "http://localhost:5555/auth/navics/auth/getPostTypeBreakdown"
    );
    setData(res.data);
  };

  return (
    <div className="bg-white p-4 shadow h-[350px]">
      <h2 className="mb-2 font-semibold">Post Type</h2>

      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="type" outerRadius={100}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}