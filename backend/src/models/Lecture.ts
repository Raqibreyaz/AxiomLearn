import mongoose, { Document, Types } from "mongoose";

export interface ILecture extends Document {
  title: string;
  position: number;
  isPreview: boolean;
  course: Types.ObjectId;
  section: Types.ObjectId;
  lectureDurationSeconds: number;
  uploadStatus: "uploaded" | "processing" | "ready" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const lectureSchema = new mongoose.Schema<ILecture>(
  {
    title: { type: String, required: true },
    position: { type: Number, required: true },
    isPreview: { type: Boolean, default: false },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    lectureDurationSeconds: { type: Number, required: true },
    uploadStatus: {
      type: String,
      enum: ["uploaded", "processing", "ready", "failed"],
      required: true,
    },
  },
  { timestamps: true },
);

export const Lecture = mongoose.model<ILecture>("Lecture", lectureSchema);
export default Lecture;
