import mongoose from "mongoose";
import { env } from "../config/env";
import { demoCredentials, seedDemoData } from "../seed/demo-data";

async function main(): Promise<void> {
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 });
  await seedDemoData();

  console.log("Demo data seeded successfully.");
  console.log("Login accounts:");
  for (const credential of demoCredentials) {
    console.log(
      `- ${credential.role}: ${credential.email} / ${credential.password}`
    );
  }
}

main()
  .catch((err) => {
    console.error("Failed to seed demo data:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
