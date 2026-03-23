// SentimentTrend.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const SentimentTrend = ({ filters }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchTrend();
  }, [filters]);

  const fetchTrend = async () => {
    const res = await axios.get("http://localhost:5555/auth/navics/auth/trend");
    setData(res.data.data);
  };

  return (
    <div className="bg-white p-4 shadow rounded">
      <h3>Trend</h3>
      <LineChart width={400} height={300} data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="positive" stroke="green" />
        <Line type="monotone" dataKey="negative" stroke="red" />
        <Line type="monotone" dataKey="neutral" stroke="gray" />
      </LineChart>
    </div>
  );
};

export default SentimentTrend;