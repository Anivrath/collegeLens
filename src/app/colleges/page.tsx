"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import CollegeCard from "@/components/CollegeCard";
import Pagination from "@/components/Pagination";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";

type College = {
  id: number;
  name: string;
  slug: string;
  city: string;
  state: string;
  fees: number;
  rating: number;
};

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [minFees, setMinFees] = useState("");
  const [maxFees, setMaxFees] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sort, setSort] = useState("rating_desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 10;

  const fetchColleges = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (city) params.append("city", city);
      if (minFees) params.append("minFees", minFees);
      if (maxFees) params.append("maxFees", maxFees);
      if (minRating) params.append("minRating", minRating);
      params.append("sort", sort);
      params.append("page", currentPage.toString());
      params.append("limit", limit.toString());

      const response = await fetch(`/api/colleges?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch colleges");
      }

      const result = await response.json();
      setColleges(result.data);
      setTotalPages(result.pagination.totalPages);
      setTotal(result.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load colleges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, [search, city, minFees, maxFees, minRating, sort, currentPage]);

  const handleReset = () => {
    setSearch("");
    setCity("");
    setMinFees("");
    setMaxFees("");
    setMinRating("");
    setSort("rating_desc");
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-black">All Colleges</h1>
          <p className="text-gray-600">
            Browse and filter through {total} engineering colleges
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-black">Filters</h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Search */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Search College
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="e.g., RV College"
                className="w-full rounded-lg border px-4 py-2 text-black"
              />
            </div>

            {/* City */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                City
              </label>
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border px-4 py-2 text-black"
              >
                <option value="">All Cities</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Manipal">Manipal</option>
                <option value="Surathkal">Surathkal</option>
                <option value="Mangalore">Mangalore</option>
              </select>
            </div>

            {/* Min Fees */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Min Fees (₹)
              </label>
              <input
                type="number"
                value={minFees}
                onChange={(e) => {
                  setMinFees(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="e.g., 100000"
                className="w-full rounded-lg border px-4 py-2 text-black"
              />
            </div>

            {/* Max Fees */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Max Fees (₹)
              </label>
              <input
                type="number"
                value={maxFees}
                onChange={(e) => {
                  setMaxFees(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="e.g., 500000"
                className="w-full rounded-lg border px-4 py-2 text-black"
              />
            </div>

            {/* Min Rating */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Min Rating
              </label>
              <select
                value={minRating}
                onChange={(e) => {
                  setMinRating(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border px-4 py-2 text-black"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+</option>
                <option value="4.0">4.0+</option>
                <option value="3.5">3.5+</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Sort By
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-lg border px-4 py-2 text-black"
              >
                <option value="rating_desc">Rating (High to Low)</option>
                <option value="fees_asc">Fees (Low to High)</option>
                <option value="fees_desc">Fees (High to Low)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="mt-4 rounded-lg border border-gray-300 px-6 py-2 text-black hover:bg-gray-50"
          >
            Reset Filters
          </button>
        </div>

        {/* Results */}
        {loading && <LoadingState message="Loading colleges..." />}

        {error && <ErrorState message={error} retry={fetchColleges} />}

        {!loading && !error && colleges.length === 0 && (
          <EmptyState
            title="No Colleges Found"
            message="Try adjusting your filters to see more results"
            action={{ label: "Reset Filters", onClick: handleReset }}
          />
        )}

        {!loading && !error && colleges.length > 0 && (
          <>
            <div className="mb-8 grid gap-6 md:grid-cols-2">
              {colleges.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </section>
    </main>
  );
}
