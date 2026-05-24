import { Router } from "express";
import { generateWordsText } from "@typemind/shared";

const router = Router();

const CHALLENGES = [
  "The quick brown fox jumps over the lazy dog while practicing precision typing every single day.",
  "Speed and accuracy together form the foundation of every great typist on their journey to mastery.",
  "Practice punctuation carefully: commas, periods, and semicolons; they matter more than you think!",
  "Numbers 12345 and symbols @#$% challenge your fingers to move with confidence and control.",
];

function getDayIndex(): number {
  const start = new Date("2025-01-01T00:00:00Z").getTime();
  const now = Date.now();
  return Math.floor((now - start) / (24 * 60 * 60 * 1000));
}

router.get("/challenge", (_req, res) => {
  const dayIndex = getDayIndex();
  const text = CHALLENGES[dayIndex % CHALLENGES.length] ?? generateWordsText(40);
  const date = new Date().toISOString().split("T")[0];

  res.json({
    date,
    title: `Daily Challenge — ${date}`,
    text,
    duration: 60,
    participants: Math.floor(120 + (dayIndex % 50)),
  });
});

export default router;
