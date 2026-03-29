import React, { useState } from "react";
import CommentsTrendChart from "./instagramChart/CommentsTrendChart";
import AvgLikesChart from "./instagramChart/AvgLikesChart";
import PostTypeChart from "./instagramChart/PostTypeChart";
import LikesChart from "./instagramChart/LikesChart";
import SummaryBoxes from "./instagramChart/SummaryBoxes";
import Filters from "./instagramChart/Filters";

export default function DashboardInstagram() {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: ""
  });

  return (
    <div className="p-6 space-y-6">
      {/* Filters */}
      <Filters filters={filters} setFilters={setFilters} />

      {/* KPI */}
      <SummaryBoxes filters={filters} />

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <LikesChart filters={filters} />
        <PostTypeChart filters={filters} />
        <AvgLikesChart filters={filters} />

        <div className="col-span-2">
          <CommentsTrendChart filters={filters} />
        </div>
      </div>
    </div>
  );
}