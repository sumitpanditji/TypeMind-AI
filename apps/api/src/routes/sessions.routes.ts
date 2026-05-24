import { Router } from "express";
import { typingSessionSchema } from "@typemind/shared";
import { TypingSession } from "../models/TypingSession";
import { authRequired } from "../middleware/auth";
import { updateStreak } from "../services/analytics.service";

const router = Router();

router.post("/", authRequired, async (req, res, next) => {
  try {
    const data = typingSessionSchema.parse(req.body);
    const session = await TypingSession.create({
      userId: req.user!.userId,
      ...data,
      completedAt: new Date(),
    });

    await updateStreak(req.user!.userId);

    res.status(201).json({
      sessionId: session._id.toString(),
      wpm: session.wpm,
      accuracy: session.accuracy,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/", authRequired, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || "1"), 10));
    const limit = Math.min(50, parseInt(String(req.query.limit || "20"), 10));
    const skip = (page - 1) * limit;

    const [sessions, total] = await Promise.all([
      TypingSession.find({ userId: req.user!.userId })
        .sort({ completedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("mode duration wpm rawWpm accuracy completedAt")
        .lean(),
      TypingSession.countDocuments({ userId: req.user!.userId }),
    ]);

    res.json({ sessions, total, page, limit });
  } catch (err) {
    next(err);
  }
});

export default router;
