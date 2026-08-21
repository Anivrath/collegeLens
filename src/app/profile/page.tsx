import { requireAuth } from "@/lib/auth-utils";
import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const user = await requireAuth();
  
  if (!user.id) {
    throw new Error("User ID not found");
  }

  // Get user stats
  const userId = parseInt(user.id);
  const [savedCount, questionCount, answerCount] = await Promise.all([
    prisma.savedCollege.count({ where: { userId } }),
    prisma.question.count({ where: { userId } }),
    prisma.answer.count({ where: { userId } }),
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="mb-8 text-4xl font-bold text-black">My Profile</h1>

        {/* User Info */}
        <div className="mb-8 rounded-xl border bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black text-3xl font-bold text-white">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-black">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-6">
              <p className="text-sm text-gray-600">Saved Colleges</p>
              <p className="mt-2 text-3xl font-bold text-black">{savedCount}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-6">
              <p className="text-sm text-gray-600">Questions Asked</p>
              <p className="mt-2 text-3xl font-bold text-black">{questionCount}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-6">
              <p className="text-sm text-gray-600">Answers Given</p>
              <p className="mt-2 text-3xl font-bold text-black">{answerCount}</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid gap-4 md:grid-cols-2">
          <a
            href="/saved"
            className="rounded-lg border bg-white p-6 hover:shadow-md"
          >
            <h3 className="mb-2 text-xl font-bold text-black">Saved Colleges</h3>
            <p className="text-gray-600">View and manage your saved colleges</p>
          </a>

          <a
            href="/qa/my-questions"
            className="rounded-lg border bg-white p-6 hover:shadow-md"
          >
            <h3 className="mb-2 text-xl font-bold text-black">My Questions</h3>
            <p className="text-gray-600">Questions you've asked in Q&A</p>
          </a>

          <a
            href="/qa/my-answers"
            className="rounded-lg border bg-white p-6 hover:shadow-md"
          >
            <h3 className="mb-2 text-xl font-bold text-black">My Answers</h3>
            <p className="text-gray-600">Answers you've contributed</p>
          </a>

          <a
            href="/qa"
            className="rounded-lg border bg-white p-6 hover:shadow-md"
          >
            <h3 className="mb-2 text-xl font-bold text-black">Browse Q&A</h3>
            <p className="text-gray-600">Explore college discussions</p>
          </a>
        </div>
      </div>
    </main>
  );
}
