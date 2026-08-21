import { NextResponse } from "next/server";
import { predictorRequestSchema } from "@/lib/validation";
import { predictColleges } from "@/services/predictorService";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = predictorRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const predictions = await predictColleges(validationResult.data);

    return NextResponse.json({
      data: predictions,
      meta: {
        exam: validationResult.data.exam,
        rank: validationResult.data.rank,
        category: validationResult.data.category,
        course: validationResult.data.course,
        algorithm: "rule-based",
        disclaimer:
          "This is a deterministic prediction based on historical cutoff data. Actual admissions may vary.",
      },
    });
  } catch (error) {
    console.error("Failed to predict colleges:", error);

    return NextResponse.json(
      {
        error: "Failed to predict colleges",
      },
      { status: 500 }
    );
  }
}
