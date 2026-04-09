import React, { useState } from "react";
import Filters from "./facebookChart/Filters";
import KPIStats from "./facebookChart/KPIStats";
import TopPostsChart from "./facebookChart/TopPostsChart";
import EngagementChart from "./facebookChart/EngagementChart";
import PostsOverTime from "./facebookChart/PostsOverTime";
import PageComparison from "./facebookChart/PageComparison";

export default function FacebookDashboard() {
  const [filters, setFilters] = useState({ page: "", sort: "likes" });

  return (
    <div className="p-3 sm:p-4 md:p-6">
      {/* Filters */}
      <Filters filters={filters} setFilters={setFilters} />

      {/* KPI Stats */}
      <KPIStats filters={filters} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <TopPostsChart filters={filters} />
        <EngagementChart filters={filters} />
        <PostsOverTime filters={filters} />
        <PageComparison filters={filters} />
      </div>
    </div>
  );
}