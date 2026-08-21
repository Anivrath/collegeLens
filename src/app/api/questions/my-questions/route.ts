import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

// GET - Get all questions by the current user
export async function GET() {
  try {
    const userId = await requireUserId();

    const questions = await prisma.question.findMany({
      where: { userId },
      include: {
        college: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: { answers: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: questions });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Failed to fetch user questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
