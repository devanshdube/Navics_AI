import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from "recharts";

export default function AvgLikesChart() {
  const [data, setData] = useState([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const res = await axios.get(
      "http://localhost:5555/auth/navics/auth/getAvgLikesByType"
    );
    setData(res.data);
  };

  return (
    <div className="bg-white p-4 shadow h-[350px]">
      <h2 className="mb-2 font-semibold">Avg Likes by Type</h2>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="avgLikes" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}