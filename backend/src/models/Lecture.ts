import mongoose, { Document, Types } from "mongoose";

export interface ILecture extends Document {
  title: string;
  position: number;
  isPreview: boolean;
  course: Types.ObjectId;
  section: Types.ObjectId;
  lectureDurationSeconds: number;
  sizeInBytes: number;
  isUploading: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const lectureSchema = new mongoose.Schema<ILecture>(
  {
    title: { type: String, required: true, trim: true },
    position: { type: Number, required: true, min: 0 },
    isPreview: { type: Boolean, default: false },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
      index: true,
    },
    lectureDurationSeconds: { type: Number, required: true, min: 0 },
    sizeInBytes: {
      type: Number,
      required: true,
      min: 1,
    },
    isUploading: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

lectureSchema.index({ section: 1, position: 1 }, { unique: true });

export const Lecture = mongoose.model<ILecture>("Lecture", lectureSchema);
export default Lecture;
