import React from "react";

export default function Filters({ filters, setFilters }) {

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex gap-4 mb-6">
      
      <input
        type="date"
        name="startDate"
        value={filters.startDate}
        onChange={handleChange}
        className="border p-2"
      />

      <input
        type="date"
        name="endDate"
        value={filters.endDate}
        onChange={handleChange}
        className="border p-2"
      />

      <input
        type="text"
        name="search"
        placeholder="Search tweet..."
        value={filters.search}
        onChange={handleChange}
        className="border p-2"
      />

    </div>
  );
}