import React, { useState } from "react";
import Filters from "./facebookChart/Filters";
import KPIStats from "./facebookChart/KPIStats";
import TopPostsChart from "./facebookChart/TopPostsChart";
import EngagementChart from "./facebookChart/EngagementChart";
import PostsOverTime from "./facebookChart/PostsOverTime";
import PageComparison from "./facebookChart/PageComparison";
// import Filters from "./components/Filters";
// import KPIStats from "./components/KPIStats";
// import TopPostsChart from "./components/TopPostsChart";
// import EngagementChart from "./components/EngagementChart";
// import PostsOverTime from "./components/PostsOverTime";
// import PageComparison from "./components/PageComparison";

export default function FacebookDashboard() {
  const [filters, setFilters] = useState({});

  return (
    <div className="p-6">
      <Filters filters={filters} setFilters={setFilters} />

      {/* KPI */}
      <KPIStats filters={filters} />

      <div className="grid grid-cols-2 gap-6">
        <TopPostsChart filters={filters} />
        <EngagementChart filters={filters} />
        <PostsOverTime filters={filters} />
        <PageComparison filters={filters} />
      </div>
    </div>
  );
}