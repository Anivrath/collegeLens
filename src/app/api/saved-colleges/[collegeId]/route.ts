import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

// DELETE - Unsave a college
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ collegeId: string }> }
) {
  try {
    const userId = await requireUserId();
    const { collegeId: collegeIdStr } = await params;
    const collegeId = parseInt(collegeIdStr);

    if (isNaN(collegeId)) {
      return NextResponse.json(
        { error: "Invalid college ID" },
        { status: 400 }
      );
    }

    // Check if saved college exists
    const savedCollege = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId,
          collegeId,
        },
      },
    });

    if (!savedCollege) {
      return NextResponse.json(
        { error: "Saved college not found" },
        { status: 404 }
      );
    }

    // Delete saved college
    await prisma.savedCollege.delete({
      where: {
        id: savedCollege.id,
      },
    });

    return NextResponse.json({
      message: "College unsaved successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Failed to unsave college:", error);
    return NextResponse.json(
      { error: "Failed to unsave college" },
      { status: 500 }
    );
  }
}
