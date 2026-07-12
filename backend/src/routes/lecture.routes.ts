import { Router } from "express";
import {
  createLecture,
  updateLecture,
  deleteLecture,
} from "../controllers/lecture.controllers.js";

const router = Router();

// Protected routes (Admin and Instructor only)
router.post("/:courseId/:sectionId", createLecture);

router.patch("/:lectureId", updateLecture);

router.delete("/:lectureId", deleteLecture);

export default router;
