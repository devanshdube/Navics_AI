import React from "react";

export default function Filters({ filters, setFilters }) {
  return (
    <div className="flex gap-4 bg-white p-4 shadow">
      <input
        type="date"
        value={filters.startDate}
        onChange={(e) =>
          setFilters({ ...filters, startDate: e.target.value })
        }
        className="border p-2"
      />

      <input
        type="date"
        value={filters.endDate}
        onChange={(e) =>
          setFilters({ ...filters, endDate: e.target.value })
        }
        className="border p-2"
      />
    </div>
  );
}