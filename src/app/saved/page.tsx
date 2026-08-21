"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";

type SavedCollege = {
  id: number;
  savedAt: string;
  college: {
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
};

export default function SavedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchSavedColleges();
    }
  }, [status, router]);

  const fetchSavedColleges = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/saved-colleges");

      if (!response.ok) {
        throw new Error("Failed to fetch saved colleges");
      }

      const result = await response.json();
      setSavedColleges(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load saved colleges");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (collegeId: number) => {
    try {
      const response = await fetch(`/api/saved-colleges/${collegeId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSavedColleges(savedColleges.filter((sc) => sc.college.id !== collegeId));
      } else {
        const data = await response.json();
        alert(data.error || "Failed to unsave college");
      }
    } catch (error) {
      console.error("Unsave error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingState message="Loading saved colleges..." />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-black">Saved Colleges</h1>
          <p className="text-gray-600">
            {savedColleges.length} {savedColleges.length === 1 ? "college" : "colleges"} saved
          </p>
        </div>

        {error && <ErrorState message={error} retry={fetchSavedColleges} />}

        {!error && savedColleges.length === 0 && (
          <EmptyState
            title="No Saved Colleges"
            message="Start exploring colleges and save your favorites to view them here."
            action={{
              label: "Browse Colleges",
              onClick: () => router.push("/colleges"),
            }}
          />
        )}

        {!error && savedColleges.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {savedColleges.map((sc) => (
              <div
                key={sc.id}
                className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-black">{sc.college.name}</h3>
                    <p className="text-gray-600">
                      {sc.college.city}, {sc.college.state}
                    </p>
                  </div>
                  <button
                    onClick={() => handleUnsave(sc.college.id)}
                    className="rounded-lg border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Annual Fees</p>
                    <p className="text-lg font-bold text-black">
                      ₹{(sc.college.fees / 100000).toFixed(2)}L
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="text-lg font-bold text-black">
                      {sc.college.rating} ⭐
                    </p>
                  </div>
                </div>

                {sc.college.placements.length > 0 && (
                  <div className="mb-4 rounded-lg bg-gray-50 p-4">
                    <p className="mb-2 text-sm font-medium text-gray-700">Latest Placements</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Avg Package</p>
                        <p className="font-semibold text-black">
                          ₹{(sc.college.placements[0].averagePackage / 100000).toFixed(2)}L
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Placement Rate</p>
                        <p className="font-semibold text-black">
                          {sc.college.placements[0].placementRate.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <a
                    href={`/colleges/${sc.college.slug}`}
                    className="flex-1 rounded-lg bg-black py-2 text-center text-sm text-white hover:bg-gray-800"
                  >
                    View Details
                  </a>
                  <a
                    href={`/compare?ids=${sc.college.id}`}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-black hover:bg-gray-50"
                  >
                    Compare
                  </a>
                </div>

                <p className="mt-4 text-xs text-gray-500">
                  Saved {new Date(sc.savedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
