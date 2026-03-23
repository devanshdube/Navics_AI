import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from "recharts";

export default function Chart({ filters }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchChart();
  }, [filters]);

  const fetchChart = async () => {
    const res = await axios.get("http://localhost:5555/auth/navics/auth/getChart", {
      params: filters
    });
    setData(res.data.data);
  };

  return (
    <div className="bg-white p-4 shadow">
      <LineChart width={800} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />

        <Line type="monotone" dataKey="likes" />
        <Line type="monotone" dataKey="views" />
        <Line type="monotone" dataKey="retweet" />

      </LineChart>
    </div>
  );
}