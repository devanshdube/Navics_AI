import React, { useEffect, useState } from "react";
import {
  Home,
  ChevronsLeft,
  ChevronsRight,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/user/userSlice";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardContent from "./Content/DashboardContent";
import StudentList from "./Content/StudentList";

export default function DashboardAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // example path: /admin/users  -> we want "users"
    const parts = location.pathname.split("/").filter(Boolean); // ["admin","users"]
    const sub = parts[1] ?? ""; // undefined => ""
    if (!sub || sub === "") {
      setActiveMenu("dashboard");
    } else {
      setActiveMenu(sub);
    }
  }, [location.pathname]);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "students", label: "Students", icon: Users },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <DashboardContent />;
      case "students":
        return <StudentList />;
      default:
        return <DashboardContent />;
    }
  };

  const currentUser = useSelector((state) => state.user.currentUser);

  const handleLogout = () => {
    setIsLoggingOut(true);

    setTimeout(() => {
      dispatch(logout());
      localStorage.removeItem("token");
      navigate("/");
    }, 1200); // Fake loading (1.2 sec)
  };

  const onMenuClick = (id) => {
    setActiveMenu(id);
    // build path: dashboard -> /admin  ; others -> /admin/:id
    const path = id === "dashboard" ? "/admin" : `/admin/${id}`;
    // only push if different to avoid extra history entries
    if (location.pathname !== path) navigate(path);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-[#ffffff] to-[#ffffff] text-white transition-all duration-300 ease-in-out flex flex-col`}
      >
        {/* Sidebar Header */}
        <div
          className="p-4 flex items-center justify-between border-b"
          style={{ borderColor: "#0e1726" }}
        >
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-[#707070]">AEGIS</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-[#e3f9e9] transition-colors"
          >
            {sidebarOpen ? (
              <ChevronsLeft size={24} color="#2bc155" />
            ) : (
              <ChevronsRight size={24} color="#2bc155" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onMenuClick(item.id)}
                    className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all ${
                      activeMenu === item.id
                        ? "bg-[#fe634e] text-white shadow-lg"
                        : "hover:bg-[#ffe5e0] text-gray-700"
                    }`}
                  >
                    <Icon size={24} />
                    {sidebarOpen && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#ffd3cd]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#ffd3cd] text-[#fe634e] flex items-center justify-center font-bold">
              {currentUser?.name?.charAt(0) || "U"}
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-medium text-sm text-[#fe634e]">
                  {currentUser?.name || "User"}
                </p>
                <p className="text-xs text-[#fe634e]">{currentUser?.email}</p>
              </div>
            )}
          </div>

          {/* ✅ Logout Button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 bg-[#fe634e] hover:bg-[#b86d63] text-white px-4 py-2 rounded-lg backdrop-blur-md transition"
          >
            <ShieldCheck size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div
            className="bg-[#ffd3cd] p-6 rounded-2xl shadow-xl w-full max-w-sm text-white 
      border border-[#8a9097]/40 animate-slideUp"
          >
            <h2 className="text-xl font-semibold mb-2 text-[#fe634e]">
              Are you sure?
            </h2>
            <p className="text-[#852e23] mb-6">
              Do you really want to logout from your account?
            </p>

            <div className="flex justify-end gap-3">
              {/* Cancel */}
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg bg-[#707070] hover:bg-[#707070] transition"
              >
                Cancel
              </button>

              {/* Logout + Loading */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`px-4 py-2 rounded-lg transition 
          ${
            isLoggingOut
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[#2bc155] hover:bg-[#2bc155]"
          }`}
              >
                {isLoggingOut ? "Logging out..." : "Yes, Logout"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <h2 className="hidden sm:block text-2xl font-bold text-gray-800 capitalize">
              {activeMenu}
            </h2>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
      </div>
    </div>
  );
}
