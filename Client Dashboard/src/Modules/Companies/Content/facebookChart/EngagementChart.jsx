import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";

const COLORS = ["#2bc155", "#3b82f6", "#ff7f50"];

export default function EngagementChart({ filters }) {
  const [data, setData] = useState([]);
  const company_id = useSelector((state) => state.user?.currentUser?.company_id);

  useEffect(() => {
    console.log(`Facebok Company ID: ${company_id}`);
    if (!company_id) return;
    axios.get(`http://localhost:5555/auth/navics/companies/charts/engagement/${company_id}`, { params: filters })
      .then(res => setData(res.data));
  }, [filters, company_id]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3>Engagement Breakdown</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={100}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}