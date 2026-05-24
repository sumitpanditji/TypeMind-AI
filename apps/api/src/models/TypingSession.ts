import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITypingSession extends Document {
  userId?: Types.ObjectId;
  mode: string;
  duration: number;
  language?: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  charStats: { char: string; correct: number; incorrect: number; avgLatencyMs: number }[];
  ngramMistakes: { pattern: string; count: number }[];
  keyEvents: { key: string; timestamp: number; correct: boolean }[];
  contentHash?: string;
  contentPreview?: string;
  completedAt: Date;
}

const typingSessionSchema = new Schema<ITypingSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    mode: { type: String, required: true },
    duration: { type: Number, required: true },
    language: String,
    wpm: { type: Number, required: true },
    rawWpm: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    charStats: [{ char: String, correct: Number, incorrect: Number, avgLatencyMs: Number }],
    ngramMistakes: [{ pattern: String, count: Number }],
    keyEvents: [{ key: String, timestamp: Number, correct: Boolean }],
    contentHash: { type: String, index: true },
    contentPreview: String,
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

typingSessionSchema.index({ userId: 1, completedAt: -1 });
typingSessionSchema.index({ contentHash: 1, wpm: -1 });
typingSessionSchema.index({ mode: 1, duration: 1, wpm: -1 });

export const TypingSession = mongoose.model<ITypingSession>("TypingSession", typingSessionSchema);
