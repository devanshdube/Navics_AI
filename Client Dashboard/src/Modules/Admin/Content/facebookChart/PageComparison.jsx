import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function PageComparison({ filters }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5555/auth/navics/auth/getPageComparison", { params: filters })
      .then(res => setData(res.data));
  }, [filters]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3>Page Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="page_name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="avg_likes" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}