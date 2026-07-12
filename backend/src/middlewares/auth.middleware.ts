import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import Session from "../models/Session.js";
import ApiError from "../utils/apiError.js";

import Course from "../models/Course.js";

// Verify custom session token and attach user to request object
export const verifySession = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const sessionId =
    req.cookies["sessionId"] ||
    req.header("Authorization")?.replace("Bearer ", "");

  try {
    if (!sessionId) {
      throw new ApiError(
        401,
        "Unauthorized request - No session token provided",
      );
    }

    const session = await Session.findById(sessionId);

    const isSessionExpired = session ? session.expiresAt < new Date() : true;
    if (isSessionExpired && session)
      await Session.deleteOne({ _id: session._id });

    if (!session || isSessionExpired)
      throw new ApiError(401, "Invalid or expired session");

    const user = await User.findById(session.user).select("-password").lean();

    if (!user) {
      throw new ApiError(401, "Invalid session - User not found");
    }

    if (user.isSuspended) {
      throw new ApiError(403, "Access denied - Account is suspended");
    }

    req.user = user;
    next();
  } catch (error: any) {
    if (error instanceof ApiError) return next(error);
    next(new ApiError(500, "Authentication service error"));
  }
};

type UserRole = "owner" | "admin" | "instructor" | "student";

// Check if authenticated user has one of the allowed roles
export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized - Authentication required"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access forbidden - Role ${req.user.role} is not authorized`,
        ),
      );
    }

    next();
  };
};

// Check if authenticated user is the instructor of the course or an admin
export const authorizeCourseAccess = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const courseId = req.params["courseId"] || req.params["id"];
    if (!courseId) {
      throw new ApiError(400, "Course ID is required");
    }

    const course = await Course.findById(courseId);
    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    if (!req.user) {
      throw new ApiError(401, "Unauthorized - Authentication required");
    }

    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      throw new ApiError(
        403,
        "You are not authorized to perform actions on this course",
      );
    }

    req.course = course;
    next();
  } catch (error) {
    next(error);
  }
};
