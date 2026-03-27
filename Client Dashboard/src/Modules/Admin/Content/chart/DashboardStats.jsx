import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardStats({ filters }) {
  const [stats, setStats] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5555/auth/navics/auth/getDashboardStats", {
        params: filters,
      })
      .then((res) => setStats(res.data))
      .catch(console.error);
  }, [filters]);

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {/* Total Revenue */}
      <div className="bg-white p-4 rounded shadow">
        <h4 className="text-gray-500 text-sm">Total Revenue</h4>
        <p className="text-xl font-bold text-green-600">
          ₹ {(stats.totalRevenue / 1000000 || 0).toFixed(2)}M
        </p>
      </div>

      {/* Total Target */}
      <div className="bg-white p-4 rounded shadow">
        <h4 className="text-gray-500 text-sm">Total Target</h4>
        <p className="text-xl font-bold text-blue-600">
          ₹ {(stats.totalTarget / 1000000 || 0).toFixed(2)}M
        </p>
      </div>

      {/* MOM */}
      <div className="bg-white p-4 rounded shadow">
        <h4 className="text-gray-500 text-sm">MOM %</h4>
        <p
          className={`text-xl font-bold ${stats.mom >= 0 ? "text-green-500" : "text-red-500"}`}
        >
          {stats.mom || 0}%
        </p>
      </div>

      {/* Top Analysis */}
      <div className="bg-white p-4 rounded shadow">
        <h4 className="text-gray-500 text-sm">Top Analysis </h4>
        <p className="text-xl font-bold text-purple-600">{stats.top || "-"}</p>
      </div>
    </div>
  );
}
