import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Search, X } from "lucide-react";
import InputField from "../../../Components/InputField";

const API_URL = "http://localhost:5555/auth/navics/auth/getCompanies";
const USER_API = "http://localhost:5555/auth/navics/auth/company-users";

const CHUNK_SIZE = 8;

const CompanyList = () => {

  const [allCompanies, setAllCompanies] = useState([]);
//   console.log(allCompanies);
  
  const [displayed, setDisplayed] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [error, setError] = useState(null);

  const [companyUsers, setCompanyUsers] = useState([]);
//   const [selectedCompany, setSelectedCompany] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");

  const observerTarget = useRef(null);
  const filteredRef = useRef([]);
  const displayedRef = useRef([]);

  // Fetch Companies
  const fetchCompanies = useCallback(async () => {

    try {

      setIsFetching(true);
      setError(null);

      const res = await axios.get(API_URL);

      if (Array.isArray(res?.data?.data)) {

        const companies = res.data.data;

        setAllCompanies(companies);

        filteredRef.current = companies;
        displayedRef.current = companies.slice(0, CHUNK_SIZE);

        setFiltered(companies);
        setDisplayed(companies.slice(0, CHUNK_SIZE));

        setHasMore(companies.length > CHUNK_SIZE);

      } else {

        setError("Invalid API response");

      }

    } catch (err) {

      setError(err.message);

    } finally {

      setIsFetching(false);

    }

  }, []);

  useEffect(() => {

    fetchCompanies();

  }, [fetchCompanies]);

  // Search filter
  useEffect(() => {

    let list = allCompanies.slice();

    if (searchTerm.trim()) {

      const q = searchTerm.toLowerCase();

      list = list.filter((item) => {

        const name = String(item.company_name || "").toLowerCase();

        return name.includes(q);

      });

    }

    filteredRef.current = list;
    displayedRef.current = list.slice(0, CHUNK_SIZE);

    setFiltered(list);
    setDisplayed(list.slice(0, CHUNK_SIZE));

    setHasMore(list.length > CHUNK_SIZE);

  }, [allCompanies, searchTerm]);

  // Load More (Infinite Scroll)
  const loadMore = useCallback(() => {

    if (isLoading || !hasMore) return;

    setIsLoading(true);

    setTimeout(() => {

      const currentLen = displayedRef.current.length;

      const nextChunk = filteredRef.current.slice(
        currentLen,
        currentLen + CHUNK_SIZE
      );

      if (nextChunk.length > 0) {

        const updated = [...displayedRef.current, ...nextChunk];

        displayedRef.current = updated;

        setDisplayed(updated);

        setHasMore(updated.length < filteredRef.current.length);

      } else {

        setHasMore(false);

      }

      setIsLoading(false);

    }, 300);

  }, [isLoading, hasMore]);

  // Intersection Observer
  useEffect(() => {

    const scrollContainer = document.querySelector(".user-scroll-container");

    const observer = new IntersectionObserver(

      (entries) => {

        if (entries[0].isIntersecting) {

          if (hasMore && !isLoading) loadMore();

        }

      },

      { root: scrollContainer, rootMargin: "150px", threshold: 0.1 }

    );

    const target = observerTarget.current;

    if (target) observer.observe(target);

    return () => {

      if (target) observer.unobserve(target);

      observer.disconnect();

    };

  }, [hasMore, isLoading, loadMore]);

  // Fetch Users by Company
  const fetchUsers = async (companyId) => {

    try {

      const res = await axios.get(`${USER_API}/${companyId}`);

      setCompanyUsers(res.data.data || []);
    //   setSelectedCompany(companyId);
      setSelectedCompanyName(allCompanies.company_name);
      console.log(`fetchUsers - ${companyId}`);
      

      setIsModalOpen(true);

    } catch (err) {

      console.log(err);

    }

  };

  const handleReset = () => {

    setSearchTerm("");

  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">

      <div className="p-4 border-b">

        <div className="flex justify-between items-center mb-4">

          <h3 className="text-xl font-bold text-gray-800">
            Company List
          </h3>

          <button
            onClick={() => fetchCompanies()}
            disabled={isFetching}
            className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm"
          >
            {isFetching ? "Refreshing..." : "Refresh"}
          </button>

        </div>

        {/* Search */}

        <div className="space-y-4">

          <InputField
            placeholder="Search company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />

          {searchTerm && (

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded"
            >
              <X size={18} />
              Reset
            </button>

          )}

          <span className="text-sm text-gray-600">
            Showing {displayed.length} of {filtered.length}
          </span>

        </div>

      </div>

      {/* Company Table */}

      <div
        className="overflow-x-auto user-scroll-container"
        style={{ maxHeight: "520px", overflowY: "auto" }}
      >

        <table className="w-full">

          <thead className="bg-gray-50 sticky top-0 z-10">

            <tr>

              <th className="px-4 py-3 text-left text-xs uppercase">
                Company Name
              </th>

              <th className="px-4 py-3 text-left text-xs uppercase">
                Total Users
              </th>

              <th className="px-4 py-3 text-left text-xs uppercase">
                Available Users
              </th>

            </tr>

          </thead>

          <tbody>

            {displayed.map((company) => (

              <tr key={company.id} className="hover:bg-gray-50">

                <td className="px-4 py-3 font-medium">
                  {company.company_name}
                </td>

                <td className="px-4 py-3">
                  {company.total_user_count}
                </td>

                <td
                  className="px-4 py-3 text-blue-600 cursor-pointer"
                  onClick={() => fetchUsers(company.id)}
                >
                  {company.available_users}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {isLoading && (
          <div className="flex justify-center py-4">
            Loading...
          </div>
        )}

        <div ref={observerTarget} className="h-4"></div>

        {!hasMore && displayed.length > 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No more companies
          </div>
        )}

        {displayed.length === 0 && !isFetching && (
          <div className="text-center py-8 text-gray-500">
            No companies found
          </div>
        )}

        {error && (
          <div className="text-center py-4 text-red-600">
            {error}
          </div>
        )}

      </div>

      {/* Users List */}

      {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

    <div className="bg-white w-[90%] max-w-4xl rounded-lg shadow-lg">

      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">

        <h2 className="text-lg font-semibold">
          {selectedCompanyName} - Users
        </h2>

        <button
          onClick={() => setIsModalOpen(false)}
          className="text-gray-500 hover:text-red-500"
        >
          ✕
        </button>

      </div>

      {/* Body */}
      <div className="p-4 max-h-[400px] overflow-y-auto">

        <table className="w-full">

          <thead className="bg-gray-100 sticky top-0">

            <tr>
              <th className="p-2 text-left">Employee ID</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Mobile</th>
              <th className="p-2 text-left">Role</th>
            </tr>

          </thead>

          <tbody>

            {companyUsers.length > 0 ? (

              companyUsers.map((user) => (
                <tr key={user.id} className="border-t">

                  <td className="p-2">{user.employee_id}</td>
                  <td className="p-2">{user.user_name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.mobile}</td>
                  <td className="p-2">{user.role}</td>

                </tr>
              ))

            ) : (

              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No users found
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  </div>
)}

      {/* {selectedCompany && (

        <div className="p-4 border-t">

          <h3 className="text-lg font-semibold mb-3">
            Company Users
          </h3>

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="px-4 py-2">Employee ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Mobile</th>
                <th className="px-4 py-2">Role</th>

              </tr>

            </thead>

            <tbody>

              {companyUsers.map((user) => (

                <tr key={user.id}>

                  <td className="px-4 py-2">{user.employee_id}</td>
                  <td className="px-4 py-2">{user.user_name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.mobile}</td>
                  <td className="px-4 py-2">{user.role}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )} */}

    </div>
  );
};

export default CompanyList;