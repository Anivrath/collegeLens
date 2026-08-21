import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// POST - Create an answer to a question
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireUserId();
    const { id: questionIdStr } = await params;
    const questionId = parseInt(questionIdStr);

    if (isNaN(questionId)) {
      return NextResponse.json(
        { error: "Invalid question ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate input
    const schema = z.object({
      content: z.string().min(20).max(5000),
    });

    const validationResult = schema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { content } = validationResult.data;

    // Verify question exists and is not closed
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    if (question.isClosed) {
      return NextResponse.json(
        { error: "Cannot answer a closed question" },
        { status: 403 }
      );
    }

    // Create answer
    const answer = await prisma.answer.create({
      data: {
        content,
        userId,
        questionId,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Answer created successfully",
        data: answer,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Failed to create answer:", error);
    return NextResponse.json(
      { error: "Failed to create answer" },
      { status: 500 }
    );
  }
}
