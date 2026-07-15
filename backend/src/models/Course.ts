import mongoose, { Document, Types } from "mongoose";

export interface ICourse extends Document {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail?: string;
  instructor: Types.ObjectId;

  language: "en" | "hi" | "hinglish";
  learningMode: "live" | "recorded" | "hybrid";
  domain: string;
  level: "beginner" | "intermediate" | "advanced" | "all-levels";
  tags: string[];

  isFeatured: boolean;
  status: "draft" | "published" | "archived";

  price: number;
  currency: "INR";

  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new mongoose.Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: { type: String, required: true, trim: true },

    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },

    thumbnail: { type: String, trim: true },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    language: {
      type: String,
      enum: ["en", "hi", "hinglish"],
      default: "en",
      required: true,
    },

    learningMode: {
      type: String,
      enum: ["live", "recorded", "hybrid"],
      default: "recorded",
      required: true,
    },

    domain: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "all-levels"],
      default: "beginner",
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      required: true,
      index: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    currency: {
      type: String,
      enum: ["INR"],
      default: "INR",
      required: true,
    },
  },
  { timestamps: true },
);

courseSchema.pre("validate", async function () {
  if (this.tags) {
    this.tags = this.tags.map((tag) => tag.trim().toLowerCase());
  }
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
});

courseSchema.index({ domain: 1, level: 1 });
courseSchema.index({ status: 1, isFeatured: 1 });
courseSchema.index(
  { title: "text", shortDescription: "text", tags: "text" },
  { language_override: "textSearchLanguage" }
);

export const Course = mongoose.model<ICourse>("Course", courseSchema);
export default Course;
