import type { Types } from "mongoose";
import type { ICourse } from "../models/Course.js";

export interface AuthenticatedUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "owner" | "admin" | "instructor" | "student";
  isSuspended: boolean;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      course?: ICourse;
      file?: {
        path: string;
      };
    }
  }
}
