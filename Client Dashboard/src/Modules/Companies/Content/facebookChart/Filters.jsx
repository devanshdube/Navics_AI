import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function Filters({ filters, setFilters }) {
  const [pages, setPages] = useState([]);
  const company_id = useSelector((state) => state.user?.currentUser?.company_id);

  useEffect(() => {
    console.log(`Facebok Company ID: ${company_id}`);
    if (!company_id) return;
    axios.get(`http://localhost:5555/auth/navics/companies/charts/pages/${company_id}`)
      .then(res => setPages(res.data));
  }, [company_id]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">

      {/* Page Filter */}
      <select
        name="page"
        value={filters.page || ""}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 sm:p-2.5 rounded-lg text-sm sm:text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">All Pages</option>
        {pages.map(p => (
          <option key={p.page_name} value={p.page_name}>{p.page_name}</option>
        ))}
      </select>

      {/* Sort Filter */}
      <select
        name="sort"
        value={filters.sort || "likes"}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 sm:p-2.5 rounded-lg text-sm sm:text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="likes">Sort by Likes</option>
        <option value="comments">Sort by Comments</option>
        <option value="shares">Sort by Shares</option>
      </select>

    </div>
  );
}