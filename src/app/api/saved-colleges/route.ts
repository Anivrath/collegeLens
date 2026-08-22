import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// GET - Get all saved colleges for the current user
export async function GET() {
  try {
    const userId = await requireUserId();

    const savedColleges = await prisma.savedCollege.findMany({
      where: { userId },
      include: {
        college: {
          include: {
            placements: {
              orderBy: { year: "desc" },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Convert BigInt to Number for JSON serialization
    return NextResponse.json({
      data: savedColleges.map((sc) => ({
        id: sc.id,
        savedAt: sc.createdAt,
        college: {
          ...sc.college,
          fees: Number(sc.college.fees),
          placements: sc.college.placements.map((p) => ({
            ...p,
            averagePackage: Number(p.averagePackage),
            highestPackage: Number(p.highestPackage),
          })),
        },
      })),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Failed to fetch saved colleges:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved colleges" },
      { status: 500 }
    );
  }
}

// POST - Save a college
export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const body = await request.json();

    // Validate input
    const schema = z.object({
      collegeId: z.number().int().positive(),
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

    const { collegeId } = validationResult.data;

    // Check if college exists
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!college) {
      return NextResponse.json(
        { error: "College not found" },
        { status: 404 }
      );
    }

    // Check if already saved
    const existing = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId,
          collegeId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "College already saved" },
        { status: 409 }
      );
    }

    // Save college
    const savedCollege = await prisma.savedCollege.create({
      data: {
        userId,
        collegeId,
      },
      include: {
        college: true,
      },
    });

    // Convert BigInt to Number for JSON serialization
    return NextResponse.json(
      {
        message: "College saved successfully",
        data: {
          ...savedCollege,
          college: {
            ...savedCollege.college,
            fees: Number(savedCollege.college.fees),
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Failed to save college:", error);
    return NextResponse.json(
      { error: "Failed to save college" },
      { status: 500 }
    );
  }
}
