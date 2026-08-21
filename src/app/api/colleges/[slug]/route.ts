import { NextResponse } from "next/server";
import { getCollegeBySlug } from "@/services/collegeService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const college = await getCollegeBySlug(slug);

    if (!college) {
      return NextResponse.json(
        { error: "College not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: college,
    });
  } catch (error) {
    console.error("Failed to fetch college:", error);

    return NextResponse.json(
      { error: "Failed to fetch college" },
      { status: 500 }
    );
  }
}
