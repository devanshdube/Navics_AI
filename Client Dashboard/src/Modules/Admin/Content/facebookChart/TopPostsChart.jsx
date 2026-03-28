import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function TopPostsChart({ filters }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5555/auth/navics/auth/getTopPosts", { params: filters })
      .then(res => setData(res.data));
  }, [filters]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3>Top 10 Posts</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="postname" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="likes" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}