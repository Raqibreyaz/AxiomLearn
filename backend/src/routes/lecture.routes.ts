import { Router } from "express";
import {
  createLecture,
  updateLecture,
  deleteLecture,
  getLectureStreamUrl,
} from "../controllers/lecture.controllers.js";
import inputValidate from "../middlewares/inputValidate.middleware.js";
import { createLectureSchema, updateLectureSchema } from "../schemas/lecture.schemas.js";
import validateObjectIds from "../middlewares/validateObjectId.middleware.js";

const router = Router({ mergeParams: true });

// Protected routes (Admin and Instructor only)
router.use("/:lectureId", validateObjectIds);

router.post("/", inputValidate(createLectureSchema), createLecture);

router.patch("/:lectureId", inputValidate(updateLectureSchema), updateLecture);

router.delete("/:lectureId", deleteLecture);

// Route for getting the presigned URL for playback
router.get("/:lectureId/stream-url", getLectureStreamUrl);

export default router;
