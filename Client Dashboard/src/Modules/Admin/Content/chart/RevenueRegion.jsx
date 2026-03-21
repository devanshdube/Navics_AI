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

  useEffect(() => {
    // axios
    //   .get("http://localhost:5555/auth/navics/auth/getRevenueByRegion")
    axios.get("http://localhost:5555/auth/navics/auth/getRevenueByRegion", {
  params: filters
})
      .then((res) => setData(res.data));
  }, [filters]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="mb-2 font-semibold">Contribution of Revenue by Region</h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="revenue"
            nameKey="region_name"
            outerRadius={100}
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
