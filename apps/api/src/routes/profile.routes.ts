import { Router } from "express";
import { settingsSchema } from "@typemind/shared";
import { authRequired } from "../middleware/auth";
import { User } from "../models/User";
import { UserProfile } from "../models/UserProfile";
import { AppError } from "../middleware/error";

const router = Router();

router.get("/settings", authRequired, async (req, res, next) => {
  try {
    let profile = await UserProfile.findOne({ userId: req.user!.userId });
    if (!profile) {
      const user = await User.findById(req.user!.userId);
      if (!user) throw new AppError(404, "User not found");
      profile = await UserProfile.create({
        userId: user._id,
        displayName: user.username,
      });
    }
    res.json({
      settings: profile.settings,
      displayName: profile.displayName,
    });
  } catch (err) {
    next(err);
  }
});

router.patch("/settings", authRequired, async (req, res, next) => {
  try {
    const data = settingsSchema.parse(req.body ?? {});
    let profile = await UserProfile.findOne({ userId: req.user!.userId });
    if (!profile) {
      const user = await User.findById(req.user!.userId);
      if (!user) throw new AppError(404, "User not found");
      profile = await UserProfile.create({
        userId: user._id,
        displayName: user.username,
      });
    }

    if (data.fontSize !== undefined) profile.settings.fontSize = data.fontSize;
    if (data.sound !== undefined) profile.settings.sound = data.sound;
    if (data.cursorStyle !== undefined) profile.settings.cursorStyle = data.cursorStyle;
    if (data.showKeyboard !== undefined) profile.settings.showKeyboard = data.showKeyboard;
    if (data.animations !== undefined) profile.settings.animations = data.animations;

    profile.markModified("settings");
    await profile.save();
    res.json({ settings: profile.settings });
  } catch (err) {
    next(err);
  }
});

export default router;
