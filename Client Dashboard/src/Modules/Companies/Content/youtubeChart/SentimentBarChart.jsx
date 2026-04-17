import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { useSelector } from "react-redux";

// 🎨 Same theme colors (match all charts)
const COLORS = {
  positive: "#6B8E23",
  negative: "#D65A31",
  neutral: "#3F81C5"
};

// ✅ Custom Tooltip (clean UI)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow text-sm">
        <p><b>{label}</b></p>
        <p>Count: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const SentimentBarChart = ({ filters }) => {
  const [data, setData] = useState([]);
  const company_id = useSelector((state) => state.user?.currentUser?.company_id);

  useEffect(() => {
    if (!company_id) return;
    fetchData();
  }, [filters, company_id]);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5555/auth/navics/companies/charts/chart/${company_id}`,
        { params: filters }
      );
      setData(res.data.data || []);
    } catch (error) {
      console.error("Bar chart error:", error);
      setData([]);
    }
  };

  return (
    <div className="bg-white p-4 shadow rounded w-full h-[300px] md:h-[400px]">
      <h3 className="mb-3 font-semibold">Sentiment Bar Chart</h3>

      {data.length === 0 ? (
        <p className="text-center mt-10 text-gray-500">
          No data available
        </p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={40} margin={{ bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="sentiment" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />

            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[entry.sentiment]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default SentimentBarChart;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Cell,
//   CartesianGrid
// } from "recharts";

// const SentimentBarChart = ({ filters }) => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     fetchData();
//   }, [filters]);

//   const fetchData = async () => {
//     const res = await axios.get("http://localhost:5555/auth/navics/auth/chart", {
//       params: filters,
//     });
//     setData(res.data.data);
//   };

//   return (
//     <div className="bg-white p-4 shadow rounded">
//       <h3 className="mb-3 font-semibold">Bar Chart</h3>

//       <BarChart width={500} height={350} data={data}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="sentiment" />
//         <YAxis />
//         <Tooltip />

//         <Bar dataKey="count">
//           {data.map((entry, index) => (
//             <Cell
//               key={`cell-${index}`}
//               fill={
//                 entry.sentiment === "positive"
//                   ? "#22c55e"   // green
//                   : entry.sentiment === "negative"
//                   ? "#ef4444"   // red
//                   : "#9ca3af"   // gray
//               }
//             />
//           ))}
//         </Bar>

//       </BarChart>
//     </div>
//   );
// };

// export default SentimentBarChart;