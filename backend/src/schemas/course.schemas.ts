import * as z from "zod";
import sanitizeHtml from "sanitize-html";

const sanitizeOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ["src", "alt"],
  },
};

export const createCourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .transform((val) =>
      sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} }),
    ),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .transform((val) => sanitizeHtml(val, sanitizeOptions)),
  shortDescription: z
    .string()
    .trim()
    .min(1, "Short description is required")
    .max(180, "Short description cannot exceed 180 characters")
    .transform((val) =>
      sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} }),
    ),
  domain: z.string().trim().min(1, "Domain is required"),
  price: z.number().min(0, "Price cannot be negative").default(0),
  language: z.enum(["en", "hi", "hinglish"]).default("en"),
  learningMode: z.enum(["live", "recorded", "hybrid"]).default("recorded"),
  level: z
    .enum(["beginner", "intermediate", "advanced", "all-levels"])
    .default("beginner"),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export const updateCourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .optional()
    .transform((val) =>
      val ? sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} }) : val,
    ),
  description: z
    .string()
    .trim()
    .min(1, "Description cannot be empty")
    .optional()
    .transform((val) => (val ? sanitizeHtml(val, sanitizeOptions) : val)),
  shortDescription: z
    .string()
    .trim()
    .min(1, "Short description cannot be empty")
    .max(180, "Short description cannot exceed 180 characters")
    .optional()
    .transform((val) =>
      val ? sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} }) : val,
    ),
  domain: z.string().trim().min(1, "Domain cannot be empty").optional(),
  price: z.number().min(0, "Price cannot be negative").optional(),
  language: z.enum(["en", "hi", "hinglish"]).optional(),
  learningMode: z.enum(["live", "recorded", "hybrid"]).optional(),
  level: z
    .enum(["beginner", "intermediate", "advanced", "all-levels"])
    .optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});
