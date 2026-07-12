import mongoose, { Document, Types } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  thumbnail?: string;
  instructor: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
} 

const courseSchema = new mongoose.Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export const Course = mongoose.model<ICourse>("Course", courseSchema);
export default Course;
