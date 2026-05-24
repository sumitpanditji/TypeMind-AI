import type { TimerDuration, TypingMode } from "./types";

export const TIMER_OPTIONS: TimerDuration[] = [15, 30, 60, 120];

export const MODE_LABELS: Record<TypingMode, string> = {
  words: "Words",
  quote: "Quotes",
  punctuation: "Punctuation",
  numbers: "Numbers",
  code: "Code",
  "ai-adaptive": "AI Adaptive",
};

export const API_BASE_PATH = "/api/v1";
