import Navbar from "@/components/Navbar";
import CollegeList from "@/components/CollegeList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h1 className="mb-6 text-5xl font-bold text-black">
            Find Your Perfect Engineering College
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            Explore colleges, compare options, and predict your chances based on your rank
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/colleges"
              className="rounded-lg bg-black px-8 py-3 text-white hover:bg-gray-800"
            >
              Browse Colleges
            </a>
            <a
              href="/predictor"
              className="rounded-lg border border-black px-8 py-3 text-black hover:bg-gray-50"
            >
              Predict My Colleges
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-10 text-center text-3xl font-bold text-black">
          Why Choose CollegeLens?
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-4 text-4xl">🔍</div>
            <h3 className="mb-2 text-xl font-bold text-black">
              Smart Search & Filters
            </h3>
            <p className="text-gray-600">
              Search colleges by name, city, fees range, and rating. Sort results to find exactly what you need.
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-4 text-4xl">⚖️</div>
            <h3 className="mb-2 text-xl font-bold text-black">
              Compare Colleges
            </h3>
            <p className="text-gray-600">
              Compare up to 3 colleges side-by-side with detailed metrics on fees, placements, and ratings.
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-4 text-4xl">🎯</div>
            <h3 className="mb-2 text-xl font-bold text-black">
              Rank Predictor
            </h3>
            <p className="text-gray-600">
              Enter your exam rank and get personalized college recommendations based on historical cutoffs.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Colleges Section */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="mb-6 text-2xl font-bold text-black">
          Top Rated Colleges
        </h2>
        <CollegeList />
      </section>
    </main>
  );
}