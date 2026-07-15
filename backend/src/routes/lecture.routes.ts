import { Router } from "express";
import {
  createLecture,
  updateLecture,
  deleteLecture,
} from "../controllers/lecture.controllers.js";

const router = Router({ mergeParams: true });

// Protected routes (Admin and Instructor only)
router.post("/", createLecture);

router.patch("/:lectureId", updateLecture);

router.delete("/:lectureId", deleteLecture);

export default router;
