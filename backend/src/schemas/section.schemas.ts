import * as z from "zod";

export const createSectionSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  position: z.number().int().positive("Position must be a positive integer"),
});

export const updateSectionSchema = z.object({
  title: z.string().trim().min(1, "Title cannot be empty").optional(),
  position: z.number().int().positive("Position must be a positive integer").optional(),
});
