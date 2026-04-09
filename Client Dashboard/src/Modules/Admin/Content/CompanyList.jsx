import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Search, X } from "lucide-react";
import InputField from "../../../Components/InputField";

const API_URL = "http://localhost:5555/auth/navics/auth/getCompanies";
const USER_API = "http://localhost:5555/auth/navics/auth/company-users";
const LIMIT = 5;

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);

  const [companyUsers, setCompanyUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");

  const scrollContainerRef = useRef(null);
  const observerTarget = useRef(null);
  const isFirstRender = useRef(true);

  // searchTerm change hone pe debounce ke baad reset karke page 1 se fetch karo
  const searchRef = useRef(searchTerm);
  searchRef.current = searchTerm;

  // ─── Core fetch function ───────────────────────────────────────────────────
  const fetchCompanies = useCallback(async (pageNum, search, isNewSearch) => {
    try {
      if (pageNum === 1) setIsFetching(true);
      else setIsLoadingMore(true);

      setError(null);

      const res = await axios.get(API_URL, {
        params: { page: pageNum, limit: LIMIT, search: search || "" },
      });

      const { data, pagination } = res.data;

      setCompanies((prev) => (isNewSearch ? data : [...prev, ...data]));
      setTotal(pagination.total);
      setHasMore(pagination.hasMore);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsFetching(false);
      setIsLoadingMore(false);
    }
  }, []);

  // ─── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    fetchCompanies(1, "", true);
  }, [fetchCompanies]);

  // ─── Search — debounce 400ms, reset to page 1 ─────────────────────────────
  // Search — skip first render
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // ← initial load pe search effect ignore karo
    }
    const timer = setTimeout(() => {
      setPage(1);
      setCompanies([]);
      fetchCompanies(1, searchTerm, true);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, fetchCompanies]);
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setPage(1);
  //     setCompanies([]);
  //     fetchCompanies(1, searchTerm, true);
  //   }, 400);

  //   return () => clearTimeout(timer);
  // }, [searchTerm, fetchCompanies]);

  // ─── Infinite scroll — page change hone pe fetch ──────────────────────────
  useEffect(() => {
    if (page === 1) return; // initial load already handled above
    fetchCompanies(page, searchRef.current, false);
  }, [page, fetchCompanies]);

  // ─── IntersectionObserver — ref se scroll container ───────────────────────
  useEffect(() => {
    const container = scrollContainerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoadingMore &&
          !isFetching
        ) {
          setPage((prev) => prev + 1); // yahan se page++ → useEffect fetch trigger karega
        }
      },
      { root: container, rootMargin: "100px", threshold: 0.1 },
    );

    const target = observerTarget.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
      observer.disconnect();
    };
  }, [hasMore, isLoadingMore, isFetching]);

  // ─── Fetch users for modal ─────────────────────────────────────────────────
  const fetchUsers = async (company) => {
    try {
      setIsModalLoading(true);
      setIsModalOpen(true);
      setSelectedCompanyName(company.company_name);
      setCompanyUsers([]);

      const res = await axios.get(`${USER_API}/${company.id}`);
      setCompanyUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsModalLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Company List</h3>
          <button
            onClick={() => {
              setPage(1);
              setCompanies([]);
              fetchCompanies(1, searchTerm, true);
            }}
            disabled={isFetching}
            className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm"
          >
            {isFetching ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="space-y-4">
          <InputField
            placeholder="Search company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />

          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded"
            >
              <X size={18} /> Reset
            </button>
          )}

          <span className="text-sm text-gray-600">
            Showing {companies.length} of {total}
          </span>
        </div>
      </div>

      {/* Table */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto"
        style={{ maxHeight: "290px", overflowY: "auto" }}
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
            {companies.map((company) => (
              <tr key={company.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">
                  {company.company_name}
                </td>
                <td className="px-4 py-3">{company.total_user_count}</td>
                <td
                  className="px-4 py-3 text-blue-600 cursor-pointer"
                  onClick={() => fetchUsers(company)}
                >
                  {company.available_users}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(isFetching || isLoadingMore) && (
          <div className="flex justify-center py-4 text-gray-500 text-sm">
            Loading...
          </div>
        )}

        {/* Observer target — yahi element screen me aane pe next page load hogi */}
        <div ref={observerTarget} className="h-4" />

        {!hasMore && companies.length > 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No more companies
          </div>
        )}

        {companies.length === 0 && !isFetching && (
          <div className="text-center py-8 text-gray-500">
            No companies found
          </div>
        )}

        {error && <div className="text-center py-4 text-red-600">{error}</div>}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-4xl rounded-lg shadow-lg">
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
            <div className="p-4 max-h-[400px] overflow-y-auto">
              {isModalLoading ? (
                <div className="flex justify-center py-10 text-gray-500">
                  Loading users...
                </div>
              ) : (
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
                        <td
                          colSpan="5"
                          className="text-center p-4 text-gray-500"
                        >
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyList;
