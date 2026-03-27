import React, { useState } from "react";
import Filters from "./twitter/Filters";
import SummaryBoxes from "./twitter/SummaryBoxes";
import Chart from "./twitter/Chart";
import TweetLikesChart from "./twitter/TweetLikesChart";
import TweetEngagementChart from "./twitter/TweetEngagementChart";
import TweetViewsBubbleChart from "./twitter/TweetViewsBubbleChart";

export default function DashboardTwitter() {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    search: "",
  });

  return (
    <div className="p-6 space-y-6">
      {/* Filters */}
      <Filters filters={filters} setFilters={setFilters} />

      {/* Summary Boxes */}
      <SummaryBoxes filters={filters} />

      {/* Charts Grid */}
        {/* Row 1 */}
        <TweetLikesChart filters={filters} />
        <TweetEngagementChart filters={filters} />

        {/* Row 2 */}
        <TweetViewsBubbleChart filters={filters} />

        {/* Empty box for balance (optional) */}
        {/* Trend Chart */}
        <div className="col-span-2">
          <Chart filters={filters} />
        </div>
    </div>
  );
}
