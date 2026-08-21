import { prisma } from "@/lib/prisma";
import type { CollegeQuery } from "@/lib/validation";

export async function getColleges(query: CollegeQuery) {
  const { search, city, minFees, maxFees, minRating, sort, page, limit } = query;

  // Build where clause
  const where: any = {};

  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  if (city) {
    where.city = {
      equals: city,
      mode: "insensitive",
    };
  }

  if (minFees !== undefined || maxFees !== undefined) {
    where.fees = {};
    if (minFees !== undefined) where.fees.gte = minFees;
    if (maxFees !== undefined) where.fees.lte = maxFees;
  }

  if (minRating !== undefined) {
    where.rating = {
      gte: minRating,
    };
  }

  // Build orderBy clause
  let orderBy: any = { id: "asc" };

  if (sort === "rating_desc") {
    orderBy = { rating: "desc" };
  } else if (sort === "fees_asc") {
    orderBy = { fees: "asc" };
  } else if (sort === "fees_desc") {
    orderBy = { fees: "desc" };
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Execute queries in parallel
  const [colleges, total] = await Promise.all([
    prisma.college.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.college.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: colleges,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

export async function getCollegeBySlug(slug: string) {
  const college = await prisma.college.findUnique({
    where: { slug },
    include: {
      courses: true,
      placements: {
        orderBy: { year: "desc" },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return college;
}

export async function getCollegesByIds(ids: number[]) {
  const colleges = await prisma.college.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    include: {
      placements: {
        orderBy: { year: "desc" },
        take: 1,
      },
    },
  });

  return colleges;
}
