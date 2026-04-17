// TopComments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const TopComments = () => {
  const [data, setData] = useState([]);
  const company_id = useSelector((state) => state.user?.currentUser?.company_id);

  useEffect(() => {
    if (!company_id) return;
    fetchComments();
  }, [company_id]);

  const fetchComments = async () => {
    const res = await axios.get(`http://localhost:5555/auth/navics/companies/charts/getTopComments/${company_id}`);
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