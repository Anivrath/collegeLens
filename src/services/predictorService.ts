import { prisma } from "@/lib/prisma";
import type { PredictorRequest } from "@/lib/validation";

export type PredictionResult = {
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

/**
 * Deterministic rank-based college predictor
 * 
 * Logic:
 * - Safe: Your rank is at least 20% better than cutoff
 * - Match: Your rank is within ±20% of cutoff
 * - Reach: Your rank is 20-50% worse than cutoff
 * 
 * This is NOT machine learning - it's rule-based matching for transparency.
 * Can be replaced with ML models later.
 */
export async function predictColleges(request: PredictorRequest) {
  const { exam, rank, category, course } = request;

  // Find all cutoffs matching the criteria
  const cutoffs = await prisma.cutoff.findMany({
    where: {
      exam,
      category,
      course,
      year: 2024, // Use latest year
    },
    include: {
      college: true,
    },
    orderBy: {
      cutoffRank: "asc",
    },
  });

  if (cutoffs.length === 0) {
    return {
      safe: [],
      match: [],
      reach: [],
      message: "No cutoff data available for the selected criteria",
    };
  }

  const predictions: PredictionResult[] = [];

  for (const cutoff of cutoffs) {
    const difference = rank - cutoff.cutoffRank;
    const percentDifference = (difference / cutoff.cutoffRank) * 100;

    let categoryLabel: "Safe" | "Match" | "Reach";

    if (percentDifference <= -20) {
      // Your rank is much better (lower number)
      categoryLabel = "Safe";
    } else if (percentDifference >= -20 && percentDifference <= 20) {
      // Your rank is close to cutoff
      categoryLabel = "Match";
    } else if (percentDifference > 20 && percentDifference <= 50) {
      // Your rank is slightly worse but still possible
      categoryLabel = "Reach";
    } else {
      // Rank is too far from cutoff, skip
      continue;
    }

    predictions.push({
      college: {
        id: cutoff.college.id,
        name: cutoff.college.name,
        slug: cutoff.college.slug,
        city: cutoff.college.city,
        state: cutoff.college.state,
        fees: cutoff.college.fees,
        rating: cutoff.college.rating,
      },
      cutoffRank: cutoff.cutoffRank,
      category: categoryLabel,
      difference,
    });
  }

  // Group by category
  const safe = predictions.filter((p) => p.category === "Safe");
  const match = predictions.filter((p) => p.category === "Match");
  const reach = predictions.filter((p) => p.category === "Reach");

  return {
    safe,
    match,
    reach,
    message: null,
  };
}
