import React from "react";

export default function Filters({ filters, setFilters }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 shadow rounded-md">
      <input
        type="date"
        value={filters.startDate}
        onChange={(e) =>
          setFilters({ ...filters, startDate: e.target.value })
        }
        className="border p-2 rounded w-full sm:w-auto"
      />

      <input
        type="date"
        value={filters.endDate}
        onChange={(e) =>
          setFilters({ ...filters, endDate: e.target.value })
        }
        className="border p-2 rounded w-full sm:w-auto"
      />
    </div>
  );
}