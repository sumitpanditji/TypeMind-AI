import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import { TypingSession } from "../models/TypingSession";
import { User } from "../models/User";
import { UserProfile } from "../models/UserProfile";
import { WeaknessProfile } from "../models/WeaknessProfile";

const DEMO_USERS = [
  {
    id: new Types.ObjectId("665000000000000000000001"),
    email: "demo@typemind.local",
    username: "demo_user",
    password: "Demo@12345",
    role: "user" as const,
  },
  {
    id: new Types.ObjectId("665000000000000000000002"),
    email: "admin@typemind.local",
    username: "admin_user",
    password: "Admin@12345",
    role: "admin" as const,
  },
];

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function sessionFor(userId: Types.ObjectId, dayOffset: number, wpm: number, accuracy: number) {
  return {
    userId,
    mode: "words",
    duration: 60,
    wpm,
    rawWpm: wpm + 5,
    accuracy,
    charStats: [
      { char: "t", correct: 34, incorrect: 2, avgLatencyMs: 155 },
      { char: "h", correct: 28, incorrect: 3, avgLatencyMs: 190 },
      { char: "e", correct: 42, incorrect: 1, avgLatencyMs: 145 },
      { char: "i", correct: 26, incorrect: 4, avgLatencyMs: 230 },
    ],
    ngramMistakes: [
      { pattern: "th", count: 3 },
      { pattern: "ing", count: 2 },
    ],
    keyEvents: [
      { key: "t", timestamp: 120, correct: true },
      { key: "h", timestamp: 280, correct: true },
      { key: "e", timestamp: 440, correct: true },
    ],
    contentHash: "demo-words-60",
    contentPreview: "the quick brown fox builds steady typing rhythm",
    completedAt: daysAgo(dayOffset),
  };
}

export async function seedDemoData(): Promise<void> {
  const seedEmails = DEMO_USERS.map((user) => user.email);
  const seedIds = DEMO_USERS.map((user) => user.id);

  await Promise.all([
    User.deleteMany({ email: { $in: seedEmails } }),
    UserProfile.deleteMany({ userId: { $in: seedIds } }),
    WeaknessProfile.deleteMany({ userId: { $in: seedIds } }),
    TypingSession.deleteMany({ userId: { $in: seedIds } }),
  ]);

  const [demoHash, adminHash] = await Promise.all([
    bcrypt.hash(DEMO_USERS[0]!.password, 10),
    bcrypt.hash(DEMO_USERS[1]!.password, 10),
  ]);

  await User.insertMany([
    {
      _id: DEMO_USERS[0]!.id,
      email: DEMO_USERS[0]!.email,
      username: DEMO_USERS[0]!.username,
      passwordHash: demoHash,
      role: DEMO_USERS[0]!.role,
      createdAt: daysAgo(10),
    },
    {
      _id: DEMO_USERS[1]!.id,
      email: DEMO_USERS[1]!.email,
      username: DEMO_USERS[1]!.username,
      passwordHash: adminHash,
      role: DEMO_USERS[1]!.role,
      createdAt: daysAgo(8),
    },
  ]);

  await UserProfile.insertMany([
    {
      userId: DEMO_USERS[0]!.id,
      displayName: "Demo User",
      settings: {
        fontSize: 24,
        sound: false,
        cursorStyle: "line",
        showKeyboard: true,
        animations: true,
      },
      streak: {
        current: 5,
        longest: 7,
        lastActiveDate: new Date().toISOString().split("T")[0],
      },
    },
    {
      userId: DEMO_USERS[1]!.id,
      displayName: "Admin User",
      settings: {
        fontSize: 24,
        sound: false,
        cursorStyle: "line",
        showKeyboard: false,
        animations: true,
      },
      streak: {
        current: 2,
        longest: 3,
        lastActiveDate: new Date().toISOString().split("T")[0],
      },
    },
  ]);

  await WeaknessProfile.create({
    userId: DEMO_USERS[0]!.id,
    weakChars: ["i", "h"],
    weakNgrams: ["th", "ing"],
    slowPatterns: ["i", "h"],
    punctuationScore: 88,
    numberScore: 92,
    hesitationZones: ["h"],
    lastAnalyzedAt: new Date(),
  });

  await TypingSession.insertMany([
    sessionFor(DEMO_USERS[0]!.id, 6, 54, 93),
    sessionFor(DEMO_USERS[0]!.id, 5, 58, 94),
    sessionFor(DEMO_USERS[0]!.id, 4, 61, 95),
    sessionFor(DEMO_USERS[0]!.id, 3, 63, 96),
    sessionFor(DEMO_USERS[0]!.id, 2, 66, 96),
    sessionFor(DEMO_USERS[0]!.id, 1, 68, 97),
    sessionFor(DEMO_USERS[1]!.id, 3, 72, 96),
    sessionFor(DEMO_USERS[1]!.id, 1, 78, 98),
  ]);
}

export const demoCredentials = DEMO_USERS.map(({ email, password, role }) => ({
  email,
  password,
  role,
}));
