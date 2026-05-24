import { Router } from "express";
import { settingsSchema } from "@typemind/shared";
import { authRequired } from "../middleware/auth";
import { UserProfile } from "../models/UserProfile";
import { AppError } from "../middleware/error";

const router = Router();

router.get("/settings", authRequired, async (req, res, next) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user!.userId }).lean();
    if (!profile) throw new AppError(404, "Profile not found");
    res.json({ settings: profile.settings, displayName: profile.displayName });
  } catch (err) {
    next(err);
  }
});

router.patch("/settings", authRequired, async (req, res, next) => {
  try {
    const data = settingsSchema.parse(req.body);
    const profile = await UserProfile.findOne({ userId: req.user!.userId });
    if (!profile) throw new AppError(404, "Profile not found");

    if (data.fontSize !== undefined) profile.settings.fontSize = data.fontSize;
    if (data.sound !== undefined) profile.settings.sound = data.sound;
    if (data.cursorStyle !== undefined) profile.settings.cursorStyle = data.cursorStyle;
    if (data.showKeyboard !== undefined) profile.settings.showKeyboard = data.showKeyboard;
    if (data.animations !== undefined) profile.settings.animations = data.animations;

    await profile.save();
    res.json({ settings: profile.settings });
  } catch (err) {
    next(err);
  }
});

export default router;
