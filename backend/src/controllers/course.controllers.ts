import { Request, Response } from "express";
import Course from "../models/Course.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Section from "../models/Section.js";
import Lecture from "../models/Lecture.js";
import CourseProgress from "../models/CourseProgress.js";
import LectureProgress from "../models/LectureProgress.js";
import { uploadFile, deleteFile } from "../services/s3.service.js";
import { rm } from "node:fs/promises";

// @desc    Get all courses
// @route   GET /api/v1/courses
// @access  Public
export const getCourses = async (req: Request, res: Response) => {
  const { search } = req.query;

  const query: any = {};

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  const courses = await Course.find(query)
    .select("-description")
    .populate("instructor", "name")
    .sort({ createdAt: -1 })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, courses, "Courses retrieved successfully"));
};

// @desc    Get course by ID
// @route   GET /api/v1/courses/:id
// @access  Public
export const getCourseById = async (req: Request, res: Response) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId)
    .populate("instructor", "name avatar")
    .lean();

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const sections = await Section.find({ course: course._id })
    .select("-course")
    .sort({ position: 1 })
    .lean();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...course, sections },
        "Course details retrieved successfully",
      ),
    );
};

// @desc    Create a new course
// @route   POST /api/v1/courses
// @access  Private (Instructor/Admin)
export const createCourse = async (req: Request, res: Response) => {
  // multer middleware uploads the file to s3
  const { title, description } = req.body;

  if (!req.user) throw new ApiError(401, "User must be authorized first!");

  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  const course = await Course.create({
    title,
    description,
    instructor: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, course, "Course created successfully"));
};

// @desc    Update course details
// @route   PATCH /api/v1/courses/:id
// @access  Private (Instructor/Admin)
export const updateCourse = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const course = await Course.findById(courseId);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    { $set: req.body },
    { new: true, runValidators: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedCourse, "Course updated successfully"));
};

// @desc    Update course thumbnail
// @route   POST /api/v1/courses/:id/thumbnail
// @access  Private (Instructor/Admin)
export const updateThumbnail = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const course = await Course.findById(courseId);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  if (!req.file) {
    throw new ApiError(400, "Thumbnail file is required");
  }

  const s3ObjectUrl = await uploadFile(req.file.path);
  const oldThumbnailUrl = course.thumbnail;
  course.thumbnail = s3ObjectUrl;

  try {
    await course.save();

    // Delete old thumbnail if it exists
    if (oldThumbnailUrl) {
      await deleteFile(oldThumbnailUrl);
    }

    // delete the local uploaded file
    await rm(req.file.path);
  } catch (error) {
    await deleteFile(s3ObjectUrl);
    throw error;
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, course, "Course thumbnail updated successfully"),
    );
};

// TODO: delete lectures from s3 as well
// @desc    delete entire course
// @route   DELETE /api/v1/courses/:id
// @access  Private (Instructor/Admin)
export const deleteCourse = async (req: Request, res: Response) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // Find all lectures of this course to delete their progress
  const lectures = await Lecture.find({ course: course._id }, "_id").lean();
  const lectureIds = lectures.map((l) => l._id);

  // Delete lecture progresses
  if (lectureIds.length > 0) {
    await LectureProgress.deleteMany({ lecture: { $in: lectureIds } });
  }

  // Delete lectures
  await Lecture.deleteMany({ course: course._id });

  // Delete sections
  await Section.deleteMany({ course: course._id });

  // Delete course progress
  await CourseProgress.deleteMany({ course: course._id });

  // Delete the course
  await Course.findByIdAndDelete(courseId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Course and all associated content deleted successfully",
      ),
    );
};
