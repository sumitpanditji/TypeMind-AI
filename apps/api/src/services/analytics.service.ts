import { TypingSession } from "../models/TypingSession";
import { UserProfile } from "../models/UserProfile";
import type { AnalyticsSummary } from "@typemind/shared";

export async function getAnalyticsSummary(userId: string): Promise<AnalyticsSummary> {
  const sessions = await TypingSession.find({ userId })
    .sort({ completedAt: -1 })
    .limit(100)
    .lean();

  const profile = await UserProfile.findOne({ userId }).lean();

  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      totalWords: 0,
      avgWpm: 0,
      avgAccuracy: 0,
      bestWpm: 0,
      streak: profile?.streak ?? { current: 0, longest: 0, lastActiveDate: null },
      recentWpm: [],
    };
  }

  const totalWords = sessions.reduce((sum, s) => sum + Math.round((s.wpm * s.duration) / 60), 0);
  const avgWpm = sessions.reduce((sum, s) => sum + s.wpm, 0) / sessions.length;
  const avgAccuracy = sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length;
  const bestWpm = Math.max(...sessions.map((s) => s.wpm));

  const recentWpm = sessions
    .slice(0, 14)
    .reverse()
    .map((s) => ({
      date: s.completedAt.toISOString().split("T")[0]!,
      wpm: Math.round(s.wpm),
    }));

  return {
    totalSessions: sessions.length,
    totalWords,
    avgWpm: Math.round(avgWpm * 10) / 10,
    avgAccuracy: Math.round(avgAccuracy * 10) / 10,
    bestWpm: Math.round(bestWpm),
    streak: profile?.streak ?? { current: 0, longest: 0, lastActiveDate: null },
    recentWpm,
  };
}

export async function updateStreak(userId: string): Promise<void> {
  const profile = await UserProfile.findOne({ userId });
  if (!profile) return;

  const today = new Date().toISOString().split("T")[0]!;
  const last = profile.streak.lastActiveDate;

  if (last === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0]!;

  if (last === yesterdayStr) {
    profile.streak.current += 1;
  } else {
    profile.streak.current = 1;
  }

  if (profile.streak.current > profile.streak.longest) {
    profile.streak.longest = profile.streak.current;
  }
  profile.streak.lastActiveDate = today;
  await profile.save();
}
