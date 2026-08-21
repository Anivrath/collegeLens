"use client";

import { useState } from "react";

type AnswerFormProps = {
  questionId: number;
  onAnswerSubmitted: () => void;
};

export default function AnswerForm({ questionId, onAnswerSubmitted }: AnswerFormProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/questions/${questionId}/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (response.ok) {
        setContent("");
        onAnswerSubmitted();
      } else {
        setError(data.error || "Failed to post answer");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
          Your Answer <span className="text-red-500">*</span>
        </label>
        <textarea
          id="answer"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your knowledge and help others..."
          required
          minLength={20}
          maxLength={5000}
          rows={6}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
        <p className="mt-1 text-xs text-gray-500">
          {content.length}/5000 characters (minimum 20)
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || content.length < 20}
        className="rounded-lg bg-black px-6 py-2 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Posting..." : "Post Answer"}
      </button>
    </form>
  );
}
