import { prisma } from "@/lib/prisma";
import type { PredictorRequest } from "@/lib/validation";

export async function predictColleges(input: PredictorRequest) {
  const { exam, rank, category, course } = input;

  const cutoffs = await prisma.cutoff.findMany({
    where: { exam, category, course },
    include: { college: true },
    orderBy: { cutoffRank: "asc" },
  });

  const predictions = cutoffs
    .filter((c) => rank <= c.cutoffRank * 1.1)
    .map((c) => ({
      college: {
        ...c.college,
        fees: Number(c.college.fees),
      },
      cutoffRank: c.cutoffRank,
      year: c.year,
      probability: rank <= c.cutoffRank ? "High" : "Moderate",
    }));

  return predictions;
}
