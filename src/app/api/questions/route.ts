import { NextResponse } from "next/server";
import { requireUserId, getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// GET - Get all questions with filters and pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const collegeId = searchParams.get("collegeId");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isClosed: false,
    };

    if (collegeId) {
      where.collegeId = parseInt(collegeId);
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get questions with related data
    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          college: {
            select: { id: true, name: true, slug: true },
          },
          _count: {
            select: { answers: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.question.count({ where }),
    ]);

    return NextResponse.json({
      data: questions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

// POST - Create a new question
export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const body = await request.json();

    // Validate input
    const schema = z.object({
      title: z.string().min(10).max(200),
      content: z.string().min(20).max(5000),
      collegeId: z.number().int().positive().optional(),
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

    const { title, content, collegeId } = validationResult.data;

    // If collegeId provided, verify it exists
    if (collegeId) {
      const college = await prisma.college.findUnique({
        where: { id: collegeId },
      });

      if (!college) {
        return NextResponse.json(
          { error: "College not found" },
          { status: 404 }
        );
      }
    }

    // Create question
    const question = await prisma.question.create({
      data: {
        title,
        content,
        userId,
        collegeId,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        college: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Question created successfully",
        data: question,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Failed to create question:", error);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}
