import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Search, X, Mail, MessageSquare, Calendar } from "lucide-react";
import InputField from "../../../Components/InputField";

const API_URL = "http://localhost:5555/auth/navics/companies/getContacts";
const LIMIT = 10;

const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState(null);

    const scrollContainerRef = useRef(null);
    const observerTarget = useRef(null);
    const isFirstRender = useRef(true);

    // searchTerm ka latest value observer ke liye
    const searchRef = useRef(searchTerm);
    searchRef.current = searchTerm;

    // ─── Core fetch function ───────────────────────────────────────────────────
    const fetchContacts = useCallback(async (pageNum, search, isNewSearch) => {
        try {
            if (pageNum === 1) setIsFetching(true);
            else setIsLoadingMore(true);

            setError(null);

            const res = await axios.get(API_URL, {
                params: { page: pageNum, limit: LIMIT, search: search || "" },
            });

            const { data, pagination } = res.data;

            setContacts((prev) => (isNewSearch ? data : [...prev, ...data]));
            setTotal(pagination.total);
            setHasMore(pagination.hasMore);
        } catch (err) {
            setError(err?.response?.data?.message || err.message);
        } finally {
            setIsFetching(false);
            setIsLoadingMore(false);
        }
    }, []);

    // ─── Initial load ──────────────────────────────────────────────────────────
    useEffect(() => {
        fetchContacts(1, "", true);
    }, [fetchContacts]);

    // ─── Search — debounce 400ms, reset to page 1 ─────────────────────────────
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timer = setTimeout(() => {
            setPage(1);
            setContacts([]);
            fetchContacts(1, searchTerm, true);
        }, 400);

        return () => clearTimeout(timer);
    }, [searchTerm, fetchContacts]);

    // ─── Infinite scroll — page change hone pe fetch ──────────────────────────
    useEffect(() => {
        if (page === 1) return;
        fetchContacts(page, searchRef.current, false);
    }, [page, fetchContacts]);

    // ─── IntersectionObserver — scroll container ke andar observe ─────────────
    useEffect(() => {
        const container = scrollContainerRef.current;
        const target = observerTarget.current;
        if (!target || !container) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasMore &&
                    !isLoadingMore &&
                    !isFetching
                ) {
                    setPage((prev) => prev + 1);
                }
            },
            { root: container, rootMargin: "80px", threshold: 0.1 }
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [hasMore, isLoadingMore, isFetching]);

    // ─── Refresh handler ───────────────────────────────────────────────────────
    const handleRefresh = () => {
        setPage(1);
        setContacts([]);
        fetchContacts(1, searchTerm, true);
    };

    return (
        <div className="bg-white rounded-lg shadow mb-6">
            {/* Header */}
            <div className="p-4 border-b">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Contact List</h3>
                    <button
                        onClick={handleRefresh}
                        disabled={isFetching}
                        className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm"
                    >
                        {isFetching ? "Refreshing..." : "Refresh"}
                    </button>
                </div>

                <div className="space-y-3">
                    <InputField
                        placeholder="Search by name, email or message..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={Search}
                    />

                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm"
                        >
                            <X size={16} /> Reset Search
                        </button>
                    )}

                    <span className="text-sm text-gray-500">
                        Showing {contacts.length} of {total} contacts
                    </span>
                </div>
            </div>

            {/* Table */}
            <div
                ref={scrollContainerRef}
                className="overflow-x-auto"
                style={{ maxHeight: "350px", overflowY: "auto" }}
            >
                <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <span className="flex items-center gap-1">
                                    <Mail size={12} /> Email
                                </span>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <span className="flex items-center gap-1">
                                    <MessageSquare size={12} /> Message
                                </span>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <span className="flex items-center gap-1">
                                    <Calendar size={12} /> Date
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {contacts.map((contact) => (
                            <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                                    {contact.name}
                                </td>
                                <td className="px-4 py-3 text-blue-600 whitespace-nowrap">
                                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                                </td>
                                <td
                                    className="px-4 py-3 text-gray-600 max-w-xs truncate"
                                    title={contact.message}
                                >
                                    {contact.message}
                                </td>
                                <td className="px-4 py-3 text-gray-500 text-sm whitespace-nowrap">
                                    {contact.created_at || "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Loading states */}
                {(isFetching || isLoadingMore) && (
                    <div className="flex justify-center py-4 text-gray-500 text-sm">
                        Loading...
                    </div>
                )}

                {/* IntersectionObserver target — scroll ke end pe */}
                <div ref={observerTarget} style={{ height: "4px" }} />

                {!hasMore && contacts.length > 0 && (
                    <div className="text-center py-3 text-gray-400 text-sm">
                        All contacts loaded
                    </div>
                )}

                {contacts.length === 0 && !isFetching && (
                    <div className="text-center py-10 text-gray-500">
                        No contacts found
                    </div>
                )}

                {error && (
                    <div className="text-center py-4 text-red-500 text-sm">
                        Error: {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactList;
