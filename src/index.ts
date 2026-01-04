import { ExtendedClient } from "@/structs/ExtendedClient";
import { log } from "@/utils/Logger";
import { logErrorToWebhook } from "@/utils/WebhookLogger";
import prisma from "@/lib/prisma";
import redis from "@/lib/redis";
import process from "node:process";
const client = new ExtendedClient();
client.start();
const shutdown = async (signal: string) => {
  log(`Received ${signal}. Shutting down gracefully...`, "info");
  try {
    await client.destroy();
    log("Discord Client destroyed.", "done");
    await prisma.$disconnect();
    log("Prisma disconnected.", "done");
    await redis.quit();
    log("Redis disconnected.", "done");
    process.exit(0);
  } catch (error) {
    log(`Error during shutdown: ${error}`, "err");
    process.exit(1);
  }
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("unhandledRejection", async (reason, promise) => {
  const errorMsg = `Unhandled Rejection at: ${promise}\nReason: ${reason}`;
  log(errorMsg, "err");
  await logErrorToWebhook(reason, "Unhandled Rejection");
});
process.on("uncaughtException", async (err) => {
  log(`Uncaught Exception: ${err}`, "err");
  await logErrorToWebhook(err, "Uncaught Exception");
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
  log(`Uncaught Exception Monitor: ${err}\nOrigin: ${origin}`, "err");
});