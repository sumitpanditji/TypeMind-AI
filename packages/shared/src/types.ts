export type UserRole = "user" | "admin";

export type TypingMode =
  | "words"
  | "quote"
  | "punctuation"
  | "numbers"
  | "code"
  | "ai-adaptive";

export type TimerDuration = 15 | 30 | 60 | 120;

export interface UserSettings {
  fontSize: number;
  sound: boolean;
  cursorStyle: "line" | "block";
  showKeyboard: boolean;
  animations: boolean;
}

export interface StreakInfo {
  current: number;
  longest: number;
  lastActiveDate: string | null;
}

export interface CharStat {
  char: string;
  correct: number;
  incorrect: number;
  avgLatencyMs: number;
}

export interface NgramMistake {
  pattern: string;
  count: number;
}

export interface KeyEvent {
  key: string;
  timestamp: number;
  correct: boolean;
}

export interface TypingSessionPayload {
  mode: TypingMode;
  duration: TimerDuration;
  language?: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  charStats: CharStat[];
  ngramMistakes: NgramMistake[];
  keyEvents: KeyEvent[];
  contentHash?: string;
  contentPreview?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  wpm: number;
  accuracy: number;
  rawWpm: number;
  mode: string;
  duration: number;
  completedAt: string;
}

export interface WeaknessProfile {
  weakChars: string[];
  weakNgrams: string[];
  slowPatterns: string[];
  punctuationScore: number;
  numberScore: number;
  hesitationZones: string[];
}

export interface AiAnalyzeResponse {
  insights: string[];
  focusAreas: string[];
  suggestedDrills: { pattern: string; exampleText: string }[];
  weaknessProfile: WeaknessProfile;
}

export interface AiGenerateTextResponse {
  content: string;
  focusAreas: string[];
  source: "ai" | "builtin";
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AnalyticsSummary {
  totalSessions: number;
  totalWords: number;
  avgWpm: number;
  avgAccuracy: number;
  bestWpm: number;
  streak: StreakInfo;
  recentWpm: { date: string; wpm: number }[];
}
