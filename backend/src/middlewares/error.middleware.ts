import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError.js";

const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || (error.name === "ValidationError" ? 400 : 500);
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors,
    ...(process.env["NODE_ENV"] === "development" ? { stack: error.stack } : {}),
  };

  res.status(error.statusCode).json(response);
};

export default errorMiddleware;
