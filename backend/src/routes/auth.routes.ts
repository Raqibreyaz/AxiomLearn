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

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

// Protected routes
router.post("/logout", verifySession, logout);
router.get("/me", verifySession, getMe);
router.patch("/update", verifySession, update);
router.post("/avatar", verifySession, upload, updateAvatar);

export default router;
