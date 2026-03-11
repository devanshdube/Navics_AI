import React, { useState } from "react";
import axios from "axios";

export default function CompanyRegister() {
  const [activeTab, setActiveTab] = useState("company");
  const [companyData, setCompanyData] = useState({
    company_name: "", email: "", mobile: "", total_user_count: "", details: ""
  });
  const [userData, setUserData] = useState({
    company_id: "", employee_id: "", user_name: "", email: "", mobile: "", role: "", password: "", details: ""
  });

  const handleCompanyChange = (e) => setCompanyData({ ...companyData, [e.target.name]: e.target.value });
  const handleUserChange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value });

  const submitCompany = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5555/auth/navics/auth/registerClientCompany", companyData);
      alert(res.data.message);
       setCompanyData({ company_name: "", email: "", mobile: "", total_user_count: "", details: "" });
    } catch (err) { alert(err.response?.data?.message || "Error"); }
  };

  const submitUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5555/auth/navics/auth/registerCompanyUser", userData);
      alert(res.data.message);
      setUserData({ company_id: "", employee_id: "", user_name: "", email: "", mobile: "", role: "", password: "", details: "" });
    } catch (err) { alert(err.response?.data?.message || "Error"); }
  };

  const inputClass = `
    w-full bg-transparent border-0 border-b-2 border-slate-200 
    px-0 py-3 text-slate-800 placeholder-slate-400 text-sm font-light
    focus:outline-none focus:border-indigo-500 transition-colors duration-300
  `;

  const fields = {
    company: [
      { name: "company_name", placeholder: "Company Name", required: true, type: "text" },
      { name: "email", placeholder: "Email Address", type: "email" },
      { name: "mobile", placeholder: "Mobile Number", type: "tel" },
      { name: "total_user_count", placeholder: "Total User Count", type: "number" },
      { name: "details", placeholder: "Additional Details", type: "textarea" },
    ],
    user: [
      { name: "company_id", placeholder: "Company ID", required: true, type: "text" },
      { name: "employee_id", placeholder: "Employee ID", required: true, type: "text" },
      { name: "user_name", placeholder: "Full Name", required: true, type: "text" },
      { name: "email", placeholder: "Email Address", type: "email" },
      { name: "mobile", placeholder: "Mobile Number", type: "tel" },
      { name: "role", placeholder: "Role / Designation", required: true, type: "text" },
      { name: "password", placeholder: "Password", required: true, type: "password" },
      { name: "details", placeholder: "Additional Details", type: "textarea" },
    ]
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');
        .tab-indicator { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .form-field { animation: slideUp 0.4s ease forwards; opacity: 0; }
        @keyframes slideUp {
          from { transform: translateY(16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .submit-btn:hover .btn-arrow { transform: translateX(4px); }
        .btn-arrow { transition: transform 0.2s ease; display: inline-block; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>

      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap" />

      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="mb-10">
          {/* <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">Navics</span>
          </div> */}
          <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl text-slate-800 leading-tight">
            {activeTab === "company" ? "Register Company" : "Register User"}
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-light">
            {activeTab === "company" ? "Add a new client company to the platform." : "Create a new user under a company."}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-0 mb-10 bg-slate-100 p-1 rounded-xl relative">
          <div
            className="absolute top-1 bottom-1 w-1/2 bg-white rounded-lg shadow-sm tab-indicator"
            style={{ transform: activeTab === "company" ? "translateX(0)" : "translateX(100%)" }}
          />
          {["company", "user"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative z-10 flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors duration-300 ${
                activeTab === tab ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab === "company" ? "🏢 Company" : "👤 User"}
            </button>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200 p-8">
          <form onSubmit={activeTab === "company" ? submitCompany : submitUser} className="space-y-6">
            {fields[activeTab].map((field, i) => (
              <div
                key={field.name}
                className="form-field"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    value={activeTab === "company" ? companyData[field.name] : userData[field.name]}
                    placeholder={field.placeholder}
                    onChange={activeTab === "company" ? handleCompanyChange : handleUserChange}
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                ) : (
                  <input
                    name={field.name}
                    type={field.type}
                    value={activeTab === "company" ? companyData[field.name] : userData[field.name]}
                    placeholder={field.placeholder}
                    required={field.required}
                    onChange={activeTab === "company" ? handleCompanyChange : handleUserChange}
                    className={inputClass}
                  />
                )}
              </div>
            ))}

            <div className="pt-4">
              <button
                type="submit"
                className="submit-btn w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-6 rounded-xl font-medium text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
              >
                {activeTab === "company" ? "Register Company" : "Register User"}
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-slate-400 text-xs mt-6 font-light">
          Navics Client Management Platform
        </p>
      </div>
    </div>
  );
}