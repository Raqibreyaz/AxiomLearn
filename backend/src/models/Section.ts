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
    title: { type: String, required: true },
    position: { type: Number, required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  { timestamps: true },
);

export const Section = mongoose.model<ISection>("Section", sectionSchema);
export default Section;
