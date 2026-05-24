import { Router } from "express";
import { authRequired } from "../middleware/auth";
import { getAnalyticsSummary } from "../services/analytics.service";

const router = Router();

router.get("/summary", authRequired, async (req, res, next) => {
  try {
    const summary = await getAnalyticsSummary(req.user!.userId);
    res.json(summary);
  } catch (err) {
    next(err);
  }
});

export default router;
