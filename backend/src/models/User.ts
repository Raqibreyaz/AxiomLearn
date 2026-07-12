import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  avatar?: string;
  role: "owner" | "admin" | "instructor" | "student";
  isSuspended: boolean;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    avatar: { type: String },
    role: {
      type: String,
      enum: ["owner", "admin", "instructor", "student"],
      required: true,
    },
    isSuspended: { type: Boolean, default: false },
    bio: { type: String },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>("User", userSchema);
export default User;
