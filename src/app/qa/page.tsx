"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import QuestionCard from "@/components/QuestionCard";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

type Question = {
  id: number;
  title: string;
  content: string;
  viewCount: number;
  isClosed: boolean;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  college?: {
    name: string;
    slug: string;
  } | null;
  _count: {
    answers: number;
  };
};

function QAContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [collegeFilter, setCollegeFilter] = useState(searchParams.get("collegeId") || "");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (collegeFilter) params.append("collegeId", collegeFilter);

      const response = await fetch(`/api/questions?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const result = await response.json();
      setQuestions(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuestions();
  };

  return (
    <>
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-black">Questions & Answers</h1>
            <p className="text-gray-600">
              Ask questions, share knowledge, and help the community
            </p>
          </div>
          {session && (
            <button
              onClick={() => router.push("/qa/ask")}
              className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
            >
              Ask Question
            </button>
          )}
        </div>

        {/* Search & Filter */}
        <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button
              type="submit"
              className="rounded-lg bg-black px-6 py-2 text-white hover:bg-gray-800"
            >
              Search
            </button>
          </form>
        </div>

        {/* Loading & Error States */}
        {loading && <LoadingState message="Loading questions..." />}
        {error && <ErrorState message={error} retry={fetchQuestions} />}

        {/* Questions List */}
        {!loading && !error && (
          <>
            {questions.length === 0 ? (
              <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
                <h3 className="mb-2 text-xl font-semibold text-black">
                  No Questions Found
                </h3>
                <p className="mb-6 text-gray-600">
                  {search
                    ? "Try adjusting your search terms"
                    : "Be the first to ask a question!"}
                </p>
                {session && (
                  <button
                    onClick={() => router.push("/qa/ask")}
                    className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
                  >
                    Ask Question
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default function QAPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <Suspense fallback={<LoadingState message="Loading questions..." />}>
        <QAContent />
      </Suspense>
    </main>
  );
}
