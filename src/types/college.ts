// Type definitions for College and related models
export type College = {
  id: number;
  name: string;
  slug: string;
  city: string;
  state: string;
  fees: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Course = {
  id: number;
  name: string;
  duration: string;
  fees: number;
  collegeId: number;
  createdAt: Date;
};

export type Placement = {
  id: number;
  year: number;
  averagePackage: number;
  highestPackage: number;
  placementRate: number;
  collegeId: number;
  createdAt: Date;
};

export type Review = {
  id: number;
  rating: number;
  comment: string;
  collegeId: number;
  createdAt: Date;
};

export type Cutoff = {
  id: number;
  collegeId: number;
  exam: string;
  course: string;
  category: string;
  year: number;
  cutoffRank: number;
  createdAt: Date;
};

export type CollegeWithDetails = College & {
  courses: Course[];
  placements: Placement[];
  reviews: Review[];
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  data: T;
  pagination?: PaginationMeta;
};
