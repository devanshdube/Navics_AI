import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Filters({ filters, setFilters }) {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5555/auth/navics/auth/getPages")
      .then(res => setPages(res.data));
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <select name="page" value={filters.page || ""}  onChange={handleChange} className="border p-2 rounded">
        <option value="">All Pages</option>
        {pages.map(p => (
          <option key={p.page_name} value={p.page_name}>{p.page_name}</option>
        ))}
      </select>

      <select name="sort" onChange={handleChange} className="border p-2 rounded">
        <option value="likes">Sort by Likes</option>
        <option value="comments">Sort by Comments</option>
        <option value="shares">Sort by Shares</option>
      </select>
    </div>
  );
}