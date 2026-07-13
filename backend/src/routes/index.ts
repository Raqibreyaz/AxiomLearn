import { Router } from "express";
import authRouter from "./auth.routes.js";
import courseRouter from "./course.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/courses", courseRouter);

export default router;
