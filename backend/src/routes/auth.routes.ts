import { Router } from "express";
import {
  signup,
  login,
  logout,
  getMe,
  update,
  updateAvatar,
} from "../controllers/auth.controllers.js";
import { verifySession } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import inputValidate from "../middlewares/inputValidate.middleware.js";
import { signupSchema, loginSchema, updateProfileSchema } from "../schemas/auth.schemas.js";

const router = Router();

router.post("/signup", inputValidate(signupSchema), signup);
router.post("/login", inputValidate(loginSchema), login);

// Protected routes
router.post("/logout", verifySession, logout);
router.get("/me", verifySession, getMe);
router.patch("/update", verifySession, inputValidate(updateProfileSchema), update);
router.post("/avatar", verifySession, upload, updateAvatar);

export default router;
