import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function PostsOverTime({ filters }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5555/auth/navics/auth/getPostsOverTime", { params: filters })
      .then(res => setData(res.data));
  }, [filters]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3>Posts Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total_posts" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}