"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AskQuestionForm from "@/components/AskQuestionForm";
import LoadingState from "@/components/LoadingState";

export default function AskQuestionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/qa/ask");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingState message="Loading..." />
      </main>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-black">Ask a Question</h1>
          <p className="text-gray-600">
            Get help from the community by asking your question
          </p>
        </div>

        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <AskQuestionForm />
        </div>
      </div>
    </main>
  );
}
