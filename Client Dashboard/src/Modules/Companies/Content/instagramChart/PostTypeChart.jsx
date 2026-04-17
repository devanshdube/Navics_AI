import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Tooltip, Cell,
  ResponsiveContainer, Legend
} from "recharts";
import { useSelector } from "react-redux";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return percent > 0.05 ? (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight="bold">
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  ) : null;
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-sm">
        <p className="font-semibold text-gray-700">{name}</p>
        <p className="text-gray-500">Count: <span className="font-bold text-gray-800">{value}</span></p>
      </div>
    );
  }
  return null;
};

export default function PostTypeChart({ filters }) {
  const [data, setData] = useState([]);
  const company_id = useSelector((state) => state.user?.currentUser?.company_id);

  useEffect(() => {
    if (!company_id) return;
    fetchData();
  }, [filters, company_id]);

  const fetchData = async () => {
    const res = await axios.get(
      `http://localhost:5555/auth/navics/companies/charts/post-type-breakdown/${company_id}`,
      { params: filters }
    );
    setData(res.data);
  };

  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="bg-white shadow-sm border border-gray-100 overflow-hidden">
      {/* Top color bar */}
      <div className="h-1 w-full" />

      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold text-gray-700">Post Type Breakdown</h2>
          {/* <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
            Total: {total}
          </span> */}
        </div>

        {/* Pie Chart */}
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="type"
                outerRadius="70%"
                labelLine={false}
                label={renderCustomLabel}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-xs text-gray-600">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom stats */}
        <div className="flex gap-2 mt-2 flex-wrap">
          {data.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-gray-50 rounded-full px-3 py-1">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-xs text-gray-500">{item.type}</span>
              <span className="text-xs font-semibold text-gray-700">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}