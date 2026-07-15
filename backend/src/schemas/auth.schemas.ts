import * as z from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50).optional(),
  email: z.email("Invalid email address").optional(),
  phone: z.string().trim().optional(),
  newPassword: z.string().min(8, "New password must be at least 8 characters").optional(),
  password: z.string().optional(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
}).refine(
  (data) => {
    if (data.newPassword && !data.password) {
      return false;
    }
    return true;
  },
  {
    message: "Current password is required to set a new password",
    path: ["password"],
  }
);
