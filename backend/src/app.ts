import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import apiRouter from "./routes/index.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env["CORS_ORIGIN"] || "*",
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Base health check route
app.get("/", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "AxiomLearn API is running smoothly",
  });
});

// API Routes
app.use("/api/v1", apiRouter);

// Global Error Handler Middleware
app.use(errorMiddleware);

export { app };
export default app;
