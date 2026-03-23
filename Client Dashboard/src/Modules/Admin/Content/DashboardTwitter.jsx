import React, { useState } from "react";
import Filters from "./twitter/Filters";
import SummaryBoxes from "./twitter/SummaryBoxes";
import Chart from "./twitter/Chart";

export default function DashboardTwitter() {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    search: ""
  });

  return (
    <div className="p-6">
      
      {/* Filters */}
      <Filters filters={filters} setFilters={setFilters} />

      {/* Summary Boxes */}
      <SummaryBoxes filters={filters} />

      {/* Chart */}
      <Chart filters={filters} />

    </div>
  );
}