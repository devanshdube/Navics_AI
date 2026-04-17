import React from "react";

const Filters = ({ filters, setFilters }) => {
  return (
    <div className="flex flex-wrap gap-3 md:gap-4 mb-4">
      {/* Video ID */}
      <input
        type="text"
        placeholder="Enter Video ID"
        value={filters.videoId || ""}
        onChange={(e) => setFilters({ ...filters, videoId: e.target.value })}
        className="border p-2 rounded w-full sm:w-[48%] md:w-auto flex-1"
      />

      {/* Start Date */}
      <input
        type="date"
        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
        className="border p-2 rounded w-full sm:w-[48%] md:w-auto"
      />

      {/* End Date */}
      <input
        type="date"
        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
        className="border p-2 rounded w-full sm:w-[48%] md:w-auto"
      />

      {/* Sentiment */}
      <select
        onChange={(e) => setFilters({ ...filters, sentiment: e.target.value })}
        className="border p-2 rounded w-full sm:w-[48%] md:w-auto"
      >
        <option value="">All</option>
        <option value="positive">Positive</option>
        <option value="negative">Negative</option>
        <option value="neutral">Neutral</option>
      </select>
    </div>
  );
};

export default Filters;
