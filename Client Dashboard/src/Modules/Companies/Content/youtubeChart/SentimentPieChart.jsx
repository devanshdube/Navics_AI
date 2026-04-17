import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useSelector } from "react-redux";

// 🎨 Colors
const COLORS = {
  positive: "#6B8E23",
  negative: "#D65A31",
  neutral: "#3F81C5"
};

// ✅ Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { sentiment, count } = payload[0].payload;
    const percent = payload[0].percent || 0;

    return (
      <div className="bg-white p-2 border rounded shadow text-sm">
        <p><b>{sentiment}</b></p>
        <p>Count: {count}</p>
        {/* <p>Percent: {(percent * 100).toFixed(1)}%</p> */}
      </div>
    );
  }
  return null;
};

// ✅ Label
const renderLabel = ({ percent }) => {
  return percent ? `${(percent * 100).toFixed(0)}%` : "";
};

const SentimentPieChart = ({ filters }) => {
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
      console.error(error);
      setData([]);
    }
  };

  return (
    // <div className="bg-white p-4 shadow rounded w-full h-[350px] flex flex-col">
    <div className="bg-white p-4 shadow rounded w-full h-[300px] md:h-[400px] flex flex-col">
      <h3 className="mb-3 font-semibold">Sentiment Distribution</h3>

      {data.length === 0 ? (
        <p className="text-center mt-10 text-gray-500">
          No data available
        </p>
      ) : (
        <>
          {/* Chart */}
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="sentiment"
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  label={renderLabel}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[entry.sentiment]}
                    />
                  ))}
                </Pie>

                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 🔥 Custom Legend */}
          <div className="flex justify-center gap-6 mt-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: COLORS.positive }}></span>
              <span>Positive</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: COLORS.negative }}></span>
              <span>Negative</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: COLORS.neutral }}></span>
              <span>Neutral</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SentimentPieChart;



// // SentimentPieChart.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { PieChart, Pie, Cell, Tooltip } from "recharts";

// const COLORS = ["green", "red", "gray"];

// const SentimentPieChart = ({ filters }) => {
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
//       <h3>Pie Chart</h3>
//       <PieChart width={400} height={300}>
//         <Pie data={data} dataKey="count" label nameKey="sentiment">
//           {data.map((entry, index) => (
//             <Cell key={index} fill={COLORS[index]} />
//           ))}
//         </Pie>
//         <Tooltip />
//       </PieChart>
//     </div>
//   );
// };

// export default SentimentPieChart;