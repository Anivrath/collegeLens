import { NextResponse } from "next/server";
import { collegeQuerySchema } from "@/lib/validation";
import { getColleges } from "@/services/collegeService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Convert searchParams to object
    const queryObject: any = {};
    searchParams.forEach((value, key) => {
      queryObject[key] = value;
    });

    // Validate query parameters
    const validationResult = collegeQuerySchema.safeParse(queryObject);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const result = await getColleges(validationResult.data);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch colleges:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch colleges",
      },
      {
        status: 500,
      }
    );
  }
}