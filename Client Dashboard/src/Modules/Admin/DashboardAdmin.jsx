import React, { useEffect, useState } from "react";
import {
  Home,
  ChevronsLeft,
  ChevronsRight,
  ShieldCheck,
  Users,
  Building2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/user/userSlice";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardContent from "./Content/DashboardContent";
// import StudentList from "./Content/StudentList";
import CompanyRegister from "./Content/CompanyRegister";
import DashboardCharts from "./Content/DashboardCharts";
import DashboardAnalytics from "./Content/DashboardAnalytics";
import CompanyList from "./Content/CompanyList";
import YoutubeAnalytics from "./Content/YoutubeAnalytics";
import DashboardTwitter from "./Content/DashboardTwitter";

export default function DashboardAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMode, setChatMode] = useState("panel");
  const [formOpen, setFormOpen] = useState(false);
  // n8n chatbot state start
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  // n8n chatbot state end
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
    { id: "companyRegister", label: "Add Company", icon: Building2 },
    { id: "charts", label: "Charts", icon: Users },
    { id: "youcharts", label: "YouTube Charts", icon: Users },
    { id: "xcharts", label: "Twitter Charts", icon: Users },
    { id: "users", label: "User List", icon: Users },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <DashboardContent />;
      case "companyRegister":
        return <CompanyRegister />;
      case "charts":
        return <DashboardAnalytics />;
      case "youcharts":
        return <YoutubeAnalytics />;
      case "xcharts":
        return <DashboardTwitter />;
      case "users":
        return <CompanyList />;
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

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  // n8n chatbot CODE start =====================
  const WEBHOOK_URL =
    "https://n8n.navics.info/webhook/56ef24f7-5fbe-42c3-add8-dfb4dce257b7/chat";

  const getChatId = () => {
    let id = sessionStorage.getItem("chatId");
    if (!id) {
      id = "chat_" + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem("chatId", id);
    }
    return id;
  };

  const renderMarkdown = (text) => {
    if (!text) return "";

    // image
    text = text.replace(
      /!\[.*?\]\((.*?)\)/g,
      `<img src="$1" style="max-width:100%;margin-top:10px;border-radius:6px;">`,
    );

    return text.replace(/\n/g, "<br>");
  };

  const handleSend = async () => {
    if (!chatInput.trim()) return;

    const userMsg = { type: "user", text: chatInput };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: getChatId(),
          chatInput: chatInput,
        }),
      });

      const data = await res.json();
      const text = data.response || data.output || data.text || "No response";
      console.log(text);
      console.log(data);

      const botMsg = { type: "bot", text };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    }

    setChatInput("");
  };

  useEffect(() => {
    const el = document.getElementById("chat-body");
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (chatOpen) {
      setTimeout(() => {
        document.querySelector("input")?.focus();
      }, 100);
    }
  }, [chatOpen]);

  // n8n chatbot CODE end ========================

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
            <h1 className="text-xl font-bold text-[#707070]">NaviCS AI</h1>
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
      {/* <div className="flex-1 flex flex-col overflow-hidden"> */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
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
        {/* Form Panel (Full Screen) */}
        {formOpen && (
          <div className="absolute top-0 left-0 w-full h-full bg-white z-40">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Data Analysis Form</h3>

              <button
                onClick={() => setFormOpen(false)}
                className="text-red-500 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* 👉 OPTION 1: iframe (BEST for your case) */}
            <iframe
              src="/form.html" // ⚠️ public folder me form.html hona chahiye
              className="w-full h-[calc(100%-64px)] border-none"
              title="Form"
            />
          </div>
        )}
        {/* Chatbot Panel */}
        {chatOpen && (
          <div
            className={`absolute bg-white shadow-2xl z-30 border-l
            ${
              chatMode === "panel"
                ? "right-0 top-[64px] h-[calc(100%-64px)] w-[400px]"
                : "left-0 top-0 w-full h-full"
            }`}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">AI Assistant</h3>

              <button onClick={toggleChat} className="text-red-500 font-bold">
                ✕
              </button>
            </div>

            {/* <div className="p-4">Chatbot UI here</div> */}
            <div className="p-4 flex flex-col h-[calc(100%-64px)]">
              {/* Chat Body */}
              <div
                id="chat-body"
                className="flex-1 overflow-y-auto space-y-2 mb-3"
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded ${
                      msg.type === "user"
                        ? "bg-gray-100"
                        : "bg-[#ffe5e0] text-[#fe634e]"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(msg.text),
                    }}
                  />
                ))}
              </div>
              {/* <div
                id="chat-body"
                className="flex-1 overflow-y-auto space-y-2 mb-3"
              >
                <div className="bg-gray-100 p-2 rounded">
                  <strong>Hello NaviCS?</strong>
                </div>
                <div className="bg-[#854fff] text-white p-2 rounded">
                  Hi 👋, how can I help you?
                </div>
              </div> */}

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 border p-2 rounded"
                />

                <button
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  onClick={handleSend}
                  className="bg-[#fe634e] text-white px-4 rounded"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Floating Form Icon */}
      <div className="fixed right-6 top-[45%] z-40">
        <button
          onClick={() => {
            setChatOpen(false);
            setFormOpen(true);
          }}
          className="w-14 h-14 rounded-full bg-[#2bc155] text-white flex items-center justify-center shadow-lg hover:scale-110 transition"
        >
          📄
        </button>
      </div>
      {/* <div className="fixed right-6 bottom-24 z-40">
        <button
          onClick={() => {
            setChatOpen(false);
            setFormOpen(true);
          }}
          className="w-14 h-14 rounded-full bg-[#2bc155] text-white flex items-center justify-center shadow-lg hover:scale-110 transition"
        >
          📄
        </button>
      </div> */}
      {/* Floating Chatbot Icon */}
      {/* <div className="fixed right-6 bottom-6 z-40"> */}
      <div className="fixed right-6 top-[55%] z-40">
        <button
          onClick={() => {
            setFormOpen(false);
            setChatMode("panel");
            setChatOpen(true);
          }}
          onDoubleClick={() => {
            setFormOpen(false);
            setChatMode("full");
            setChatOpen(true);
          }}
          className="w-14 h-14 rounded-full bg-[#fe634e] text-white flex items-center justify-center shadow-lg hover:scale-110 transition"
        >
          💬
        </button>
      </div>
      {/* <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40">
        <button
          onClick={() => {
            setFormOpen(false);
            setChatMode("panel");
            setChatOpen(true);
          }}
          onDoubleClick={() => {
            setFormOpen(false);
            setChatMode("full");
            setChatOpen(true);
          }}
          className="w-14 h-14 rounded-full bg-[#fe634e] text-white flex items-center justify-center shadow-lg hover:scale-110 transition"
        >
          💬
        </button>
      </div> */}
    </div>
  );
}
