import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div className="bg-white p-2 border rounded shadow text-sm">
        <p><b>Video:</b> {label}</p>
        <p style={{ color: "#6B8E23" }}>Positive: {data.positive}</p>
        <p style={{ color: "#D65A31" }}>Negative: {data.negative}</p>
        <p style={{ color: "#3F81C5" }}>Neutral: {data.neutral}</p>
      </div>
    );
  }
  return null;
};

const SentimentBarVChart = ({ filters }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5555/auth/navics/auth/sentimentByVideo",
        {
          params: {
            videoId: filters.videoId || "",
            startDate: filters.startDate || "",
            endDate: filters.endDate || "",
            sentiment: filters.sentiment || ""
          }
        }
      );

      setData(res.data.data);
    } catch (error) {
      console.error("Error fetching chart data", error);
    }
  };

  return (
    <div className="bg-white p-4 shadow rounded w-full h-[300px] md:h-[400px]">
      <h3 className="mb-3 font-semibold">Sentiment by Video</h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="video_id" textAnchor="end" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />

          <Bar dataKey="positive" fill="#6B8E23" />
          <Bar dataKey="negative" fill="#D65A31" />
          <Bar dataKey="neutral" fill="#3F81C5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentBarVChart;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Cell,
//   CartesianGrid,
//   ResponsiveContainer
// } from "recharts";

// const SentimentBarVChart = ({ filters }) => {
//   const [data, setData] = useState([]);

//   useEffect(() => {

//       console.log("videoId:", filters.videoId);
//     if (filters.videoId) {
//       fetchData();
//     }
//   }, [filters]);

//   const fetchData = async () => {
//     const res = await axios.get(
//       "http://localhost:5555/auth/navics/auth/sentimentChartByVideo",
//       {
//         params: { videoId: filters.videoId },
//       }
//     );

//     console.log(res.data);
    

//     // convert object → array (important)
//     const formatted = Object.entries(res.data.data).map(([key, value]) => ({
//       sentiment: key,
//       count: value
//     }));

//     setData(formatted);
//   };

//   console.log(data);
  

//   return (
//     <div className="bg-white p-4 shadow rounded h-[350px]">
//       <h3 className="mb-3 font-semibold">Sentiment Bar Chart</h3>

//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="sentiment" />
//           <YAxis />
//           <Tooltip />

//           <Bar dataKey="count">
//             {data.map((entry, index) => (
//               <Cell
//                 key={index}
//                 fill={
//                   entry.sentiment === "positive"
//                     ? "#22c55e"
//                     : entry.sentiment === "negative"
//                     ? "#ef4444"
//                     : "#9ca3af"
//                 }
//               />
//             ))}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default SentimentBarVChart;