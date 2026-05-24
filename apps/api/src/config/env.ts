import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || "4000", 10),
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/typemind",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "dev-access-secret-change-in-production",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "dev-refresh-secret-change-in-production",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  accessTokenExpiry: "15m",
  refreshTokenExpiry: "7d",
};
