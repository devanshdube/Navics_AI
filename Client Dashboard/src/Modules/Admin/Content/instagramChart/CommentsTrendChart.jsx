import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function CommentsTrendChart({ filters }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    const res = await axios.get(
      "http://localhost:5555/auth/navics/auth/getCommentsTrend",
      { params: filters },
    );
    setData(res.data);
  };

  return (
    <div className="bg-white p-4 shadow h-[350px]">
      <h2 className="mb-2 font-semibold">Comments Trend</h2>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => value.split("T")[0]}
          />
          <YAxis />
          <Tooltip labelFormatter={(value) => value.split("T")[0]} />
          <Line type="monotone" dataKey="comments" stroke="#ef4444" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
