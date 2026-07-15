import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import ApiError from "../utils/apiError.js";

export default function validateObjectIds(req: Request, _res: Response, next: NextFunction) {
  for (const [key, value] of Object.entries(req.params)) {
    if (key.endsWith("Id") && typeof value === "string") {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return next(new ApiError(400, `Invalid ${key}: '${value}' is not a valid ObjectId`));
      }
    }
  }
  next();
}
