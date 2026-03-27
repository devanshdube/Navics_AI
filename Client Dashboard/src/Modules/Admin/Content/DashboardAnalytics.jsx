import React, { useState } from "react";
import Filters from "./chart/Filters";
import RevenueRegion from "./chart/RevenueRegion";
import RevenueTrend from "./chart/RevenueTrend";
import RevenueCountry from "./chart/RevenueCountry";
import TargetVsRevenue from "./chart/TargetVsRevenue";
import GeoAnalytics from "./chart/GeoAnalytics";
import GeoCouAnalytics from "./chart/GeoCouAnalytics";
import DashboardStats from "./chart/DashboardStats";

export default function DashboardAnalytics() {
  const [filters, setFilters] = useState({});

  return (
    <div className="p-6">
      <Filters filters={filters} setFilters={setFilters} />

      <DashboardStats filters={filters} /> 

      <div className="grid grid-cols-2 gap-6">
        <RevenueRegion filters={filters} />
        <RevenueTrend filters={filters} />
        <RevenueCountry filters={filters} />
        <TargetVsRevenue filters={filters} /> 
        <GeoAnalytics filters={filters} /> 
        {/* <GeoCouAnalytics filters={filters} />  */}
      </div>
    </div>
  );
}
