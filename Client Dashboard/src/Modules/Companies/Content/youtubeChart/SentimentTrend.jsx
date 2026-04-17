import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { useSelector } from "react-redux";

const SentimentTrend = ({ filters }) => {
  const [data, setData] = useState([]);
  const company_id = useSelector((state) => state.user?.currentUser?.company_id);

  useEffect(() => {
    if (!company_id) return;
    fetchTrend();
  }, [filters, company_id]);

  const fetchTrend = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5555/auth/navics/companies/charts/trend/${company_id}`,
        {
          params: {
            startDate: filters?.startDate || "",
            endDate: filters?.endDate || "",
          },
        },
      );

      setData(res.data.data);
    } catch (error) {
      console.error("Trend API Error:", error);
    }
  };

  return (
    <div className="bg-white p-4 shadow rounded w-full">
      {" "}
      <h3 className="mb-3 font-semibold text-gray-700">Sentiment Trend </h3>
      {/* ✅ Responsive wrapper */}
      <div className="w-full h-[300px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" tickFormatter={(value) => value.split("T")[0]} tick={{ fontSize: 12 }} />

            <YAxis />

            <Tooltip labelFormatter={(value) => value.split("T")[0]} />
            <Legend />

            <Line
              type="monotone"
              dataKey="positive"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="negative"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="neutral"
              stroke="#6b7280"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SentimentTrend;
