import * as z from "zod";
import sanitizeHtml from "sanitize-html";

export const createSectionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .transform((val) =>
      sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} }),
    ),
  position: z.number().int().positive("Position must be a positive integer"),
});

export const updateSectionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .optional()
    .transform((val) =>
      val ? sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} }) : val,
    ),
  position: z
    .number()
    .int()
    .positive("Position must be a positive integer")
    .optional(),
});
