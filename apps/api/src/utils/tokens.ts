import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import type { AuthUser } from "@typemind/shared";

const accessOptions: SignOptions = { expiresIn: "15m" };
const refreshOptions: SignOptions = { expiresIn: "7d" };

export function signAccessToken(user: AuthUser): string {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    env.jwtAccessSecret,
    accessOptions
  );
}

export function signRefreshToken(user: AuthUser): string {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    env.jwtRefreshSecret,
    refreshOptions
  );
}

export function verifyRefreshToken(token: string): { userId: string; email: string; role: string } {
  return jwt.verify(token, env.jwtRefreshSecret) as {
    userId: string;
    email: string;
    role: string;
  };
}
