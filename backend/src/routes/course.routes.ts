import { Router } from "express";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  updateThumbnail,
} from "../controllers/course.controllers.js";
import {
  verifySession,
  authorizeRoles,
  authorizeCourseAccess,
} from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import sectionRouter from "./section.routes.js";

const router = Router({ mergeParams: true });

// Public routes
router.get("/", getCourses);
router.get("/:courseId", getCourseById);

// src/routes/course.routes.ts
router.use(
  "/:courseId/sections",
  verifySession,
  authorizeRoles("admin", "instructor"),
  authorizeCourseAccess, // Checks ownership & attaches req.course
  sectionRouter,
);

// Protected routes
router.post(
  "/",
  verifySession,
  authorizeRoles("admin", "instructor"),
  createCourse,
);
router.patch(
  "/:courseId",
  verifySession,
  authorizeRoles("admin", "instructor"),
  authorizeCourseAccess,
  updateCourse,
);
router.delete(
  "/:courseId",
  verifySession,
  authorizeRoles("admin", "instructor"),
  authorizeCourseAccess,
  deleteCourse,
);
router.post(
  "/:courseId/thumbnail",
  verifySession,
  authorizeRoles("admin", "instructor"),
  authorizeCourseAccess,
  upload,
  updateThumbnail,
);

export default router;
