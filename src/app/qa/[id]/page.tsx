"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import AnswerCard from "@/components/AnswerCard";
import AnswerForm from "@/components/AnswerForm";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import Link from "next/link";

type Answer = {
  id: number;
  content: string;
  isAccepted: boolean;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

type Question = {
  id: number;
  title: string;
  content: string;
  viewCount: number;
  isClosed: boolean;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  college?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  answers: Answer[];
  _count: {
    answers: number;
  };
};

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const questionId = parseInt(params.id as string);

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestion();
    incrementView();
  }, [questionId]);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/questions/${questionId}`);

      if (!response.ok) {
        throw new Error("Question not found");
      }

      const result = await response.json();
      setQuestion(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load question");
    } finally {
      setLoading(false);
    }
  };

  const incrementView = async () => {
    try {
      await fetch(`/api/questions/${questionId}/increment-view`, {
        method: "POST",
      });
    } catch (err) {
      // Silently fail - view count is not critical
    }
  };

  const handleAcceptAnswer = async (answerId: number) => {
    try {
      const response = await fetch(`/api/questions/${questionId}/accept-answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answerId }),
      });

      if (response.ok) {
        fetchQuestion(); // Refresh to show accepted answer
      } else {
        const data = await response.json();
        alert(data.error || "Failed to accept answer");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  const handleCloseQuestion = async () => {
    if (!confirm("Are you sure you want to close this question?")) {
      return;
    }

    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isClosed: true }),
      });

      if (response.ok) {
        fetchQuestion();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to close question");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  const handleDeleteQuestion = async () => {
    if (!confirm("Are you sure you want to delete this question? This cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/qa");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete question");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingState message="Loading question..." />
      </main>
    );
  }

  if (error || !question) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="mx-auto max-w-4xl px-6 py-10">
          <ErrorState message={error || "Question not found"} retry={fetchQuestion} />
        </div>
      </main>
    );
  }

  const isAuthor = session?.user?.id === question.user.id.toString();

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Question */}
        <div className="mb-6 rounded-xl border bg-white p-8 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <h1 className="flex-1 text-3xl font-bold text-black">{question.title}</h1>
            {question.isClosed && (
              <span className="ml-4 rounded-full bg-gray-200 px-4 py-1 text-sm font-medium text-gray-700">
                Closed
              </span>
            )}
          </div>

          {question.college && (
            <Link
              href={`/colleges/${question.college.slug}`}
              className="mb-4 inline-flex items-center rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              🏫 {question.college.name}
            </Link>
          )}

          <div className="mb-6 whitespace-pre-wrap text-gray-800">
            {question.content}
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>👤 {question.user.name}</span>
              <span>💬 {question._count.answers} answers</span>
              <span>👁️ {question.viewCount} views</span>
              <span>{new Date(question.createdAt).toLocaleDateString()}</span>
            </div>

            {isAuthor && (
              <div className="flex gap-2">
                {!question.isClosed && (
                  <button
                    onClick={handleCloseQuestion}
                    className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Close Question
                  </button>
                )}
                <button
                  onClick={handleDeleteQuestion}
                  className="rounded-lg border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Answers */}
        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-bold text-black">
            {question._count.answers} {question._count.answers === 1 ? "Answer" : "Answers"}
          </h2>

          <div className="space-y-4">
            {question.answers.map((answer) => (
              <AnswerCard
                key={answer.id}
                answer={answer}
                isQuestionAuthor={isAuthor}
                currentUserId={session?.user?.id || null}
                onAccept={handleAcceptAnswer}
              />
            ))}
          </div>

          {question.answers.length === 0 && (
            <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
              No answers yet. Be the first to answer!
            </div>
          )}
        </div>

        {/* Answer Form */}
        {session && !question.isClosed && (
          <div className="rounded-xl border bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-black">Your Answer</h2>
            <AnswerForm questionId={question.id} onAnswerSubmitted={fetchQuestion} />
          </div>
        )}

        {!session && (
          <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
            <p className="mb-4 text-gray-600">
              Please log in to answer this question
            </p>
            <button
              onClick={() => router.push(`/login?callbackUrl=/qa/${questionId}`)}
              className="rounded-lg bg-black px-6 py-2 text-white hover:bg-gray-800"
            >
              Log In
            </button>
          </div>
        )}

        {question.isClosed && (
          <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-6 text-center">
            <p className="text-yellow-800">
              This question is closed and no longer accepting new answers.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
