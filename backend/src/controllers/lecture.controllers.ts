import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import { getFilePresignedUrl, uploadFilePresignedUrl } from "../services/s3.service.js";
import Lecture from "../models/Lecture.js";
import Section from "../models/Section.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

const isDuplicateKeyError = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === 11000;

export const createLecture = async (req: Request, res: Response) => {
  const courseId = req.params["courseId"]!;
  const sectionId = req.params["sectionId"]!;

  if (!sectionId || !courseId)
    throw new ApiError(403, "course id and section id, both are required!");

  const {
    title,
    position,
    isPreview = false,
    fileType,
    duration,
    fileSize,
  } = req.body;

  const section = await Section.findOne({ _id: sectionId, course: courseId });
  if (!section) {
    throw new ApiError(404, "Section not found for this course");
  }

  const existingLecture = await Lecture.exists({
    section: sectionId,
    position,
  });

  if (existingLecture) {
    throw new ApiError(
      409,
      "A lecture already exists at this position in the section",
    );
  }

  const lectureId = new ObjectId();
  const uploadUrl = await uploadFilePresignedUrl(
    lectureId.toString(),
    fileType,
    fileSize,
  );

  let lecture;
  try {
    lecture = await Lecture.create({
      _id: lectureId,
      title: title.trim(),
      position,
      course: courseId as any,
      section: sectionId as any,
      isPreview,
      lectureDurationSeconds: duration,
      sizeInBytes: fileSize,
      isUploading: true,
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new ApiError(
        409,
        "A lecture already exists at this position in the section",
      );
    }

    throw error;
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { lecture, uploadUrl },
        "Lecture created and upload URL generated successfully",
      ),
    );
};

// for upload complete, this will be used to set isUploading:false
export const updateLecture = async (req: Request, res: Response) => {
  const courseId = req.params["courseId"]!;
  const sectionId = req.params["sectionId"]!;
  const lectureId = req.params["lectureId"]!;

  if (!courseId || !sectionId || !lectureId) {
    throw new ApiError(400, "courseId, sectionId, and lectureId are required");
  }

  const { title, position, isPreview, isUploading } = req.body;

  const lecture = await Lecture.findOneAndUpdate(
    { _id: lectureId, section: sectionId, course: courseId },
    { title, position, isPreview, isUploading },
    { returnDocument: "after", runValidators: true }
  );

  if (!lecture) {
    throw new ApiError(404, "Lecture not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { lecture }, "Lecture updated successfully"));
};

export const deleteLecture = async (req: Request, res: Response) => {
  const courseId = req.params["courseId"]!;
  const sectionId = req.params["sectionId"]!;
  const lectureId = req.params["lectureId"]!;

  if (!courseId || !sectionId || !lectureId) {
    throw new ApiError(400, "courseId, sectionId, and lectureId are required");
  }

  const lecture = await Lecture.findOneAndDelete({
    _id: lectureId,
    section: sectionId,
    course: courseId,
  });

  if (!lecture) {
    throw new ApiError(404, "Lecture not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Lecture deleted successfully"));
};

export const getLectureStreamUrl = async (req: Request, res: Response) => {
  const courseId = req.params["courseId"]!;
  const sectionId = req.params["sectionId"]!;
  const lectureId = req.params["lectureId"]!;

  if (!courseId || !sectionId || !lectureId) {
    throw new ApiError(400, "courseId, sectionId, and lectureId are required");
  }

  const lecture = await Lecture.findOne({
    _id: lectureId,
    section: sectionId,
    course: courseId,
  });

  if (!lecture) {
    throw new ApiError(404, "Lecture not found");
  }

  // TODO: Add authorization checks (e.g., is user enrolled? is it a free preview?)
  // For now, if the lecture exists, we grant the stream URL.
  
  // the lecture ID is the object key
  const streamUrl = await getFilePresignedUrl(lecture._id.toString());

  return res
    .status(200)
    .json(new ApiResponse(200, { url: streamUrl }, "Stream URL generated successfully"));
};
