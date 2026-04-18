import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function Chart({ filters }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchChart();
  }, [filters]);

  const fetchChart = async () => {
    const res = await axios.get(
      "http://localhost:5555/auth/navics/auth/getChart",
      {
        params: filters
      }
    );
    setData(res.data.data);
  };

  return (
    <div id="tw-chart-daily-trend" className="bg-white p-4 shadow w-full h-[450px]">
      <h2 className="mb-2 font-semibold">Daily Engagement Trend</h2>

      {/* ✅ Responsive wrapper */}
      <div className="w-full h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            {/* X Axis (Date) */}
            <XAxis
              dataKey="date"
              tickFormatter={(val) =>
                new Date(val).toLocaleDateString()
              }
            />

            <YAxis />
            <Tooltip
              labelFormatter={(label) =>
                `Date: ${new Date(label).toLocaleDateString()}`
              }
            />
            <Legend />

            {/* ✅ Colored Lines */}
            <Line
              type="monotone"
              dataKey="likes"
              stroke="#f59e0b" // 🟡 orange
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="views"
              stroke="#3b82f6" // 🔵 blue
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="retweet"
              stroke="#22c55e" // 🟢 green
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend
// } from "recharts";

// export default function Chart({ filters }) {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     fetchChart();
//   }, [filters]);

//   const fetchChart = async () => {
//     const res = await axios.get("http://localhost:5555/auth/navics/auth/getChart", {
//       params: filters
//     });
//     setData(res.data.data);
//   };

//   return (
//     <div className="bg-white p-4 shadow">
//       <LineChart width={1000} height={400} data={data}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="date" />
//         <YAxis />
//         <Tooltip />
//         <Legend />

//         <Line type="monotone" dataKey="likes" />
//         <Line type="monotone" dataKey="views" />
//         <Line type="monotone" dataKey="retweet" />

//       </LineChart>
//     </div>
//   );
// }