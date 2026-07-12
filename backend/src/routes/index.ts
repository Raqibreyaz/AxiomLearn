import { Router } from "express";
import authRouter from "./auth.routes.js";
import courseRouter from "./course.routes.js";
import sectionRouter from "./section.routes.js";
import lectureRouter from "./lecture.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/courses", courseRouter);
router.use("/sections", sectionRouter);
router.use("/lectures", lectureRouter);

export default router;
