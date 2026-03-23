// DashboardAnalytics.jsx
import React, { useState } from "react";
import Filters from "./youtubeChart/Filters";
import StatsCards from "./youtubeChart/StatsCards";
import SentimentBarChart from "./youtubeChart/SentimentBarChart";
import SentimentPieChart from "./youtubeChart/SentimentPieChart";
import SentimentTrend from "./youtubeChart/SentimentTrend";
import TopComments from "./youtubeChart/TopComments";

export default function YoutubeAnalytics() {
  const [filters, setFilters] = useState({});

  return (
    <div className="p-6 space-y-6">

      {/* Filters */}
      <Filters filters={filters} setFilters={setFilters} />

      {/* KPI Boxes */}
      <StatsCards filters={filters} />

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SentimentBarChart filters={filters} />
        <SentimentPieChart filters={filters} />
        <SentimentTrend filters={filters} />
        {/* <TopComments filters={filters} /> */}
      </div>

    </div>
  );
}