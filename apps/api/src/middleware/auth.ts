import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "./error";

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function authRequired(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    next(new AppError(401, "Authentication required"));
    return;
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.jwtAccessSecret) as AuthPayload;
    req.user = payload;
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token"));
  }
}

export function authOptional(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    next();
    return;
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.jwtAccessSecret) as AuthPayload;
    req.user = payload;
  } catch {
    // ignore invalid token for optional auth
  }
  next();
}

export function adminRequired(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.user || req.user.role !== "admin") {
    next(new AppError(403, "Admin access required"));
    return;
  }
  next();
}
