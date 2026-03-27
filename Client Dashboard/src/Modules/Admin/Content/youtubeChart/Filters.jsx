// // Filters.jsx
// import React from "react";

// const Filters = ({ filters, setFilters }) => {
//   return (
//     <div className="flex gap-4">

//       <input
//         type="date"
//         onChange={(e) =>
//           setFilters({ ...filters, startDate: e.target.value })
//         }
//         className="border p-2"
//       />

//       <input
//         type="date"
//         onChange={(e) =>
//           setFilters({ ...filters, endDate: e.target.value })
//         }
//         className="border p-2"
//       />

//       <select
//         onChange={(e) =>
//           setFilters({ ...filters, sentiment: e.target.value })
//         }
//         className="border p-2"
//       >
//         <option value="">All</option>
//         <option value="positive">Positive</option>
//         <option value="negative">Negative</option>
//         <option value="neutral">Neutral</option>
//       </select>

//     </div>
//   );
// };

// export default Filters;

import React from "react";

const Filters = ({ filters, setFilters }) => {
  return (
    <div className="flex gap-4">

      <input
        type="text"
        placeholder="Enter Video ID"
        value={filters.videoId || ""}
        onChange={(e) =>
          setFilters({ ...filters, videoId: e.target.value })
        }
        className="border p-2"
      />

      <input
        type="date"
        onChange={(e) =>
          setFilters({ ...filters, startDate: e.target.value })
        }
        className="border p-2"
      />

      <input
        type="date"
        onChange={(e) =>
          setFilters({ ...filters, endDate: e.target.value })
        }
        className="border p-2"
      />

      <select
        onChange={(e) =>
          setFilters({ ...filters, sentiment: e.target.value })
        }
        className="border p-2"
      >
        <option value="">All</option>
        <option value="positive">Positive</option>
        <option value="negative">Negative</option>
        <option value="neutral">Neutral</option>
      </select>

    </div>
  );
};

export default Filters;