import { Request, Response } from "express";
import Course from "../models/Course.js";
import Section from "../models/Section.js";
import Lecture from "../models/Lecture.js";
import LectureProgress from "../models/LectureProgress.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { createSectionSchema, updateSectionSchema } from "../schemas/section.schemas.js";
import * as z from "zod";

export const createSection = async (
  req: Request<{ courseId: string }, any, z.infer<typeof createSectionSchema>>,
  res: Response,
) => {
  const { courseId } = req.params;
  const { title, position } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const section = await Section.create({
    title,
    position,
    course: courseId as any,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, section, "Section created successfully"));
};

export const updateSection = async (
  req: Request<{ sectionId: string }, any, z.infer<typeof updateSectionSchema>>,
  res: Response,
) => {
  const { sectionId } = req.params;
  const { title, position } = req.body;

  const section = await Section.findById(sectionId);
  if (!section) {
    throw new ApiError(404, "Section not found");
  }

  const course = await Course.findById(section.course);
  if (!course) {
    throw new ApiError(404, "Course associated with this section not found");
  }

  if (title !== undefined) section.title = title;
  if (position !== undefined) section.position = position;

  await section.save();

  return res
    .status(200)
    .json(new ApiResponse(200, section, "Section updated successfully"));
};

// TODO: delete lectures from s3 as well
export const deleteSection = async (req: Request, res: Response) => {
  const { sectionId } = req.params;

  const section = await Section.findById(sectionId);
  if (!section) {
    throw new ApiError(404, "Section not found");
  }

  const course = await Course.findById(section.course);
  if (!course) {
    throw new ApiError(404, "Course associated with this section not found");
  }

  // Find all lectures of this section to delete their progress
  const lectures = await Lecture.find({ section: section._id }, "_id").lean();
  const lectureIds = lectures.map((l) => l._id);

  // Delete lecture progresses
  if (lectureIds.length > 0) {
    await LectureProgress.deleteMany({ lecture: { $in: lectureIds } });
  }

  // Delete lectures in this section
  await Lecture.deleteMany({ section: section._id });

  // Delete the section
  await Section.findByIdAndDelete(sectionId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Section and all associated content deleted successfully",
      ),
    );
};
