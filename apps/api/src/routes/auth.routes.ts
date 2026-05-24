import { Router } from "express";
import bcrypt from "bcryptjs";
import { registerSchema, loginSchema } from "@typemind/shared";
import { User } from "../models/User";
import { UserProfile } from "../models/UserProfile";
import { AppError } from "../middleware/error";
import { authRequired } from "../middleware/auth";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/tokens";
const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await User.findOne({
      $or: [{ email: data.email }, { username: data.username }],
    });
    if (existing) {
      throw new AppError(409, "Email or username already exists");
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await User.create({
      email: data.email,
      username: data.username,
      passwordHash,
    });

    await UserProfile.create({
      userId: user._id,
      displayName: data.username,
    });

    const authUser = {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role as "user" | "admin",
    };

    const accessToken = signAccessToken(authUser);
    const refreshToken = signRefreshToken(authUser);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ user: authUser, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await User.findOne({ email: data.email });
    if (!user) throw new AppError(401, "Invalid credentials");

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) throw new AppError(401, "Invalid credentials");

    const authUser = {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role as "user" | "admin",
    };

    const accessToken = signAccessToken(authUser);
    const refreshToken = signRefreshToken(authUser);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ user: authUser, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) throw new AppError(401, "Refresh token required");

    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.userId);
    if (!user) throw new AppError(401, "User not found");

    const authUser = {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role as "user" | "admin",
    };

    const accessToken = signAccessToken(authUser);
    const refreshToken = signRefreshToken(authUser);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
});

router.get("/me", authRequired, async (req, res, next) => {
  try {
    const user = await User.findById(req.user!.userId);
    if (!user) throw new AppError(404, "User not found");

    const profile = await UserProfile.findOne({ userId: user._id }).lean();

    res.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role,
      },
      profile,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie("refreshToken", { httpOnly: true, sameSite: "lax" });
  res.json({ message: "Logged out" });
});

export default router;
