import { Router } from "express";
import { authRequired, adminRequired } from "../middleware/auth";
import { User } from "../models/User";
import { TypingSession } from "../models/TypingSession";

const router = Router();

router.use(authRequired, adminRequired);

router.get("/users", async (_req, res, next) => {
  try {
    const users = await User.find()
      .select("email username role createdAt")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const withStats = await Promise.all(
      users.map(async (u) => {
        const sessions = await TypingSession.countDocuments({ userId: u._id });
        const best = await TypingSession.findOne({ userId: u._id })
          .sort({ wpm: -1 })
          .select("wpm")
          .lean();
        return {
          id: u._id.toString(),
          email: u.email,
          username: u.username,
          role: u.role,
          createdAt: u.createdAt,
          totalSessions: sessions,
          bestWpm: best?.wpm ?? 0,
        };
      })
    );

    res.json({ users: withStats, total: withStats.length });
  } catch (err) {
    next(err);
  }
});

router.get("/stats", async (_req, res, next) => {
  try {
    const [userCount, sessionCount] = await Promise.all([
      User.countDocuments(),
      TypingSession.countDocuments(),
    ]);
    res.json({ userCount, sessionCount });
  } catch (err) {
    next(err);
  }
});

export default router;
