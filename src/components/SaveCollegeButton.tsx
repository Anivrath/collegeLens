"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type SaveCollegeButtonProps = {
  collegeId: number;
  variant?: "default" | "icon";
};

export default function SaveCollegeButton({
  collegeId,
  variant = "default",
}: SaveCollegeButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check if college is already saved
  useEffect(() => {
    async function checkSaved() {
      if (status === "authenticated") {
        try {
          const response = await fetch("/api/saved-colleges");
          if (response.ok) {
            const data = await response.json();
            const saved = data.data.some(
              (sc: any) => sc.college.id === collegeId
            );
            setIsSaved(saved);
          }
        } catch (error) {
          console.error("Failed to check saved status:", error);
        }
      }
      setChecking(false);
    }

    checkSaved();
  }, [collegeId, status]);

  const handleClick = async () => {
    // Redirect to login if not authenticated
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setLoading(true);

    try {
      if (isSaved) {
        // Unsave
        const response = await fetch(`/api/saved-colleges/${collegeId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsSaved(false);
        } else {
          const data = await response.json();
          alert(data.error || "Failed to unsave college");
        }
      } else {
        // Save
        const response = await fetch("/api/saved-colleges", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ collegeId }),
        });

        if (response.ok) {
          setIsSaved(true);
        } else {
          const data = await response.json();
          if (response.status === 409) {
            setIsSaved(true); // Already saved
          } else {
            alert(data.error || "Failed to save college");
          }
        }
      }
    } catch (error) {
      console.error("Save/unsave error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return null; // or a skeleton loader
  }

  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className={`rounded-lg p-2 transition-colors ${
          isSaved
            ? "bg-black text-white hover:bg-gray-800"
            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
        } disabled:opacity-50`}
        title={isSaved ? "Unsave college" : "Save college"}
      >
        {loading ? (
          <span className="text-sm">...</span>
        ) : isSaved ? (
          <span className="text-lg">★</span>
        ) : (
          <span className="text-lg">☆</span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        isSaved
          ? "border border-black bg-black text-white hover:bg-gray-800"
          : "border border-gray-300 text-black hover:bg-gray-50"
      } disabled:opacity-50`}
    >
      {loading
        ? "..."
        : isSaved
        ? "Saved ✓"
        : "Save College"}
    </button>
  );
}
