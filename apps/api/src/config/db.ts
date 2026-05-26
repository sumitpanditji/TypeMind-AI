import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { env } from "./env";
import { seedDemoData } from "../seed/demo-data";

let memoryServer: MongoMemoryServer | null = null;

export async function connectDb(): Promise<void> {
  try {
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB connected");
  } catch (err) {
    if (!env.demoDbFallback) {
      console.error("MongoDB connection error:", err);
      throw err;
    }

    console.warn("MongoDB is not available. Starting in-memory demo database.");
    memoryServer = await MongoMemoryServer.create({
      instance: { dbName: "typemind-demo" },
    });
    await mongoose.connect(memoryServer.getUri());
    await seedDemoData();
    console.log("In-memory MongoDB connected with demo seed data");
    console.log("Demo login: demo@typemind.local / Demo@12345");
    console.log("Admin login: admin@typemind.local / Admin@12345");
  }
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
