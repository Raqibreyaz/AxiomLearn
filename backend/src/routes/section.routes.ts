import { Router } from "express";
import {
  createSection,
  updateSection,
  deleteSection,
} from "../controllers/section.controllers.js";
import lectureRouter from "./lecture.routes.js";
import inputValidate from "../middlewares/inputValidate.middleware.js";
import { createSectionSchema, updateSectionSchema } from "../schemas/section.schemas.js";

const router = Router({ mergeParams: true });

// Protected routes (Admin and Instructor only)
router.use("/:sectionId/lectures", lectureRouter);

router.post("/", inputValidate(createSectionSchema), createSection);

router.patch("/:sectionId", inputValidate(updateSectionSchema), updateSection);

router.delete("/:sectionId", deleteSection);

export default router;
