import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

function useKolkataDate() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const optsDate = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  };

  const optsTime = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
    timeZone: "Asia/Kolkata",
  };

  const optsHour = {
    hour: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  };

  const dateStr = new Intl.DateTimeFormat("en-US", optsDate).format(now);
  const timeStr = new Intl.DateTimeFormat("en-US", optsTime).format(now);
  const hourStr = new Intl.DateTimeFormat("en-GB", optsHour).format(now);
  const hour = Number(hourStr);

  return { dateStr, timeStr, hour };
}

export default function DashboardContent() {
  const { dateStr, timeStr, hour } = useKolkataDate();
  const currentUser = useSelector((state) => state.user.currentUser);

  const greeting = useMemo(() => {
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  }, [hour]);

  const displayName = currentUser?.name ?? "User";

  return (
    <div className="min-h-full flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-5xl text-center space-y-8">
        {/* Welcome Back */}
        <div className="animate-fadeIn">
          <p className="text-xl font-light text-gray-600 tracking-widest uppercase mb-2">
            Welcome Back
          </p>
        </div>

        {/* Greeting */}
        <div className="animate-slideDown">
          <h1
            className="text-7xl md:text-8xl font-bold tracking-tight"
            style={{ color: "#d97959f0" }}
          >
            {greeting}
          </h1>
        </div>

        {/* Name */}
        <div className="animate-slideUp">
          <h2 className="text-5xl md:text-6xl font-semibold text-gray-800">
            {displayName}
          </h2>
        </div>

        {/* Decorative Line */}
        <div className="flex justify-center my-8">
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
        </div>

        {/* Date & Day */}
        <div className="animate-fadeIn">
          <p className="text-3xl md:text-4xl font-medium text-gray-700">
            {dateStr}
          </p>
        </div>

        {/* Time */}
        <div className="animate-pulse-slow">
          <p
            className="text-6xl md:text-7xl font-bold tracking-wide"
            style={{ color: "#d97959f0" }}
          >
            {timeStr}
          </p>
          <p className="text-sm mt-3 text-gray-500 font-light">Asia/Kolkata</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-in;
        }
        .animate-slideDown {
          animation: slideDown 0.8s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.8s ease-out;
        }
        .animate-pulse-slow {
          animation: fadeIn 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}