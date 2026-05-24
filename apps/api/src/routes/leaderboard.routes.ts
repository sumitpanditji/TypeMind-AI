import { Router } from "express";
import { TypingSession } from "../models/TypingSession";
import { User } from "../models/User";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const mode = (req.query.mode as string) || "words";
    const duration = req.query.duration ? Number(req.query.duration) : undefined;
    const contentHash = req.query.contentHash as string | undefined;
    const limit = Math.min(50, Number(req.query.limit) || 25);

    const match: Record<string, unknown> = {
      userId: { $exists: true, $ne: null },
    };

    if (contentHash) {
      match.contentHash = contentHash;
    } else {
      match.mode = mode;
      if (duration) match.duration = duration;
    }

    const sessions = await TypingSession.aggregate([
      { $match: match },
      { $sort: { wpm: -1, accuracy: -1, completedAt: -1 } },
      {
        $group: {
          _id: "$userId",
          bestWpm: { $max: "$wpm" },
          bestAccuracy: { $max: "$accuracy" },
          bestRawWpm: { $max: "$rawWpm" },
          mode: { $first: "$mode" },
          duration: { $first: "$duration" },
          contentPreview: { $first: "$contentPreview" },
          completedAt: { $max: "$completedAt" },
        },
      },
      { $sort: { bestWpm: -1, bestAccuracy: -1 } },
      { $limit: limit },
    ]);

    const userIds = sessions.map((s) => s._id);
    const users = await User.find({ _id: { $in: userIds } })
      .select("username")
      .lean();
    const userMap = new Map(users.map((u) => [u._id.toString(), u.username]));

    const entries = sessions.map((s, i) => ({
      rank: i + 1,
      userId: s._id.toString(),
      username: userMap.get(s._id.toString()) ?? "Unknown",
      wpm: Math.round(s.bestWpm),
      accuracy: Math.round(s.bestAccuracy),
      rawWpm: Math.round(s.bestRawWpm),
      mode: s.mode,
      duration: s.duration,
      completedAt:
        s.completedAt instanceof Date
          ? s.completedAt.toISOString()
          : String(s.completedAt ?? ""),
    }));

    res.json({
      entries,
      filter: { mode, duration, contentHash },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
