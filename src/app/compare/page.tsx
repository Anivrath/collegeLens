"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";

type College = {
  id: number;
  name: string;
  slug: string;
  city: string;
  state: string;
  fees: number;
  rating: number;
  placements: {
    averagePackage: number;
    highestPackage: number;
    placementRate: number;
  }[];
};

function CompareContent() {
  const searchParams = useSearchParams();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<College[]>([]);
  const [searching, setSearching] = useState(false);

  // Load initial colleges from URL
  useEffect(() => {
    const idsParam = searchParams.get("ids");
    if (idsParam) {
      const ids = idsParam.split(",").map(Number).filter((id) => !isNaN(id));
      if (ids.length > 0) {
        setSelectedIds(ids);
        fetchCompareColleges(ids);
      }
    }
  }, [searchParams]);

  const fetchCompareColleges = async (ids: number[]) => {
    if (ids.length === 0) {
      setColleges([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/colleges?limit=100`);
      if (!response.ok) throw new Error("Failed to fetch colleges");

      const result = await response.json();
      const filtered = result.data.filter((c: College) => ids.includes(c.id));
      setColleges(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load colleges");
    } finally {
      setLoading(false);
    }
  };

  const searchColleges = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const response = await fetch(`/api/colleges?search=${encodeURIComponent(term)}&limit=5`);
      if (!response.ok) throw new Error("Search failed");

      const result = await response.json();
      setSearchResults(result.data);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      searchColleges(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const addCollege = (id: number) => {
    if (selectedIds.includes(id)) return;
    if (selectedIds.length >= 3) {
      alert("You can only compare up to 3 colleges");
      return;
    }

    const newIds = [...selectedIds, id];
    setSelectedIds(newIds);
    fetchCompareColleges(newIds);
    setSearchTerm("");
    setSearchResults([]);
  };

  const removeCollege = (id: number) => {
    const newIds = selectedIds.filter((selectedId) => selectedId !== id);
    setSelectedIds(newIds);
    fetchCompareColleges(newIds);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-black">Compare Colleges</h1>
          <p className="text-gray-600">
            Select 2-3 colleges to compare their features side by side
          </p>
        </div>

        {/* College Search/Selection */}
        <div className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-black">
            Select Colleges ({selectedIds.length}/3)
          </h2>

          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search and add colleges..."
              className="w-full rounded-lg border px-4 py-3 text-black"
              disabled={selectedIds.length >= 3}
            />

            {searching && (
              <div className="absolute right-4 top-3">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="absolute z-10 mt-2 w-full rounded-lg border bg-white shadow-lg">
                {searchResults.map((college) => (
                  <button
                    key={college.id}
                    onClick={() => addCollege(college.id)}
                    disabled={selectedIds.includes(college.id)}
                    className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 disabled:opacity-50"
                  >
                    <div>
                      <p className="font-semibold text-black">{college.name}</p>
                      <p className="text-sm text-gray-600">
                        {college.city}, {college.state}
                      </p>
                    </div>
                    {selectedIds.includes(college.id) ? (
                      <span className="text-sm text-gray-500">Added</span>
                    ) : (
                      <span className="text-sm text-black">+ Add</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Colleges */}
          {colleges.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {colleges.map((college) => (
                <div
                  key={college.id}
                  className="flex items-center gap-2 rounded-lg border bg-gray-50 px-4 py-2"
                >
                  <span className="text-sm font-medium text-black">
                    {college.name}
                  </span>
                  <button
                    onClick={() => removeCollege(college.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comparison Results */}
        {loading && <LoadingState message="Loading comparison..." />}

        {error && <ErrorState message={error} retry={() => fetchCompareColleges(selectedIds)} />}

        {!loading && !error && colleges.length === 0 && (
          <EmptyState
            title="No Colleges Selected"
            message="Search and add 2-3 colleges above to start comparing"
          />
        )}

        {!loading && !error && colleges.length === 1 && (
          <EmptyState
            title="Add More Colleges"
            message="Add at least one more college to start comparing"
          />
        )}

        {!loading && !error && colleges.length >= 2 && (
          <div className="rounded-xl border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-6 text-left text-sm font-semibold text-gray-900">
                      Feature
                    </th>
                    {colleges.map((college) => (
                      <th
                        key={college.id}
                        className="p-6 text-left text-sm font-semibold text-gray-900"
                      >
                        {college.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-6 font-medium text-gray-700">Location</td>
                    {colleges.map((college) => (
                      <td key={college.id} className="p-6 text-black">
                        {college.city}, {college.state}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b">
                    <td className="p-6 font-medium text-gray-700">Rating</td>
                    {colleges.map((college) => (
                      <td key={college.id} className="p-6 text-black">
                        {college.rating} ⭐
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b">
                    <td className="p-6 font-medium text-gray-700">Annual Fees</td>
                    {colleges.map((college) => (
                      <td key={college.id} className="p-6 text-black">
                        ₹{(college.fees / 100000).toFixed(2)}L
                      </td>
                    ))}
                  </tr>

                  {colleges.every((c) => c.placements && c.placements.length > 0) && (
                    <>
                      <tr className="border-b">
                        <td className="p-6 font-medium text-gray-700">
                          Average Package
                        </td>
                        {colleges.map((college) => (
                          <td key={college.id} className="p-6 text-black">
                            ₹
                            {(
                              college.placements[0].averagePackage / 100000
                            ).toFixed(2)}
                            L
                          </td>
                        ))}
                      </tr>

                      <tr className="border-b">
                        <td className="p-6 font-medium text-gray-700">
                          Highest Package
                        </td>
                        {colleges.map((college) => (
                          <td key={college.id} className="p-6 text-black">
                            ₹
                            {(
                              college.placements[0].highestPackage / 100000
                            ).toFixed(2)}
                            L
                          </td>
                        ))}
                      </tr>

                      <tr className="border-b">
                        <td className="p-6 font-medium text-gray-700">
                          Placement Rate
                        </td>
                        {colleges.map((college) => (
                          <td key={college.id} className="p-6 text-black">
                            {college.placements[0].placementRate.toFixed(1)}%
                          </td>
                        ))}
                      </tr>
                    </>
                  )}

                  <tr>
                    <td className="p-6 font-medium text-gray-700">Actions</td>
                    {colleges.map((college) => (
                      <td key={college.id} className="p-6">
                        <a
                          href={`/colleges/${college.slug}`}
                          className="inline-block rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
                        >
                          View Details
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<LoadingState message="Loading compare page..." />}>
      <CompareContent />
    </Suspense>
  );
}
