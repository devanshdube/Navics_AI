import React, { useEffect, useState } from "react";
import axios from "axios";

const StatsCards = ({ filters }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    fetchStats();
  }, [filters]);

  const fetchStats = async () => {
    const res = await axios.get(
      "http://localhost:5555/auth/navics/auth/stats",
      {
        params: filters,
      },
    );
    setData(res.data.data);
  };

  const active = filters.sentiment;

  const cards = [
    {
      label: "Total",
      value: data.total,
      icon: "📊",
      border: "border-l-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
      key: "total",
    },
    {
      label: "Positive",
      value: data.positive,
      icon: "😊",
      border: "border-l-green-500",
      bg: "bg-green-50",
      text: "text-green-600",
      key: "positive",
    },
    {
      label: "Negative",
      value: data.negative,
      icon: "😡",
      border: "border-l-red-500",
      bg: "bg-red-50",
      text: "text-red-600",
      key: "negative",
    },
    {
      label: "Neutral",
      value: data.neutral,
      icon: "😐",
      border: "border-l-gray-500",
      bg: "bg-gray-50",
      text: "text-gray-600",
      key: "neutral",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4">
      {cards.map((card, i) => {
        const isActive = active === card.key;

        return (
          <div
            key={i}
            className={`bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 ${card.border} p-3 sm:p-4 transition-all duration-200
          ${isActive ? "scale-105 ring-2 ring-offset-1 ring-gray-300" : ""}
        `}
          >
            {/* Icon */}
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full ${card.bg} flex items-center justify-center text-lg mb-2`}
            >
              {card.icon}
            </div>

            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              {card.label}
            </p>

            <p className={`text-lg sm:text-2xl font-bold mt-1 ${card.text}`}>
              {card.value ?? "—"}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;

// // StatsCards.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const StatsCards = ({ filters }) => {
//   const [data, setData] = useState({});

//   useEffect(() => {
//     fetchStats();
//   }, [filters]);

//   const fetchStats = async () => {
//     const res = await axios.get("http://localhost:5555/auth/navics/auth/stats", {
//       params: filters,
//     });
//     setData(res.data.data);
//   };

//   return (
//     <div className="grid grid-cols-4 gap-4">

//       <div className="bg-white p-4 shadow rounded">
//         <h4>Total</h4>
//         <p>{data.total}</p>
//       </div>

//       <div className="bg-green-100 p-4 shadow rounded">
//         <h4>Positive</h4>
//         <p>{data.positive}</p>
//       </div>

//       <div className="bg-red-100 p-4 shadow rounded">
//         <h4>Negative</h4>
//         <p>{data.negative}</p>
//       </div>

//       <div className="bg-gray-100 p-4 shadow rounded">
//         <h4>Neutral</h4>
//         <p>{data.neutral}</p>
//       </div>

//     </div>
//   );
// };

// export default StatsCards;
