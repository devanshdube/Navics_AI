// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function DashboardStats({ filters }) {
//   const [stats, setStats] = useState({});

//   useEffect(() => {
//     axios
//       .get("http://localhost:5555/auth/navics/auth/getDashboardStats", {
//         params: filters,
//       })
//       .then((res) => setStats(res.data))
//       .catch(console.error);
//   }, [filters]);

//   return (
//     <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
//       {/* Total Revenue */}
//       <div className="bg-white p-3 md:p-4 rounded shadow">
//         <h4 className="text-gray-500 text-xs sm:text-sm">Total Revenue</h4>
//         <p className="text-lg sm:text-xl font-bold text-green-600">
//           ₹ {(stats.totalRevenue / 1000000 || 0).toFixed(2)}M
//         </p>
//       </div>

//       {/* Total Target */}
//       <div className="bg-white p-3 md:p-4 rounded shadow">
//         <h4 className="text-gray-500 text-xs sm:text-sm">Total Target</h4>
//         <p className="text-lg sm:text-xl font-bold text-blue-600">
//           ₹ {(stats.totalTarget / 1000000 || 0).toFixed(2)}M
//         </p>
//       </div>

//       {/* MOM */}
//       <div className="bg-white p-3 md:p-4 rounded shadow">
//         <h4 className="text-gray-500 text-xs sm:text-sm">MOM %</h4>
//         <p
//           className={`text-lg sm:text-xl font-bold ${
//             stats.mom >= 0 ? "text-green-500" : "text-red-500"
//           }`}
//         >
//           {stats.mom || 0}%
//         </p>
//       </div>

//       {/* Top Analysis */}
//       {/* <div className="bg-white p-3 md:p-4 rounded shadow">
//         <h4 className="text-gray-500 text-xs sm:text-sm">Top Analysis</h4>
//         <p className="text-lg sm:text-xl font-bold text-purple-600">
//           {stats.top || "-"}
//         </p>
//       </div> */}
//       {/* Top Analysis */}
//       <div className="bg-white p-3 md:p-4 rounded shadow">
//         <h4 className="text-gray-500 text-xs sm:text-sm mb-2">Top Analysis</h4>

//         <div className="space-y-2">
//           {(stats.topCountries || []).map((item, index) => {
//             const max = stats.topCountries?.[0]?.revenue || 1;
//             const width = (item.revenue / max) * 100;

//             return (
//               <div key={index}>
//                 <div
//                   className="h-2 bg-purple-500 rounded transition-all duration-300 hover:opacity-80"
//                   style={{ width: `${width}%` }}
//                   title={`${item.country_name} - ₹${item.revenue}`}
//                 ></div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

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

  const cards = [
    {
      label: "Total Revenue",
      value: `₹ ${(stats.totalRevenue / 1000000 || 0).toFixed(2)}M`,
      icon: "💰",
      border: "border-l-green-500",
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      label: "Total Target",
      value: `₹ ${(stats.totalTarget / 1000000 || 0).toFixed(2)}M`,
      icon: "🎯",
      border: "border-l-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      label: "MOM %",
      value: `${stats.mom || 0}%`,
      icon: "📈",
      border: stats.mom >= 0 ? "border-l-green-500" : "border-l-red-500",
      bg: stats.mom >= 0 ? "bg-green-50" : "bg-red-50",
      text: stats.mom >= 0 ? "text-green-600" : "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
      {/* Normal Cards */}
      {cards.map((card, i) => (
        <div
          key={i}
          className={`bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 ${card.border} p-3 sm:p-4 transition hover:shadow-md`}
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
            {card.value}
          </p>
        </div>
      ))}

      {/* Top Analysis Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-purple-500 p-3 sm:p-4 transition hover:shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
            📊
          </div>
          <h4 className="text-xs sm:text-sm text-gray-500 font-medium">
            Top Analysis
          </h4>
        </div>

        <div className="space-y-2 mt-2">
          {(stats.topCountries || []).map((item, index) => {
            const max = stats.topCountries?.[0]?.revenue || 1;
            const width = (item.revenue / max) * 100;

            return (
              <div key={index}>
                <div
                  className="h-2 bg-gradient-to-r from-purple-500 to-purple-400 rounded transition-all duration-500 hover:opacity-80"
                  style={{ width: `${width}%` }}
                  title={`${item.country_name} - ₹${item.revenue}`}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
