import mongoose, { Document, Types } from "mongoose";

export interface ISection extends Document {
  title: string;
  position: number;
  course: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const sectionSchema = new mongoose.Schema<ISection>(
  {
    title: { type: String, required: true, trim: true },
    position: { type: Number, required: true, min: 0 },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  { timestamps: true },
);

sectionSchema.index({ course: 1, position: 1 }, { unique: true });

export const Section = mongoose.model<ISection>("Section", sectionSchema);
export default Section;
