import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function SummaryBoxes({ filters }) {
  const [data, setData] = useState({});
  const company_id = useSelector((state) => state.user?.currentUser?.company_id);

  useEffect(() => {
    if (!company_id) return;
    fetchData();
  }, [filters, company_id]);

  const fetchData = async () => {
    const res = await axios.get(
      `http://localhost:5555/auth/navics/companies/charts/getSummary/${company_id}`,
      {
        params: filters,
      },
    );
    setData(res.data.data);
  };

  const cards = [
    {
      label: "Views",
      value: data?.total_views,
      icon: "👁️",
      border: "border-l-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      label: "Likes",
      value: data?.total_likes,
      icon: "❤️",
      border: "border-l-pink-500",
      bg: "bg-pink-50",
      text: "text-pink-600",
    },
    {
      label: "Retweets",
      value: data?.total_retweet,
      icon: "🔁",
      border: "border-l-green-500",
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      label: "Replies",
      value: data?.total_replies,
      icon: "💬",
      border: "border-l-yellow-500",
      bg: "bg-yellow-50",
      text: "text-yellow-600",
    },
    {
      label: "Quotes",
      value: data?.total_quotes,
      icon: "📢",
      border: "border-l-purple-500",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-4 md:mb-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 ${card.border} p-3 sm:p-4`}
        >
          {/* Icon */}
          <div
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full ${card.bg} flex items-center justify-center text-lg mb-2`}
          >
            {card.icon}{" "}
          </div>

          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            {card.label}
          </p>

          <p className={`text-lg sm:text-2xl font-bold mt-1 ${card.text}`}>
            {card.value ?? "—"}
          </p>
        </div>
      ))}
    </div>
  );
}
