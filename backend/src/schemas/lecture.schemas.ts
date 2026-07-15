import * as z from "zod";
import sanitizeHtml from "sanitize-html";

export const createLectureSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .transform((val) =>
      sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} }),
    ),
  position: z.number().int().positive("Position must be a positive integer"),
  isPreview: z.boolean().default(false),
  fileType: z.string().min(1, "File type is required"),
  duration: z.number().min(0, "Duration must be 0 or greater"),
  fileSize: z.number().int().positive("File size must be a positive integer"),
});

export const updateLectureSchema = z.object({
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
  isPreview: z.boolean().optional(),
  isUploading: z.boolean().optional(),
});
