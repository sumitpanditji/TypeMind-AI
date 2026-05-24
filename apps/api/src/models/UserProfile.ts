import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUserProfile extends Document {
  userId: Types.ObjectId;
  displayName: string;
  avatarUrl?: string;
  settings: {
    fontSize: number;
    sound: boolean;
    cursorStyle: "line" | "block";
    showKeyboard: boolean;
    animations: boolean;
  };
  streak: {
    current: number;
    longest: number;
    lastActiveDate: string | null;
  };
}

const userProfileSchema = new Schema<IUserProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    displayName: { type: String, required: true },
    avatarUrl: String,
    settings: {
      fontSize: { type: Number, default: 24 },
      sound: { type: Boolean, default: false },
      cursorStyle: { type: String, enum: ["line", "block"], default: "line" },
      showKeyboard: { type: Boolean, default: false },
      animations: { type: Boolean, default: true },
    },
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastActiveDate: { type: String, default: null },
    },
  },
  { timestamps: true }
);

export const UserProfile = mongoose.model<IUserProfile>("UserProfile", userProfileSchema);
