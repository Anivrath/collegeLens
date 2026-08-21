import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// POST - Accept an answer (only by question author)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      answerId: z.number().int().positive(),
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

    const { answerId } = validationResult.data;

    // Get question and verify ownership
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { answers: true },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    if (question.userId !== parseInt(user.id)) {
      return NextResponse.json(
        { error: "Forbidden: Only the question author can accept answers" },
        { status: 403 }
      );
    }

    // Verify answer belongs to this question
    const answer = question.answers.find((a) => a.id === answerId);
    if (!answer) {
      return NextResponse.json(
        { error: "Answer not found for this question" },
        { status: 404 }
      );
    }

    // Unaccept all other answers for this question, then accept this one
    await prisma.$transaction([
      prisma.answer.updateMany({
        where: { questionId },
        data: { isAccepted: false },
      }),
      prisma.answer.update({
        where: { id: answerId },
        data: { isAccepted: true },
      }),
    ]);

    return NextResponse.json({
      message: "Answer accepted successfully",
    });
  } catch (error) {
    console.error("Failed to accept answer:", error);
    return NextResponse.json(
      { error: "Failed to accept answer" },
      { status: 500 }
    );
  }
}
