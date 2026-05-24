import type { KeyEvent } from "./types";
import {
  createCounters,
  computeAccuracy,
  type TypingStatsCounters,
} from "./typing-stats";

export type FinishReason = "time" | "completed" | "manual" | "idle";

export interface ApplyInputResult {
  typed: string;
  events: KeyEvent[];
  counters: TypingStatsCounters;
  finishedEarly: boolean;
}

const MAX_EXTRA_CHARS = 30;

/** Reject paste/autofill bursts — only accept one new character per input event */
export function normalizeInputValue(
  previousTyped: string,
  rawValue: string,
  targetLength: number
): string {
  const maxLen = targetLength + MAX_EXTRA_CHARS;

  if (rawValue.length <= previousTyped.length) {
    return rawValue.slice(0, maxLen);
  }

  if (rawValue.length > previousTyped.length + 1) {
    const nextChar = rawValue[previousTyped.length];
    if (nextChar === undefined) return previousTyped;
    return (previousTyped + nextChar).slice(0, maxLen);
  }

  return rawValue.slice(0, maxLen);
}

export function applySingleKeypress(
  counters: TypingStatsCounters,
  target: string,
  index: number,
  newChar: string,
  timestamp: number
): { event: KeyEvent; counters: TypingStatsCounters } {
  const next = { ...counters };
  const expected = target[index];
  const isExtra = index >= target.length;
  const isCorrect = !isExtra && newChar === expected;

  next.totalKeypresses++;
  if (isExtra) {
    next.extraKeypresses++;
    next.mistakes++;
  } else if (isCorrect) {
    next.correctKeypresses++;
  } else {
    next.mistakes++;
  }

  return {
    event: { key: newChar, timestamp, correct: isCorrect },
    counters: next,
  };
}

export function applyInputChange(
  target: string,
  previousTyped: string,
  rawValue: string,
  counters: TypingStatsCounters,
  events: KeyEvent[],
  timestamp: number
): ApplyInputResult {
  const value = normalizeInputValue(previousTyped, rawValue, target.length);
  const nextCounters = { ...counters };
  let nextEvents = [...events];
  let typed = previousTyped;

  if (value.length < previousTyped.length) {
    typed = value;
    nextEvents = nextEvents.slice(0, value.length);
    return {
      typed,
      events: nextEvents,
      counters: nextCounters,
      finishedEarly: false,
    };
  }

  if (value.length > previousTyped.length) {
    for (let i = previousTyped.length; i < value.length; i++) {
      const newChar = value[i]!;
      const { event, counters: updated } = applySingleKeypress(
        nextCounters,
        target,
        i,
        newChar,
        timestamp
      );
      Object.assign(nextCounters, updated);
      nextEvents.push(event);
    }
    typed = value;
  }

  const finishedEarly =
    target.length > 0 && typed.length >= target.length;

  return {
    typed,
    events: nextEvents,
    counters: nextCounters,
    finishedEarly,
  };
}

export function isInactiveSession(counters: TypingStatsCounters): boolean {
  return counters.totalKeypresses === 0;
}

export function getDisplayAccuracy(counters: TypingStatsCounters): number {
  if (isInactiveSession(counters)) return 0;
  return computeAccuracy(counters);
}

export function shouldSaveSession(
  counters: TypingStatsCounters,
  wpm: number
): boolean {
  return counters.totalKeypresses > 0 && wpm >= 0;
}

export function createInitialCounters(): TypingStatsCounters {
  return createCounters();
}
