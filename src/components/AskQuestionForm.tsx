"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type College = {
  id: number;
  name: string;
  slug: string;
};

export default function AskQuestionForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [collegeId, setCollegeId] = useState<number | null>(null);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch colleges for dropdown
    async function fetchColleges() {
      try {
        const response = await fetch("/api/colleges");
        if (response.ok) {
          const result = await response.json();
          setColleges(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch colleges:", err);
      }
    }

    fetchColleges();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          collegeId: collegeId || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/qa/${data.data.id}`);
      } else {
        setError(data.error || "Failed to create question");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Question Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you want to know?"
          required
          minLength={10}
          maxLength={200}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
        <p className="mt-1 text-xs text-gray-500">
          {title.length}/200 characters (minimum 10)
        </p>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Question Details <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Provide more details about your question..."
          required
          minLength={20}
          maxLength={5000}
          rows={8}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
        <p className="mt-1 text-xs text-gray-500">
          {content.length}/5000 characters (minimum 20)
        </p>
      </div>

      <div>
        <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-2">
          Related College (Optional)
        </label>
        <select
          id="college"
          value={collegeId || ""}
          onChange={(e) => setCollegeId(e.target.value ? parseInt(e.target.value) : null)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        >
          <option value="">General Question</option>
          {colleges.map((college) => (
            <option key={college.id} value={college.id}>
              {college.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading || title.length < 10 || content.length < 20}
          className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Posting..." : "Post Question"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-6 py-3 text-black hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
