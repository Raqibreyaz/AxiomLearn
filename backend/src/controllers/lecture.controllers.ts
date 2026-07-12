import { Request, Response } from "express";

export const createLecture = async (
  _req: Request,
  res: Response,
) => {
  // Stub implementation
  return res.status(201).json({ message: "createLecture stub" });
};

export const updateLecture = async (
  _req: Request,
  res: Response,
) => {
  // Stub implementation
  return res.status(200).json({ message: "updateLecture stub" });
};

export const deleteLecture = async (
  _req: Request,
  res: Response,
) => {
  // Stub implementation
  return res.status(200).json({ message: "deleteLecture stub" });
};