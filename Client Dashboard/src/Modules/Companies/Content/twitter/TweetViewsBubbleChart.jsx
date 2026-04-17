import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ZAxis,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";

export default function TweetViewsBubbleChart({ filters }) {
  const [data, setData] = useState([]);
  const company_id = useSelector((state) => state.user?.currentUser?.company_id);

  useEffect(() => {
    if (!company_id) return;
    fetchData();
  }, [filters, company_id]);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5555/auth/navics/companies/charts/getTweetAnalytics/${company_id}`,
        {
          params: filters,
        },
      );

      // ✅ Clean + scalable mapping
      const formatted = res.data.data.map((item, index) => ({
        x: new Date(item.tweet_date).getTime(),
        y: `T${index + 1}`, // short label
        z: item.views,
        tweet_id: item.tweet_id, // full id for tooltip
        date: item.tweet_date,
      }));

      setData(formatted);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div className="bg-white p-3 border shadow rounded">
          <p>
            <strong>Tweet ID:</strong> <span style={{ color: "blue" }}>{data.tweet_id}</span>
          </p>
          <p>
            <strong>Date:</strong>{" "}
            <span>{new Date(data.x).toLocaleDateString()}</span>
          </p>
          <p>
            <strong>Views:</strong> <span>{data.z}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 shadow w-full h-[450px]">
      <h2 className="mb-2 font-semibold">Tweet Views Bubble Chart</h2>

      <div className="w-full h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />

            {/* ✅ X Axis → Date */}
            <XAxis
              type="number"
              dataKey="x"
              name="Date"
              domain={["auto", "auto"]}
              tickFormatter={(val) => new Date(val).toLocaleDateString()}
            />

            {/* ✅ Y Axis → Short Labels */}
            <YAxis type="category" dataKey="y" width={60} />

            {/* ✅ Bubble size */}
            <ZAxis dataKey="z" range={[50, 400]} name="Views" />

            {/* ✅ Tooltip (FULL INFO) */}
            <Tooltip content={<CustomTooltip />} />
            {/* <Tooltip
              formatter={(value, name) => {
                if (name === "x") {
                  return new Date(value).toLocaleDateString();
                }
                if (name === "z") {
                  return [`${value}`, "Views"];
                }
                return value;
              }}
              labelFormatter={(label, payload) => {
                if (payload && payload.length) {
                  return `Tweet ID: ${payload[0].payload.tweet_id}`;
                }
                return label;
              }}
            /> */}

            <Scatter data={data} fill="#3b82f6" isAnimationActive={false} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid, ZAxis
// } from "recharts";

// export default function TweetViewsBubbleChart({ filters }) {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     fetchData();
//   }, [filters]);

//   const fetchData = async () => {
//     const res = await axios.get("http://localhost:5555/auth/navics/auth/getTweetAnalytics", {
//       params: filters
//     });

//     // Transform for bubble chart
//     const formatted = res.data.data.map((item, index) => ({
//       x: index + 1, // tweet index
//       y: new Date(item.tweet_date).getTime(),
//       z: item.views,
//       tweet_id: item.tweet_id
//     }));

//     setData(formatted);
//   };

//   return (
//     <div className="bg-white p-4 shadow">
//       <h2 className="mb-2 font-semibold">Tweet Views Bubble Chart</h2>

//       <ScatterChart width={1000} height={400}>
//         <CartesianGrid />
//         <XAxis dataKey="x" name="Tweet" />
//         <YAxis
//           dataKey="y"
//           name="Date"
//           tickFormatter={(val) => new Date(val).toLocaleDateString()}
//         />
//         <ZAxis dataKey="z" range={[50, 400]} name="Views" />
//         <Tooltip
//           formatter={(value, name, props) => {
//             if (name === "Date") return new Date(value).toLocaleDateString();
//             return value;
//           }}
//         />
//         <Scatter data={data} />
//       </ScatterChart>
//     </div>
//   );
// }
