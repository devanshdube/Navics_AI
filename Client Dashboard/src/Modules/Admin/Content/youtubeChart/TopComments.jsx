// TopComments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const TopComments = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const res = await axios.get("http://localhost:5555/auth/navics/auth/top-comments");
    setData(res.data.data);
  };

  return (
    <div className="bg-white p-4 shadow rounded">
      <h3>Top Comments</h3>

      {data.map((item, i) => (
        <p key={i}>
          {item.comment} ({item.like_count} 👍)
        </p>
      ))}
    </div>
  );
};

export default TopComments;