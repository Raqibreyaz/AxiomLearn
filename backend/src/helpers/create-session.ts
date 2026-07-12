import { cookieOptions } from "../config/session.js";
import Session from "../models/Session.js";
import { Types } from "mongoose";

// Helper to create a custom session
export const createSession = async (userId: Types.ObjectId) => {
  const expiresAt = new Date(Date.now() + cookieOptions.maxAge);

  const session = await Session.create({
    user: userId,
    expiresAt,
  });

  return session._id;
};
