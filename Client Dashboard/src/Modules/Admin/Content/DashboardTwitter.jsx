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

  const [twitterChatOpen, setTwitterChatOpen] = useState(false);

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Filters */}
      <Filters filters={filters} setFilters={setFilters} />

      {/* Summary Boxes */}
      <SummaryBoxes filters={filters} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <TweetLikesChart filters={filters} />
        <TweetEngagementChart filters={filters} />
        <TweetViewsBubbleChart filters={filters} />
        <Chart filters={filters} />
      </div>

      {/* Twitter Chat Panel (Full Screen Overlay) */}
      {twitterChatOpen && (
        <div className="fixed inset-0 bg-white z-40">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Twitter AI Chat</h3>
            <button
              onClick={() => setTwitterChatOpen(false)}
              className="text-red-500 font-bold text-lg"
            >
              ✕
            </button>
          </div>
          <iframe
            src="/twitter-chat.html"
            className="w-full h-[calc(100%-64px)] border-none"
            title="Twitter Chat"
          />
        </div>
      )}

      {/* Floating Twitter Chatbot Icon */}
      <div className="fixed right-6 top-[69%] -translate-y-1/2 z-40">
        <button
          onClick={() => setTwitterChatOpen(true)}
          className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition"
        >
          🤖
        </button>
      </div>
    </div>
  );
}



// import React, { useState } from "react";
// import Filters from "./twitter/Filters";
// import SummaryBoxes from "./twitter/SummaryBoxes";
// import Chart from "./twitter/Chart";
// import TweetLikesChart from "./twitter/TweetLikesChart";
// import TweetEngagementChart from "./twitter/TweetEngagementChart";
// import TweetViewsBubbleChart from "./twitter/TweetViewsBubbleChart";

// export default function DashboardTwitter() {
//   const [filters, setFilters] = useState({
//     startDate: "",
//     endDate: "",
//     search: "",
//   });

//   return (
//     <div className="p-4 md:p-6 space-y-4 md:space-y-6">
//       {/* Filters */}
//       <Filters filters={filters} setFilters={setFilters} />

//       {/* Summary Boxes */}
//       <SummaryBoxes filters={filters} />

//       {/* Charts Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//         {/* Row 1 */}
//         <TweetLikesChart filters={filters} />
//         <TweetEngagementChart filters={filters} />

//         {/* Row 2 */}
//         <TweetViewsBubbleChart filters={filters} />

//         <Chart filters={filters} />
//       </div>
//     </div>
//   );
// }
