import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Increment view count
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid question ID" },
        { status: 400 }
      );
    }

    // Increment view count
    await prisma.question.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({
      message: "View count incremented",
    });
  } catch (error) {
    console.error("Failed to increment view count:", error);
    // Don't fail the request if view increment fails
    return NextResponse.json(
      { error: "Failed to increment view count" },
      { status: 500 }
    );
  }
}
