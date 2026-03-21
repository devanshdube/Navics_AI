import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function CompanyRegister() {
  const [activeTab, setActiveTab] = useState("company");
  const [companyData, setCompanyData] = useState({
    company_name: "",
    email: "",
    mobile: "",
    total_user_count: "",
    details: "",
  });
  const [userData, setUserData] = useState({
    company_id: "",
    employee_id: "",
    user_name: "",
    email: "",
    mobile: "",
    role: "",
    password: "",
    details: "",
  });
  const [companies, setCompanies] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const dropdownRef = useRef(null);

  const handleCompanyChange = (e) =>
    setCompanyData({ ...companyData, [e.target.name]: e.target.value });
  const handleUserChange = (e) =>
    setUserData({ ...userData, [e.target.name]: e.target.value });

  const submitCompany = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5555/auth/navics/auth/registerClientCompany",
        companyData,
      );
      alert(res.data.message);
      setCompanyData({
        company_name: "",
        email: "",
        mobile: "",
        total_user_count: "",
        details: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const submitUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5555/auth/navics/auth/registerCompanyUser",
        userData,
      );
      alert(res.data.message);
      setUserData({
        company_id: "",
        employee_id: "",
        user_name: "",
        email: "",
        mobile: "",
        role: "",
        password: "",
        details: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const inputClass = `
    w-full bg-transparent border-0 border-b-2 border-slate-200 
    px-0 py-3 text-slate-800 placeholder-slate-400 text-sm font-light
    focus:outline-none focus:border-indigo-500 transition-colors duration-300
  `;

  const fields = {
    company: [
      {
        name: "company_name",
        placeholder: "Company Name",
        required: true,
        type: "text",
      },
      { name: "email", placeholder: "Email Address", type: "email" },
      { name: "mobile", placeholder: "Mobile Number", type: "tel" },
      {
        name: "total_user_count",
        placeholder: "Total User Count",
        type: "number",
      },
      { name: "details", placeholder: "Additional Details", type: "textarea" },
    ],
    user: [
      {
        name: "company_id",
        placeholder: "Select Company",
        required: true,
        type: "select",
      },
      {
        name: "employee_id",
        placeholder: "Employee ID",
        required: true,
        type: "text",
      },
      {
        name: "user_name",
        placeholder: "Full Name",
        required: true,
        type: "text",
      },
      { name: "email", placeholder: "Email Address", type: "email" },
      { name: "mobile", placeholder: "Mobile Number", type: "tel" },
      {
        name: "role",
        placeholder: "Role / Designation",
        required: true,
        type: "text",
      },
      {
        name: "password",
        placeholder: "Password",
        required: true,
        type: "password",
      },
      { name: "details", placeholder: "Additional Details", type: "textarea" },
    ],
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5555/auth/navics/auth/getAllCompanies",
      );
      setCompanies(res.data.data);
    } catch (error) {
      console.log("Error fetching companies");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6"
    >
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

      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap"
      />

      {/* <div className="w-full max-w-lg"> */}
      <div className="w-full max-w-4xl">
        {/* Header */}
        {/* <div className="mb-10"> */}
        <div className="mb-10 px-2">
          {/* <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">Navics</span>
          </div> */}
          <h1
            style={{ fontFamily: "'DM Serif Display', serif" }}
            className="text-4xl text-slate-800 leading-tight"
          >
            {activeTab === "company" ? "Register Company" : "Register User"}
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-light">
            {activeTab === "company"
              ? "Add a new client company to the platform."
              : "Create a new user under a company."}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-0 mb-10 bg-slate-100 p-1 rounded-xl relative">
          <div
            className="absolute top-1 bottom-1 w-1/2 bg-white rounded-lg shadow-sm tab-indicator"
            style={{
              transform:
                activeTab === "company" ? "translateX(0)" : "translateX(100%)",
            }}
          />
          {["company", "user"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative z-10 flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors duration-300 ${
                activeTab === tab
                  ? "text-orange-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab === "company" ? "🏢 Company" : "👤 User"}
            </button>
          ))}
        </div>

        {/* Form Card */}
        {/* <div className="bg-white rounded-2xl shadow-xl shadow-slate-200 p-8">
          <form
            onSubmit={activeTab === "company" ? submitCompany : submitUser}
            className="space-y-6"
          >
            {fields[activeTab].map((field, i) => (
              <div key={field.name}>
                {field.type === "select" ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="w-full flex items-center justify-between bg-transparent border-0 border-b-2 border-slate-200 px-0 py-3 text-sm font-light text-left focus:outline-none focus:border-orange-500 transition-colors duration-300"
                    >
                      <span
                        className={
                          selectedCompany ? "text-slate-800" : "text-slate-400"
                        }
                      >
                        {selectedCompany
                          ? selectedCompany.company_name
                          : "Select Company"}
                      </span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                
                    <input
                      type="hidden"
                      name="company_id"
                      value={userData.company_id}
                      required
                    />

                    {dropdownOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">
                  
                        <ul className="max-h-48 overflow-y-auto py-1 scrollbar-thin">
                          {companies.length === 0 ? (
                            <li className="px-4 py-3 text-sm text-slate-400 text-center">
                              No companies found
                            </li>
                          ) : (
                            companies.map((company) => (
                              <li
                                key={company.id}
                                onClick={() => {
                                  setSelectedCompany(company);
                                  setUserData({
                                    ...userData,
                                    company_id: company.id,
                                  });
                                  setDropdownOpen(false);
                                }}
                                className={`flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150
                  ${
                    userData.company_id === company.id
                      ? "bg-indigo-50 text-orange-600 font-medium"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                              >
                             
                                <div
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0
                  ${userData.company_id === company.id ? "bg-indigo-100 text-orange-500" : "bg-slate-100 text-slate-500"}`}
                                >
                                  {company.company_name
                                    ?.charAt(0)
                                    .toUpperCase()}
                                </div>
                                {company.company_name}

                            
                                {userData.company_id === company.id && (
                                  <svg
                                    className="ml-auto w-4 h-4 text-orange-500"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                  >
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                )}
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    value={
                      activeTab === "company"
                        ? companyData[field.name]
                        : userData[field.name]
                    }
                    placeholder={field.placeholder}
                    onChange={
                      activeTab === "company"
                        ? handleCompanyChange
                        : handleUserChange
                    }
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                ) : (
                  <input
                    name={field.name}
                    type={field.type}
                    value={
                      activeTab === "company"
                        ? companyData[field.name]
                        : userData[field.name]
                    }
                    placeholder={field.placeholder}
                    required={field.required}
                    onChange={
                      activeTab === "company"
                        ? handleCompanyChange
                        : handleUserChange
                    }
                    className={inputClass}
                  />
                )}
              </div>
            ))}

            <div className="pt-4">
              <button
                type="submit"
                className="submit-btn w-full bg-orange-600 hover:bg-orange-700 text-white py-3.5 px-6 rounded-xl font-medium text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
              >
                {activeTab === "company" ? "Register Company" : "Register User"}
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </form>
        </div> */}
        {/* Form Card */}
        {/* <div className="bg-white rounded-2xl shadow-xl shadow-slate-200 p-8"> */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200 p-10">
          <form onSubmit={activeTab === "company" ? submitCompany : submitUser}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-6">
              {fields[activeTab].map((field) => (
                <div
                  key={field.name}
                  className={
                    field.col === "full"
                      ? "col-span-2"
                      : "col-span-2 sm:col-span-1"
                  }
                >
                  {field.type === "select" ? (
                    <div className="relative" ref={dropdownRef}>
                      <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-full flex items-center justify-between bg-transparent border-0 border-b-2 border-slate-200 px-0 py-3 text-sm font-light text-left focus:outline-none focus:border-orange-500 transition-colors duration-300"
                      >
                        <span
                          className={
                            selectedCompany
                              ? "text-slate-800"
                              : "text-slate-400"
                          }
                        >
                          {selectedCompany
                            ? selectedCompany.company_name
                            : "Select Company"}
                        </span>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>

                      <input
                        type="hidden"
                        name="company_id"
                        value={userData.company_id}
                        required
                      />

                      {dropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">
                          <ul className="max-h-48 overflow-y-auto py-1">
                            {companies.length === 0 ? (
                              <li className="px-4 py-3 text-sm text-slate-400 text-center">
                                No companies found
                              </li>
                            ) : (
                              companies.map((company) => (
                                <li
                                  key={company.id}
                                  onClick={() => {
                                    setSelectedCompany(company);
                                    setUserData({
                                      ...userData,
                                      company_id: company.id,
                                    });
                                    setDropdownOpen(false);
                                  }}
                                  className={`flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150 ${
                                    userData.company_id === company.id
                                      ? "bg-orange-50 text-orange-600 font-medium"
                                      : "text-slate-600 hover:bg-slate-50"
                                  }`}
                                >
                                  <div
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                                      userData.company_id === company.id
                                        ? "bg-orange-100 text-orange-500"
                                        : "bg-slate-100 text-slate-500"
                                    }`}
                                  >
                                    {company.company_name
                                      ?.charAt(0)
                                      .toUpperCase()}
                                  </div>
                                  {company.company_name}
                                  {userData.company_id === company.id && (
                                    <svg
                                      className="ml-auto w-4 h-4 text-orange-500"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2.5"
                                    >
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  )}
                                </li>
                              ))
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      value={
                        activeTab === "company"
                          ? companyData[field.name]
                          : userData[field.name]
                      }
                      placeholder={field.placeholder}
                      onChange={
                        activeTab === "company"
                          ? handleCompanyChange
                          : handleUserChange
                      }
                      rows={3}
                      className={`${inputClass} resize-none`}
                    />
                  ) : (
                    <input
                      name={field.name}
                      type={field.type}
                      value={
                        activeTab === "company"
                          ? companyData[field.name]
                          : userData[field.name]
                      }
                      placeholder={field.placeholder}
                      required={field.required}
                      onChange={
                        activeTab === "company"
                          ? handleCompanyChange
                          : handleUserChange
                      }
                      className={inputClass}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="submit-btn w-full bg-orange-600 hover:bg-orange-700 text-white py-3.5 px-6 rounded-xl font-medium text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
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
