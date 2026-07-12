import type { Server } from "node:http";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";

// Load environment variables
dotenv.config();

const PORT = process.env["PORT"] || 5000;

let server: Server | null = null;

// Connect to Database and start server
connectDB()
  .then(() => {
    server = app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env["NODE_ENV"] || "development"} mode on port ${PORT}`,
      );
    });
  })
  .catch((err) => {
    console.error(`MongoDB Connection Failed: ${err}`);
    process.exit(1);
  });

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", (err: Error) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  console.log("Shutting down server gracefully...");
  server?.close(() => {
    process.exit(1);
  });
});

// Handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception Error: ${err.message}`);
  console.log("Shutting down immediately due to uncaught exception...");
  process.exit(1);
});
