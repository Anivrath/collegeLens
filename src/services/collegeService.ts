import { prisma } from "@/lib/prisma";
import type { CollegeQuery } from "@/lib/validation";

export async function getColleges(query: CollegeQuery) {
  const { search, city, minFees, maxFees, minRating, sort, page, limit } = query;

  const where: any = {};

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  if (city) {
    where.city = { equals: city, mode: "insensitive" };
  }

  if (minFees !== undefined || maxFees !== undefined) {
    where.fees = {};
    if (minFees !== undefined) where.fees.gte = minFees;
    if (maxFees !== undefined) where.fees.lte = maxFees;
  }

  if (minRating !== undefined) {
    where.rating = { gte: minRating };
  }

  const orderByMap: Record<string, any> = {
    rating_desc: { rating: "desc" },
    fees_asc: { fees: "asc" },
    fees_desc: { fees: "desc" },
  };

  const orderBy = orderByMap[sort || "rating_desc"] || { id: "asc" };
  const skip = (page - 1) * limit;

  const [colleges, total] = await Promise.all([
    prisma.college.findMany({ where, orderBy, skip, take: limit }),
    prisma.college.count({ where }),
  ]);

  return {
    data: colleges,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getCollegeBySlug(slug: string) {
  return await prisma.college.findUnique({
    where: { slug },
    include: {
      courses: true,
      placements: { orderBy: { year: "desc" } },
      reviews: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function getCollegesByIds(ids: number[]) {
  return await prisma.college.findMany({
    where: { id: { in: ids } },
    include: { placements: { orderBy: { year: "desc" }, take: 1 } },
  });
}
