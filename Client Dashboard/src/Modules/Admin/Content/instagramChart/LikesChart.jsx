import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from "recharts";

export default function LikesChart({ filters }) {
  const [data, setData] = useState([]);

  useEffect(() => { fetchData(); }, [filters]);

  const fetchData = async () => {
    const res = await axios.get(
      "http://localhost:5555/auth/navics/auth/getLikesOverTime",
      { params: filters }
    );
    setData(res.data);
  };

  return (
    <div className="bg-white p-4 shadow h-[350px]">
      <h2 className="mb-2 font-semibold">Likes Over Time</h2>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="likes" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}