import { Router } from "express";
import {
  createSection,
  updateSection,
  deleteSection,
} from "../controllers/section.controllers.js";
import lectureRouter from "./lecture.routes.js";

const router = Router({ mergeParams: true });

// Protected routes (Admin and Instructor only)
router.use("/:sectionId/lectures", lectureRouter);

router.post("/", createSection);

router.patch("/:sectionId", updateSection);

router.delete("/:sectionId", deleteSection);

export default router;
