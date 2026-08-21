"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import SaveCollegeButton from "@/components/SaveCollegeButton";

type Course = {
  id: number;
  name: string;
  duration: string;
  fees: number;
};

type Placement = {
  id: number;
  year: number;
  averagePackage: number;
  highestPackage: number;
  placementRate: number;
};

type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
};

type College = {
  id: number;
  name: string;
  slug: string;
  city: string;
  state: string;
  fees: number;
  rating: number;
  courses: Course[];
  placements: Placement[];
  reviews: Review[];
};

export default function CollegeDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCollege() {
      try {
        const response = await fetch(`/api/colleges/${slug}`);

        if (!response.ok) {
          throw new Error("College not found");
        }

        const result = await response.json();
        setCollege(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load college");
      } finally {
        setLoading(false);
      }
    }

    fetchCollege();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingState message="Loading college details..." />
      </main>
    );
  }

  if (error || !college) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="mx-auto max-w-4xl px-6 py-10">
          <ErrorState message={error || "College not found"} />
          <div className="mt-6 text-center">
            <a
              href="/colleges"
              className="inline-block rounded-lg bg-black px-6 py-2 text-white hover:bg-gray-800"
            >
              Back to Colleges
            </a>
          </div>
        </div>
      </main>
    );
  }

  const latestPlacement = college.placements[0];

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-black">{college.name}</h1>
          <p className="text-xl text-gray-600">
            {college.city}, {college.state}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600">Rating</p>
            <p className="mt-2 text-3xl font-bold text-black">
              {college.rating} ⭐
            </p>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600">Annual Fees</p>
            <p className="mt-2 text-3xl font-bold text-black">
              ₹{(college.fees / 100000).toFixed(2)}L
            </p>
          </div>

          {latestPlacement && (
            <>
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-600">Avg Package</p>
                <p className="mt-2 text-3xl font-bold text-black">
                  ₹{(latestPlacement.averagePackage / 100000).toFixed(2)}L
                </p>
              </div>

              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-600">Placement Rate</p>
                <p className="mt-2 text-3xl font-bold text-black">
                  {latestPlacement.placementRate.toFixed(0)}%
                </p>
              </div>
            </>
          )}
        </div>

        {/* Courses Section */}
        <section className="mb-8 rounded-xl border bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold text-black">Courses Offered</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {college.courses.map((course) => (
              <div key={course.id} className="rounded-lg border p-4">
                <h3 className="font-semibold text-black">{course.name}</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Duration: {course.duration}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Fees: ₹{(course.fees / 100000).toFixed(2)}L per year
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Placements Section */}
        <section className="mb-8 rounded-xl border bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold text-black">
            Placement Statistics
          </h2>
          <div className="space-y-4">
            {college.placements.map((placement) => (
              <div key={placement.id} className="rounded-lg border p-6">
                <h3 className="mb-4 text-lg font-semibold text-black">
                  Year {placement.year}
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-gray-600">Average Package</p>
                    <p className="mt-1 text-xl font-bold text-black">
                      ₹{(placement.averagePackage / 100000).toFixed(2)}L
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Highest Package</p>
                    <p className="mt-1 text-xl font-bold text-black">
                      ₹{(placement.highestPackage / 100000).toFixed(2)}L
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Placement Rate</p>
                    <p className="mt-1 text-xl font-bold text-black">
                      {placement.placementRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="mb-8 rounded-xl border bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold text-black">
            Student Reviews
          </h2>
          <div className="space-y-4">
            {college.reviews.map((review) => (
              <div key={review.id} className="rounded-lg border p-6">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xl font-bold text-black">
                    {review.rating}
                  </span>
                  <span className="text-xl">⭐</span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
                <p className="mt-2 text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <SaveCollegeButton collegeId={college.id} />
          <a
            href="/colleges"
            className="rounded-lg border border-gray-300 px-6 py-3 text-black hover:bg-gray-50"
          >
            Back to Colleges
          </a>
          <a
            href={`/compare?ids=${college.id}`}
            className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Compare with Others
          </a>
        </div>
      </div>
    </main>
  );
}
