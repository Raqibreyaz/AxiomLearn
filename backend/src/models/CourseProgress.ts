import mongoose, { Document, Types } from "mongoose";

export interface ICourseProgress extends Document {
  user: Types.ObjectId;
  course: Types.ObjectId;
  totalLectures: number;
  completedLectures: number;
  lastLecture: Types.ObjectId;
  lastActivityAt: Date;
}

const courseProgressSchema = new mongoose.Schema<ICourseProgress>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    totalLectures: { type: Number, required: true, default: 0 },
    completedLectures: { type: Number, required: true, default: 0 },
    lastLecture: { type: mongoose.Schema.Types.ObjectId, ref: "Lecture" },
    lastActivityAt: { type: Date, required: true },
  },
  { timestamps: false },
);

export const CourseProgress = mongoose.model<ICourseProgress>(
  "CourseProgress",
  courseProgressSchema,
);
export default CourseProgress;
