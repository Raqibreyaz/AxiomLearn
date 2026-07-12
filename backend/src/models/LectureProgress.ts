import mongoose, { Document, Types } from "mongoose";

export interface ILectureProgress extends Document {
  lecture: Types.ObjectId;
  user: Types.ObjectId;
  lastPositionSeconds: number;
  maxPositionSeconds: number;
  isCompleted: boolean;
  startedAt: Date;
  lastWatchedAt: Date;
}

const lectureProgressSchema = new mongoose.Schema<ILectureProgress>(
  {
    lecture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lastPositionSeconds: { type: Number, required: true, default: 0 },
    maxPositionSeconds: { type: Number, required: true, default: 0 },
    isCompleted: { type: Boolean, required: true, default: false },
    startedAt: { type: Date, required: true },
    lastWatchedAt: { type: Date, required: true },
  },
  { timestamps: false },
);

export const LectureProgress = mongoose.model<ILectureProgress>(
  "LectureProgress",
  lectureProgressSchema,
);
export default LectureProgress;
