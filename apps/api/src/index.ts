import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDb } from "./config/db";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error";
import authRoutes from "./routes/auth.routes";
import sessionsRoutes from "./routes/sessions.routes";
import aiRoutes from "./routes/ai.routes";
import contentRoutes from "./routes/content.routes";
import analyticsRoutes from "./routes/analytics.routes";
import profileRoutes from "./routes/profile.routes";
import dailyRoutes from "./routes/daily.routes";
import adminRoutes from "./routes/admin.routes";
import leaderboardRoutes from "./routes/leaderboard.routes";
import { setupRaceSocket } from "./socket/race";

async function main() {
  await connectDb();

  const app = express();
  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cors: { origin: env.clientUrl, credentials: true },
  });
  setupRaceSocket(io);

  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "typemind-api" });
  });

  const api = express.Router();
  api.use("/auth", authRoutes);
  api.use("/sessions", sessionsRoutes);
  api.use("/ai", aiRoutes);
  api.use("/content", contentRoutes);
  api.use("/analytics", analyticsRoutes);
  api.use("/profile", profileRoutes);
  api.use("/daily", dailyRoutes);
  api.use("/admin", adminRoutes);
  api.use("/leaderboard", leaderboardRoutes);
  app.use("/api/v1", api);

  app.use(errorHandler);

  httpServer.listen(env.port, () => {
    console.log(`API running on http://localhost:${env.port}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
