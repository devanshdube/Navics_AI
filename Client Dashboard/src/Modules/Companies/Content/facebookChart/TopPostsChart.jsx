import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";

// Custom Tooltip — full content dikhayega
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white p-3 shadow rounded border text-sm max-w-xs">
        <p className="font-bold text-gray-700 mb-1">{d.fullcontent}</p>
        <p className="text-blue-500">Likes: {d.likes}</p>
        <p className="text-green-500">Comments: {d.comments}</p>
        <p className="text-orange-500">Shares: {d.shares}</p>
      </div>
    );
  }
  return null;
};

export default function TopPostsChart({ filters }) {
  const [data, setData] = useState([]);
  const company_id = useSelector((state) => state.user?.currentUser?.company_id);

  useEffect(() => {
    console.log(`Facebok Company ID: ${company_id}`);
    if (!company_id) return;
    axios.get(`http://localhost:5555/auth/navics/companies/charts/top-posts/${company_id}`, { params: filters })
      .then(res => setData(res.data));
  }, [filters, company_id]);

  return (
    <div className="bg-white p-4 rounded shadow">
      {/* <h3 className="font-bold mb-3">Top 10 Posts</h3> */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fontSize: 9 }} angle={-40} textAnchor="end" interval={0} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="likes" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}