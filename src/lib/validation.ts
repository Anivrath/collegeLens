import { z } from "zod";

// Auth validation
export const signupSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Query parameter validation for /api/colleges
export const collegeQuerySchema = z.object({
  search: z.string().optional(),
  city: z.string().optional(),
  minFees: z.coerce.number().nonnegative().optional(),
  maxFees: z.coerce.number().nonnegative().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum(["rating_desc", "fees_asc", "fees_desc"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CollegeQuery = z.infer<typeof collegeQuerySchema>;

// Predictor request validation
export const predictorRequestSchema = z.object({
  exam: z.string().min(1, "Exam is required"),
  rank: z.number().int().positive("Rank must be a positive integer"),
  category: z.string().min(1, "Category is required"),
  course: z.string().min(1, "Course is required"),
});

export type PredictorRequest = z.infer<typeof predictorRequestSchema>;

// Compare validation
export const compareQuerySchema = z.object({
  ids: z
    .string()
    .transform((val) => val.split(",").map(Number))
    .pipe(z.array(z.number().int().positive()).min(2).max(3)),
});

export type CompareQuery = z.infer<typeof compareQuerySchema>;

// Q&A validation
export const askQuestionSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(200),
  content: z.string().min(20, "Content must be at least 20 characters").max(5000),
  collegeId: z.number().int().positive().optional(),
});

export type AskQuestionInput = z.infer<typeof askQuestionSchema>;

export const answerQuestionSchema = z.object({
  content: z.string().min(10, "Answer must be at least 10 characters").max(5000),
});

export type AnswerQuestionInput = z.infer<typeof answerQuestionSchema>;

export const questionQuerySchema = z.object({
  search: z.string().optional(),
  collegeId: z.coerce.number().int().positive().optional(),
  sort: z.enum(["newest", "most_answers", "unanswered"]).optional().default("newest"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export type QuestionQuery = z.infer<typeof questionQuerySchema>;
