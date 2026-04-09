import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SummaryBoxes({ filters }) {
  const [data, setData] = useState({});

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    const res = await axios.get(
      "http://localhost:5555/auth/navics/auth/getInstaKPIs",
      { params: filters },
    );
    setData(res.data);
  };

  const cards = [
    {
      label: "Total Posts",
      value: data.totalPosts,
      icon: "📄",
      border: "border-l-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      label: "Total Likes",
      value: data.totalLikes,
      icon: "❤️",
      border: "border-l-pink-500",
      bg: "bg-pink-50",
      text: "text-pink-600",
    },
    {
      label: "Total Comments",
      value: data.totalComments,
      icon: "💬",
      border: "border-l-purple-500",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
    {
      label: "Engagement Rate",
      value: data.engagementRate,
      icon: "📈",
      border: "border-l-green-500",
      bg: "bg-green-50",
      text: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 ${card.border}`}
        >
          {" "}
          <div className="p-4">
            {/* Icon */}
            <div
              className={`w-9 h-9 rounded-full ${card.bg} flex items-center justify-center text-lg mb-3`}
            >
              {card.icon}{" "}
            </div>

            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
              {card.label}
            </p>

            <p className={`text-2xl font-bold mt-1 ${card.text}`}>
              {card.value ?? "—"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
