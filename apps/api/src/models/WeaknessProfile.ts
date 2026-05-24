import mongoose, { Schema, Document, Types } from "mongoose";

export interface IWeaknessProfile extends Document {
  userId: Types.ObjectId;
  weakChars: string[];
  weakNgrams: string[];
  slowPatterns: string[];
  punctuationScore: number;
  numberScore: number;
  hesitationZones: string[];
  lastAnalyzedAt: Date;
}

const weaknessProfileSchema = new Schema<IWeaknessProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    weakChars: [String],
    weakNgrams: [String],
    slowPatterns: [String],
    punctuationScore: { type: Number, default: 100 },
    numberScore: { type: Number, default: 100 },
    hesitationZones: [String],
    lastAnalyzedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const WeaknessProfile = mongoose.model<IWeaknessProfile>(
  "WeaknessProfile",
  weaknessProfileSchema
);
