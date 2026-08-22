"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

type PredictionResult = {
  college: {
    id: number;
    name: string;
    slug: string;
    city: string;
    state: string;
    fees: number;
    rating: number;
  };
  cutoffRank: number;
  category: "Safe" | "Match" | "Reach";
  difference: number;
};

type PredictionResponse = {
  safe: PredictionResult[];
  match: PredictionResult[];
  reach: PredictionResult[];
  message: string | null;
};

export default function PredictorPage() {
  const [exam, setExam] = useState("KCET");
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState("General");
  const [course, setCourse] = useState("Computer Science");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<PredictionResponse | null>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rank || isNaN(Number(rank)) || Number(rank) <= 0) {
      alert("Please enter a valid rank");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setPredictions(null);

      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exam,
          rank: Number(rank),
          category,
          course,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Prediction failed");
      }

      const result = await response.json();
      
      // Transform API response to match expected format
      const data = result.data || [];
      const transformedPredictions: PredictionResponse = {
        safe: [],
        match: [],
        reach: [],
        message: data.length === 0 ? "No colleges found matching your criteria" : null,
      };

      // Categorize predictions based on probability
      data.forEach((pred: any) => {
        const transformed = {
          college: pred.college,
          cutoffRank: pred.cutoffRank,
          category: pred.probability === "High" ? "Safe" as const : "Match" as const,
          difference: pred.cutoffRank - Number(rank),
        };

        if (pred.probability === "High") {
          transformedPredictions.safe.push(transformed);
        } else {
          transformedPredictions.match.push(transformed);
        }
      });

      setPredictions(transformedPredictions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to predict colleges");
    } finally {
      setLoading(false);
    }
  };

  const renderPredictionCard = (result: PredictionResult) => (
    <div
      key={result.college.id}
      className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md"
    >
      <h3 className="mb-2 text-lg font-bold text-black">
        {result.college.name}
      </h3>
      <p className="mb-4 text-sm text-gray-600">
        {result.college.city}, {result.college.state}
      </p>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Cutoff Rank</p>
          <p className="text-lg font-semibold text-black">{result.cutoffRank}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Rating</p>
          <p className="text-lg font-semibold text-black">
            {result.college.rating} ⭐
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Annual Fees</p>
          <p className="text-lg font-semibold text-black">
            ₹{(result.college.fees / 100000).toFixed(2)}L
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Rank Difference</p>
          <p className={`text-lg font-semibold ${result.difference < 0 ? 'text-green-600' : 'text-orange-600'}`}>
            {result.difference > 0 ? '+' : ''}{result.difference}
          </p>
        </div>
      </div>

      <a
        href={`/colleges/${result.college.slug}`}
        className="block rounded-lg bg-black py-2 text-center text-white hover:bg-gray-800"
      >
        View Details
      </a>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-black">
            College Rank Predictor
          </h1>
          <p className="text-gray-600">
            Enter your rank and preferences to find colleges you can get into
          </p>
        </div>

        {/* Predictor Form */}
        <div className="mb-8 rounded-xl border bg-white p-8 shadow-sm">
          <form onSubmit={handlePredict}>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Exam */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Exam <span className="text-red-600">*</span>
                </label>
                <select
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                  className="w-full rounded-lg border px-4 py-3 text-black"
                  required
                >
                  <option value="KCET">KCET</option>
                  <option value="COMEDK">COMEDK</option>
                </select>
              </div>

              {/* Rank */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Your Rank <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  placeholder="e.g., 23000"
                  className="w-full rounded-lg border px-4 py-3 text-black"
                  required
                  min="1"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category <span className="text-red-600">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border px-4 py-3 text-black"
                  required
                >
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="3A">3A</option>
                  <option value="3B">3B</option>
                  <option value="2A">2A</option>
                  <option value="2B">2B</option>
                </select>
              </div>

              {/* Course */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Preferred Course <span className="text-red-600">*</span>
                </label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full rounded-lg border px-4 py-3 text-black"
                  required
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Information Science">Information Science</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-black py-3 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Predicting..." : "Predict My Colleges"}
            </button>
          </form>
        </div>

        {/* Results */}
        {loading && <LoadingState message="Analyzing your rank..." />}

        {error && <ErrorState message={error} retry={() => setPredictions(null)} />}

        {predictions && predictions.message && (
          <div className="rounded-lg bg-yellow-50 p-6 text-center">
            <p className="text-yellow-900">{predictions.message}</p>
          </div>
        )}

        {predictions && !predictions.message && (
          <div className="space-y-8">
            {/* Safe Colleges */}
            {predictions.safe.length > 0 && (
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-600"></div>
                  <h2 className="text-2xl font-bold text-black">
                    Safe Choices ({predictions.safe.length})
                  </h2>
                </div>
                <p className="mb-4 text-gray-600">
                  Your rank is significantly better than the cutoff - high chance of
                  admission
                </p>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {predictions.safe.map(renderPredictionCard)}
                </div>
              </div>
            )}

            {/* Match Colleges */}
            {predictions.match.length > 0 && (
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  <h2 className="text-2xl font-bold text-black">
                    Good Matches ({predictions.match.length})
                  </h2>
                </div>
                <p className="mb-4 text-gray-600">
                  Your rank is close to the cutoff - moderate to good chance of
                  admission
                </p>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {predictions.match.map(renderPredictionCard)}
                </div>
              </div>
            )}

            {/* Reach Colleges */}
            {predictions.reach.length > 0 && (
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-orange-600"></div>
                  <h2 className="text-2xl font-bold text-black">
                    Reach Options ({predictions.reach.length})
                  </h2>
                </div>
                <p className="mb-4 text-gray-600">
                  Your rank is slightly below the cutoff - lower chance but worth
                  trying
                </p>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {predictions.reach.map(renderPredictionCard)}
                </div>
              </div>
            )}

            {predictions.safe.length === 0 &&
              predictions.match.length === 0 &&
              predictions.reach.length === 0 && (
                <div className="rounded-lg bg-gray-50 p-8 text-center">
                  <p className="text-gray-700">
                    No colleges found matching your criteria. Try adjusting your
                    filters or check back later for updated cutoff data.
                  </p>
                </div>
              )}
          </div>
        )}
      </div>
    </main>
  );
}
