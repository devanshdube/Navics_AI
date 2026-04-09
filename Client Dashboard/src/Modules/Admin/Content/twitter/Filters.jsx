import React from "react";

export default function Filters({ filters, setFilters }) {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-wrap gap-3 md:gap-4 mb-4 md:mb-6">
      {/* Start Date */}
      <input
        type="date"
        name="startDate"
        value={filters.startDate}
        onChange={handleChange}
        className="border p-2 rounded w-full sm:w-[48%] md:w-auto"
      />

      {/* End Date */}
      <input
        type="date"
        name="endDate"
        value={filters.endDate}
        onChange={handleChange}
        className="border p-2 rounded w-full sm:w-[48%] md:w-auto"
      />

      {/* Search */}
      <input
        type="text"
        name="search"
        placeholder="Search tweet..."
        value={filters.search}
        onChange={handleChange}
        className="border p-2 rounded w-full md:flex-1"
      />
    </div>
  );
}
