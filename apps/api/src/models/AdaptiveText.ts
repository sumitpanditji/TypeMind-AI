import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAdaptiveText extends Document {
  userId: Types.ObjectId;
  source: "ai" | "builtin";
  content: string;
  focusAreas: string[];
  createdAt: Date;
}

const adaptiveTextSchema = new Schema<IAdaptiveText>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    source: { type: String, enum: ["ai", "builtin"], required: true },
    content: { type: String, required: true },
    focusAreas: [String],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

adaptiveTextSchema.index({ userId: 1, createdAt: -1 });

export const AdaptiveText = mongoose.model<IAdaptiveText>("AdaptiveText", adaptiveTextSchema);
