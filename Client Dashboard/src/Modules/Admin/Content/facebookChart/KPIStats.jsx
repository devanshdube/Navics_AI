import React, { useEffect, useState } from "react";
import axios from "axios";

export default function KPIStats({ filters }) {
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get("http://localhost:5555/auth/navics/auth/getKPI", { params: filters })
      .then(res => setData(res.data));
  }, [filters]);

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 shadow rounded">Posts: {data.total_posts}</div>
      <div className="bg-white p-4 shadow rounded">Likes: {data.total_likes}</div>
      <div className="bg-white p-4 shadow rounded">Comments: {data.total_comments}</div>
      <div className="bg-white p-4 shadow rounded">Shares: {data.total_shares}</div>
    </div>
  );
}