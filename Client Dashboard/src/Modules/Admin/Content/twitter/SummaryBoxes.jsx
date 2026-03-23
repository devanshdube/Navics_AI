import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SummaryBoxes({ filters }) {
  const [data, setData] = useState({});

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    const res = await axios.get("http://localhost:5555/auth/navics/auth/summary", {
      params: filters
    });
    setData(res.data.data);
  };

  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      <div className="bg-white p-4 shadow">Views: {data?.total_views}</div>
      <div className="bg-white p-4 shadow">Likes: {data?.total_likes}</div>
      <div className="bg-white p-4 shadow">Retweet: {data?.total_retweet}</div>
      <div className="bg-white p-4 shadow">Replies: {data?.total_replies}</div>
      <div className="bg-white p-4 shadow">Quotes: {data?.total_quotes}</div>
    </div>
  );
}