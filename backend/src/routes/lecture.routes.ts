import { Router } from "express";
import {
  createLecture,
  updateLecture,
  deleteLecture,
  getLectureStreamUrl,
} from "../controllers/lecture.controllers.js";

const router = Router({ mergeParams: true });

// Protected routes (Admin and Instructor only)
router.post("/", createLecture);

router.patch("/:lectureId", updateLecture);

router.delete("/:lectureId", deleteLecture);

// Route for getting the presigned URL for playback
router.get("/:lectureId/stream-url", getLectureStreamUrl);

export default router;
