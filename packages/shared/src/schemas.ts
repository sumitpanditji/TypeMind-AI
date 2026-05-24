import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const settingsSchema = z.object({
  fontSize: z.number().min(14).max(40).optional(),
  sound: z.boolean().optional(),
  cursorStyle: z.enum(["line", "block"]).optional(),
  showKeyboard: z.boolean().optional(),
  animations: z.boolean().optional(),
});

export const charStatSchema = z.object({
  char: z.string(),
  correct: z.number(),
  incorrect: z.number(),
  avgLatencyMs: z.number(),
});

export const ngramMistakeSchema = z.object({
  pattern: z.string(),
  count: z.number(),
});

export const keyEventSchema = z.object({
  key: z.string(),
  timestamp: z.number(),
  correct: z.boolean(),
});

export const typingSessionSchema = z.object({
  mode: z.enum([
    "words",
    "quote",
    "punctuation",
    "numbers",
    "code",
    "ai-adaptive",
  ]),
  duration: z.union([
    z.literal(15),
    z.literal(30),
    z.literal(60),
    z.literal(120),
  ]),
  language: z.string().optional(),
  wpm: z.number().min(0),
  rawWpm: z.number().min(0),
  accuracy: z.number().min(0).max(100),
  charStats: z.array(charStatSchema),
  ngramMistakes: z.array(ngramMistakeSchema),
  keyEvents: z.array(keyEventSchema).max(5000),
  contentHash: z.string().optional(),
  contentPreview: z.string().max(80).optional(),
  finishReason: z.enum(["time", "completed", "manual", "idle"]).optional(),
});

export const analyzeSchema = z.object({
  sessionId: z.string().optional(),
  session: typingSessionSchema.optional(),
});

export const generateTextSchema = z.object({
  focusAreas: z.array(z.string()).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type TypingSessionInput = z.infer<typeof typingSessionSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
