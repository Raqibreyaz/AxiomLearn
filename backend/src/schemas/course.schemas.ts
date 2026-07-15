import * as z from "zod";

export const createCourseSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  shortDescription: z
    .string()
    .trim()
    .min(1, "Short description is required")
    .max(180, "Short description cannot exceed 180 characters"),
  domain: z.string().trim().min(1, "Domain is required"),
  price: z.number().min(0, "Price cannot be negative").default(0),
  language: z.enum(["en", "hi", "hinglish"]).default("en"),
  learningMode: z.enum(["live", "recorded", "hybrid"]).default("recorded"),
  level: z.enum(["beginner", "intermediate", "advanced", "all-levels"]).default("beginner"),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export const updateCourseSchema = z.object({
  title: z.string().trim().min(1, "Title cannot be empty").optional(),
  description: z.string().trim().min(1, "Description cannot be empty").optional(),
  shortDescription: z
    .string()
    .trim()
    .min(1, "Short description cannot be empty")
    .max(180, "Short description cannot exceed 180 characters")
    .optional(),
  domain: z.string().trim().min(1, "Domain cannot be empty").optional(),
  price: z.number().min(0, "Price cannot be negative").optional(),
  language: z.enum(["en", "hi", "hinglish"]).optional(),
  learningMode: z.enum(["live", "recorded", "hybrid"]).optional(),
  level: z.enum(["beginner", "intermediate", "advanced", "all-levels"]).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});
