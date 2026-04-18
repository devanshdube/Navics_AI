import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function TweetEngagementChart({ filters }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    const res = await axios.get(
      "http://localhost:5555/auth/navics/auth/getTweetAnalytics",
      {
        params: filters,
      }
    );
    setData(res.data.data);
  };

  return (
    <div id="tw-chart-engagement" className="bg-white p-4 shadow w-full h-[350px]">
      <h2 className="mb-2 font-semibold">Retweet vs Replies</h2>

      {/* ✅ Important wrapper */}
      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            {/* X Axis */}
            <XAxis
              dataKey="tweet_id"
              tickFormatter={(val) =>
                val.length > 6 ? val.substring(0, 6) + "..." : val
              }
            />

            <YAxis />
            <Tooltip />
            <Legend />

            {/* Colors */}
            <Bar dataKey="retweet" fill="#3b82f6" name="Retweets" />
            <Bar dataKey="replies" fill="#22c55e" name="Replies" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   Legend,
// } from "recharts";

// export default function TweetEngagementChart({ filters }) {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     fetchData();
//   }, [filters]);

//   const fetchData = async () => {
//     const res = await axios.get(
//       "http://localhost:5555/auth/navics/auth/getTweetAnalytics",
//       {
//         params: filters,
//       },
//     );
//     setData(res.data.data);
//   };

//   return (
//     <div className="bg-white p-4 shadow">
//       <h2 className="mb-2 font-semibold">Retweet vs Replies</h2>

//       <BarChart width={1000} height={300} data={data}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="tweet_id" />
//         <YAxis />
//         <Tooltip />
//         <Legend />

//         <Bar dataKey="retweet" fill="#3b82f6" name="Retweets" />
//         <Bar dataKey="replies" fill="#22c55e" name="Replies" />
//       </BarChart>
//     </div>
//   );
// }
