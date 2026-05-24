import { Router } from "express";
import { analyzeSchema, generateTextSchema, typingSessionSchema } from "@typemind/shared";
import { authRequired } from "../middleware/auth";
import { TypingSession } from "../models/TypingSession";
import { analyzeSession, generateAdaptiveText } from "../services/ai-coach.service";
import { AppError } from "../middleware/error";

const router = Router();

router.post("/analyze", authRequired, async (req, res, next) => {
  try {
    const body = analyzeSchema.parse(req.body);
    let session = body.session;

    if (body.sessionId && !session) {
      const doc = await TypingSession.findOne({
        _id: body.sessionId,
        userId: req.user!.userId,
      }).lean();
      if (!doc) throw new AppError(404, "Session not found");
      session = typingSessionSchema.parse({
        mode: doc.mode,
        duration: doc.duration,
        language: doc.language,
        wpm: doc.wpm,
        rawWpm: doc.rawWpm,
        accuracy: doc.accuracy,
        charStats: doc.charStats,
        ngramMistakes: doc.ngramMistakes,
        keyEvents: doc.keyEvents,
      });
    }

    if (!session) throw new AppError(400, "Session data required");

    const result = await analyzeSession(req.user!.userId, session);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/generate-text", authRequired, async (req, res, next) => {
  try {
    const body = generateTextSchema.parse(req.body);
    const result = await generateAdaptiveText(req.user!.userId, body.focusAreas);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
