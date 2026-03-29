import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SummaryBoxes({ filters }) {
  const [data, setData] = useState({});

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    const res = await axios.get(
      "http://localhost:5555/auth/navics/auth/getInstaKPIs",
      { params: filters }
    );
    setData(res.data);
  };

  const box = "bg-white p-4 shadow text-center";

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className={box}>
        <h3>Total Posts</h3>
        <p className="text-xl font-bold">{data.totalPosts}</p>
      </div>

      <div className={box}>
        <h3>Total Likes</h3>
        <p className="text-xl font-bold">{data.totalLikes}</p>
      </div>

      <div className={box}>
        <h3>Total Comments</h3>
        <p className="text-xl font-bold">{data.totalComments}</p>
      </div>

      <div className={box}>
        <h3>Engagement Rate</h3>
        <p className="text-xl font-bold">{data.engagementRate}</p>
      </div>
    </div>
  );
}