/**
 * Monkeytype-style typing statistics.
 * Mistakes count every wrong keystroke and are NOT undone by backspace.
 */

export interface TypingStatsCounters {
  mistakes: number;
  correctKeypresses: number;
  extraKeypresses: number;
  totalKeypresses: number;
}

export function createCounters(): TypingStatsCounters {
  return {
    mistakes: 0,
    correctKeypresses: 0,
    extraKeypresses: 0,
    totalKeypresses: 0,
  };
}

/** Accuracy = correct keypresses / all keypresses (mistakes stay after backspace) */
export function computeAccuracy(counters: TypingStatsCounters): number {
  if (counters.totalKeypresses === 0) return 0;
  return Math.round(
    (counters.correctKeypresses / counters.totalKeypresses) * 100
  );
}

/** WPM = (correct characters in final text / 5) / minutes */
export function computeWpm(
  correctCharCount: number,
  elapsedSeconds: number
): number {
  if (elapsedSeconds <= 0 || correctCharCount <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  const wpm = correctCharCount / 5 / minutes;
  if (!Number.isFinite(wpm) || wpm < 0) return 0;
  return Math.round(wpm);
}

export function computeRawWpm(
  totalTypedChars: number,
  elapsedSeconds: number
): number {
  if (elapsedSeconds <= 0 || totalTypedChars <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  const wpm = totalTypedChars / 5 / minutes;
  if (!Number.isFinite(wpm) || wpm < 0) return 0;
  return Math.round(wpm);
}

export function countMatchingChars(target: string, typed: string): number {
  let n = 0;
  const len = Math.min(target.length, typed.length);
  for (let i = 0; i < len; i++) {
    if (typed[i] === target[i]) n++;
  }
  return n;
}

/** Simple hash for leaderboard grouping by prompt text */
export function hashContent(text: string): string {
  if (!text.trim()) return "c_empty";
  let h = 0;
  const normalized = text.trim().slice(0, 500);
  for (let i = 0; i < normalized.length; i++) {
    h = (Math.imul(31, h) + normalized.charCodeAt(i)) | 0;
  }
  return `c_${(h >>> 0).toString(36)}`;
}
