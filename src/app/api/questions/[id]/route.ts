import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

// GET - Get a single question with answers
export async function GET(
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

    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        college: {
          select: { id: true, name: true, slug: true },
        },
        answers: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: [
            { isAccepted: "desc" }, // Accepted answer first
            { createdAt: "asc" },   // Then chronological
          ],
        },
        _count: {
          select: { answers: true },
        },
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: question });
  } catch (error) {
    console.error("Failed to fetch question:", error);
    return NextResponse.json(
      { error: "Failed to fetch question" },
      { status: 500 }
    );
  }
}

// PATCH - Update question (only by author, for closing)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: idStr } = await params;
    const id = parseInt(idStr);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid question ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { isClosed } = body;

    // Get question and verify ownership
    const question = await prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    if (question.userId !== parseInt(user.id)) {
      return NextResponse.json(
        { error: "Forbidden: You can only update your own questions" },
        { status: 403 }
      );
    }

    // Update question
    const updated = await prisma.question.update({
      where: { id },
      data: { isClosed: isClosed ?? question.isClosed },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        college: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return NextResponse.json({
      message: "Question updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Failed to update question:", error);
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }
}

// DELETE - Delete question (only by author)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: idStr } = await params;
    const id = parseInt(idStr);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid question ID" },
        { status: 400 }
      );
    }

    // Get question and verify ownership
    const question = await prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    if (question.userId !== parseInt(user.id)) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own questions" },
        { status: 403 }
      );
    }

    // Delete question (answers will be cascade deleted via Prisma schema)
    await prisma.question.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete question:", error);
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    );
  }
}
