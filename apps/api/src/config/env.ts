import dotenv from "dotenv";

dotenv.config();

const demoDbFallback =
  process.env.DEMO_DB_FALLBACK !== undefined
    ? process.env.DEMO_DB_FALLBACK.toLowerCase() === "true"
    : process.env.NODE_ENV !== "production";

export const env = {
  port: parseInt(process.env.PORT || "4000", 10),
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/typemind",
  demoDbFallback,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "dev-access-secret-change-in-production",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "dev-refresh-secret-change-in-production",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  accessTokenExpiry: "15m",
  refreshTokenExpiry: "7d",
};
