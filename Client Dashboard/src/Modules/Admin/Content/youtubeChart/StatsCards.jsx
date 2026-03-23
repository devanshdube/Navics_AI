import React, { useEffect, useState } from "react";
import axios from "axios";

const StatsCards = ({ filters }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    fetchStats();
  }, [filters]);

  const fetchStats = async () => {
    const res = await axios.get("http://localhost:5555/auth/navics/auth/stats", {
      params: filters,
    });
    setData(res.data.data);
  };

  const active = filters.sentiment;

  return (
    <div className="grid grid-cols-4 gap-4">

      {/* Total */}
      <div className="bg-white p-4 shadow rounded border">
        <h4>Total</h4>
        <p className="text-xl font-bold">{data.total}</p>
      </div>

      {/* Positive */}
      <div
        className={`p-4 shadow rounded border transition 
        ${active === "positive" ? "bg-green-500 text-white scale-105" : "bg-green-100"}`}
      >
        <h4>Positive</h4>
        <p className="text-xl font-bold">{data.positive}</p>
      </div>

      {/* Negative */}
      <div
        className={`p-4 shadow rounded border transition 
        ${active === "negative" ? "bg-red-500 text-white scale-105" : "bg-red-100"}`}
      >
        <h4>Negative</h4>
        <p className="text-xl font-bold">{data.negative}</p>
      </div>

      {/* Neutral */}
      <div
        className={`p-4 shadow rounded border transition 
        ${active === "neutral" ? "bg-gray-500 text-white scale-105" : "bg-gray-100"}`}
      >
        <h4>Neutral</h4>
        <p className="text-xl font-bold">{data.neutral}</p>
      </div>

    </div>
  );
};

export default StatsCards;

// // StatsCards.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const StatsCards = ({ filters }) => {
//   const [data, setData] = useState({});

//   useEffect(() => {
//     fetchStats();
//   }, [filters]);

//   const fetchStats = async () => {
//     const res = await axios.get("http://localhost:5555/auth/navics/auth/stats", {
//       params: filters,
//     });
//     setData(res.data.data);
//   };

//   return (
//     <div className="grid grid-cols-4 gap-4">

//       <div className="bg-white p-4 shadow rounded">
//         <h4>Total</h4>
//         <p>{data.total}</p>
//       </div>

//       <div className="bg-green-100 p-4 shadow rounded">
//         <h4>Positive</h4>
//         <p>{data.positive}</p>
//       </div>

//       <div className="bg-red-100 p-4 shadow rounded">
//         <h4>Negative</h4>
//         <p>{data.negative}</p>
//       </div>

//       <div className="bg-gray-100 p-4 shadow rounded">
//         <h4>Neutral</h4>
//         <p>{data.neutral}</p>
//       </div>

//     </div>
//   );
// };

// export default StatsCards;