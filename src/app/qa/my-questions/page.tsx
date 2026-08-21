"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  college?: {
    name: string;
    slug: string;
  } | null;
  _count: {
    answers: number;
  };
};

export default function MyQuestionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/qa/my-questions");
      return;
    }

    if (status === "authenticated") {
      fetchQuestions();
    }
  }, [status, router]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/questions/my-questions");

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

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingState message="Loading your questions..." />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-black">My Questions</h1>
            <p className="text-gray-600">
              {questions.length} {questions.length === 1 ? "question" : "questions"} asked
            </p>
          </div>
          <button
            onClick={() => router.push("/qa/ask")}
            className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Ask Question
          </button>
        </div>

        {error && <ErrorState message={error} retry={fetchQuestions} />}

        {!error && questions.length === 0 && (
          <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
            <h3 className="mb-2 text-xl font-semibold text-black">
              No Questions Yet
            </h3>
            <p className="mb-6 text-gray-600">
              You haven't asked any questions yet. Start by asking your first question!
            </p>
            <button
              onClick={() => router.push("/qa/ask")}
              className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
            >
              Ask Question
            </button>
          </div>
        )}

        {!error && questions.length > 0 && (
          <div className="space-y-4">
            {questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={{
                  ...question,
                  user: { name: session?.user?.name || "You", email: session?.user?.email || "" },
                }}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
