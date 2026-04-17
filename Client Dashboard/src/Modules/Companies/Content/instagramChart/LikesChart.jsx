import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from "recharts";
import { useSelector } from "react-redux";

const formatDate = (dateStr) => {
  return dateStr?.split("T")[0] ?? dateStr;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-sm">
        <p className="font-semibold text-gray-700">{formatDate(label)}</p>
        <p className="text-gray-500">
          Likes: <span className="font-bold text-blue-600">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function LikesChart({ filters }) {
  const [data, setData] = useState([]);
  const company_id = useSelector((state) => state.user?.currentUser?.company_id);
  useEffect(() => {
    if (!company_id) return;
    fetchData();
  }, [filters, company_id]);

  const fetchData = async () => {
    const res = await axios.get(
      `http://localhost:5555/auth/navics/companies/charts/likes-over-time/${company_id}`,
      { params: filters }
    );

    // Date format fix
    const formatted = res.data.map((item) => ({
      ...item,
      timestamp: formatDate(item.timestamp),
    }));
    setData(formatted);
  };

  return (
    <div className="bg-white shadow-sm border border-gray-100 overflow-hidden">
      {/* Top color bar */}
      <div className="h-1 w-full" />

      <div className="p-4">
        <h2 className="font-semibold text-gray-700 mb-4">Likes Over Time</h2>

        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="timestamp"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="likes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}