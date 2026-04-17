import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return dateStr.split("T")[0];
};

export default function RevenueTrend({ filters }) {
  const [data, setData] = useState([]);
  const [chartSize, setChartSize] = useState({ height: 300 });

  const company_id = useSelector((state) => state.user?.currentUser?.company_id);

  useEffect(() => {
    console.log(company_id);
    if (!company_id) return;
    axios
      .get(`http://localhost:5555/auth/navics/companies/charts/getRevenueTrend/${company_id}`, {
        params: filters,
      })
      .then((res) => setData(res.data));
  }, [filters, company_id]);

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setChartSize({ height: 320 });
      } else if (width < 768) {
        setChartSize({ height: 340 });
      } else if (width < 1024) {
        setChartSize({ height: 360 });
      } else if (width < 1280) {
        setChartSize({ height: 380 });
      } else {
        setChartSize({ height: 400 });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="bg-white p-3 sm:p-4 md:p-5 lg:p-6 rounded shadow w-full">
      <h3 className="mb-2 font-semibold text-sm sm:text-base md:text-lg">
        Trend Analysis Revenue by Channel
      </h3>

      <ResponsiveContainer width="100%" height={chartSize.height}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <XAxis
            dataKey="month"
            tickFormatter={formatDate}
            tick={{ fontSize: 11 }}
            dy={10}
          />
          <YAxis
            width={70}
            tickFormatter={(value) => (value / 1000000).toFixed(1) + "M"}
            tick={{ fontSize: 11 }}
          />
          <Tooltip labelFormatter={formatDate} />
          <Legend verticalAlign="bottom" height={36} />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#2bc155"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}