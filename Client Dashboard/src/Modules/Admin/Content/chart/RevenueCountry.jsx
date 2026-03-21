import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RevenueCountry({ filters }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    // axios
    //   .get("http://localhost:5555/auth/navics/auth/getRevenueByCountry")
    axios
      .get("http://localhost:5555/auth/navics/auth/getRevenueByCountry", {
        params: filters,
      })
      .then((res) => setData(res.data));
  }, [filters]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="mb-2 font-semibold">Revenue by Country</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
        >
          <XAxis dataKey="country_name" />
          <YAxis
            width={80}
            tickFormatter={(value) => (value / 1000000).toFixed(1) + "M"}
          />
          <Tooltip />

          <Bar dataKey="revenue" fill="#2bc155" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
