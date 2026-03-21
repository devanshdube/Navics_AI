import React, { useState } from "react";
import Filters from "./chart/Filters";
import RevenueRegion from "./chart/RevenueRegion";
import RevenueTrend from "./chart/RevenueTrend";
import RevenueCountry from "./chart/RevenueCountry";
import TargetVsRevenue from "./chart/TargetVsRevenue";

export default function DashboardAnalytics() {
  const [filters, setFilters] = useState({});

  return (
    <div className="p-6">
      <Filters filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-2 gap-6">
        <RevenueRegion filters={filters} />
        <RevenueTrend filters={filters} />
        <RevenueCountry filters={filters} />
        <TargetVsRevenue filters={filters} /> 
      </div>
    </div>
  );
}
