import React, { useEffect, useState } from "react";
import axios from "axios";

export default function KPIStats({ filters }) {
  const [data, setData] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5555/auth/navics/auth/getKPI", { params: filters })
      .then((res) => setData(res.data));
  }, [filters]);

  const stats = [
    { label: "Posts",    value: data.total_posts,    icon: "📝", color: "border-l-blue-500"   },
    { label: "Likes",    value: data.total_likes,    icon: "👍", color: "border-l-pink-500"   },
    { label: "Comments", value: data.total_comments, icon: "💬", color: "border-l-yellow-500" },
    { label: "Shares",   value: data.total_shares,   icon: "🔁", color: "border-l-green-500"  },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`bg-white p-3 sm:p-4 shadow rounded-xl border-l-4 ${stat.color} flex flex-col gap-1`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-gray-500 font-medium">
              {stat.label}
            </span>
            <span className="text-lg sm:text-xl">{stat.icon}</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-gray-800">
            {stat.value ?? "—"}
          </div>
        </div>
      ))}
    </div>
  );
}