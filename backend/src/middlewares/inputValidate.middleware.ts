import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import ApiError from "../utils/apiError.js";

export default function inputValidate(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return next(new ApiError(400, "Validation failed", errors));
    }
    req.body = result.data;
    next();
  };
}
