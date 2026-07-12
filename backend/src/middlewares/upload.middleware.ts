import { NextFunction, Request, Response } from "express";
import { createWriteStream, existsSync, mkdirSync, unlink } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ApiError from "../utils/apiError.js";

const UPLOAD_LIMIT = 2 * 1024 ** 2; // 2MB
const UPLOAD_DIR = fileURLToPath(new URL("../../uploads", import.meta.url));

if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

const upload = (req: Request, _res: Response, next: NextFunction): void => {
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const filepath = path.join(UPLOAD_DIR, uniqueSuffix);

  const writeStream = createWriteStream(filepath);
  let bodySize = 0;
  let limitExceeded = false;
  let nextCalled = false;

  const cleanup = () => {
    writeStream.destroy();
    unlink(filepath, () => {
      // Ignore errors during unlink
    });
  };

  req.on("data", (chunk: Buffer) => {
    if (limitExceeded) return;

    bodySize += chunk.length;
    if (bodySize > UPLOAD_LIMIT) {
      limitExceeded = true;
      cleanup();
      if (!nextCalled) {
        nextCalled = true;
        next(new ApiError(413, "Uploaded file Too Large!"));
      }
      return;
    }

    if (!writeStream.write(chunk)) {
      req.pause();
    }
  });

  writeStream.on("drain", () => {
    if (!limitExceeded) {
      req.resume();
    }
  });

  req.on("end", () => {
    if (limitExceeded) return;
    writeStream.end();
  });

  writeStream.on("finish", () => {
    if (limitExceeded) return;
    req.file = {
      path: filepath,
    };
    if (!nextCalled) {
      nextCalled = true;
      next();
    }
  });

  req.on("error", (err) => {
    cleanup();
    if (!nextCalled) {
      nextCalled = true;
      next(err);
    }
  });

  writeStream.on("error", (err) => {
    cleanup();
    if (!nextCalled) {
      nextCalled = true;
      next(err);
    }
  });

  req.on("close", () => {
    // If request closed/aborted prematurely before end of stream
    if (!req.readableEnded && !limitExceeded) {
      cleanup();
    }
  });
};

export default upload;
