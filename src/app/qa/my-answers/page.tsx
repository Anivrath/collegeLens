"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

type Answer = {
  id: number;
  content: string;
  isAccepted: boolean;
  createdAt: string;
  question: {
    id: number;
    title: string;
    isClosed: boolean;
    college?: {
      name: string;
      slug: string;
    } | null;
    user: {
      name: string;
    };
  };
};

export default function MyAnswersPage() {
  const { status } = useSession();
  const router = useRouter();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/qa/my-answers");
      return;
    }

    if (status === "authenticated") {
      fetchAnswers();
    }
  }, [status, router]);

  const fetchAnswers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/questions/my-answers");

      if (!response.ok) {
        throw new Error("Failed to fetch answers");
      }

      const result = await response.json();
      setAnswers(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load answers");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingState message="Loading your answers..." />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-black">My Answers</h1>
          <p className="text-gray-600">
            {answers.length} {answers.length === 1 ? "answer" : "answers"} provided
          </p>
        </div>

        {error && <ErrorState message={error} retry={fetchAnswers} />}

        {!error && answers.length === 0 && (
          <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
            <h3 className="mb-2 text-xl font-semibold text-black">
              No Answers Yet
            </h3>
            <p className="mb-6 text-gray-600">
              You haven't answered any questions yet. Start helping the community!
            </p>
            <button
              onClick={() => router.push("/qa")}
              className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
            >
              Browse Questions
            </button>
          </div>
        )}

        {!error && answers.length > 0 && (
          <div className="space-y-4">
            {answers.map((answer) => (
              <div
                key={answer.id}
                className={`rounded-xl border p-6 shadow-sm ${
                  answer.isAccepted ? "border-green-500 bg-green-50" : "bg-white"
                }`}
              >
                {answer.isAccepted && (
                  <div className="mb-3 flex items-center gap-2 text-green-700">
                    <span className="text-xl">✓</span>
                    <span className="font-semibold">Accepted Answer</span>
                  </div>
                )}

                <Link
                  href={`/qa/${answer.question.id}`}
                  className="mb-2 block text-lg font-semibold text-black hover:underline"
                >
                  {answer.question.title}
                </Link>

                {answer.question.college && (
                  <div className="mb-3">
                    <span className="inline-flex items-center rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                      🏫 {answer.question.college.name}
                    </span>
                  </div>
                )}

                <div className="mb-4 line-clamp-3 whitespace-pre-wrap text-gray-700">
                  {answer.content}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Asked by {answer.question.user.name}</span>
                  <span>Answered on {new Date(answer.createdAt).toLocaleDateString()}</span>
                </div>

                <Link
                  href={`/qa/${answer.question.id}`}
                  className="mt-4 inline-block rounded-lg border border-gray-300 px-4 py-2 text-sm text-black hover:bg-gray-50"
                >
                  View Question
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
