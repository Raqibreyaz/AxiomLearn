import mongoose, { Document, Types } from "mongoose";

export interface ISession extends Document {
  user: Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
}

const sessionSchema = new mongoose.Schema<ISession>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const Session = mongoose.model<ISession>("Session", sessionSchema);
export default Session;
