import bcrypt from "bcrypt";
import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  avatar?: string;
  role: "admin" | "instructor" | "student";
  isSuspended: boolean;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
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
      enum: ["admin", "instructor", "student"],
      required: true,
    },
    isSuspended: { type: Boolean, default: false },
    bio: { type: String },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (this["password"] && this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this["password"] = await bcrypt.hash(this["password"], salt);
  }
});

userSchema.methods["comparePassword"] = async function (
  this: IUser,
  password: string,
): Promise<boolean> {
  const currentPassword = this["password"];
  if (!currentPassword) return false;
  return bcrypt.compare(password, currentPassword);
};

export const User = mongoose.model<IUser>("User", userSchema);
export default User;
