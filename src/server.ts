
import "reflect-metadata";

import './di/inversify.config'

import app from "./app";
import connectDB from "./config/Database";
import dotenv from "dotenv";
import { logger } from "./config/logger";


dotenv.config({ path: "src/.env" }); 

const PORT = process.env.PORT || 5000;

let server: ReturnType<typeof app.listen>; 

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(PORT, () => {
      logger.info(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};

startServer();


// Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("🔻 SIGINT received. Shutting down gracefully...");

  if (server) {
    server.close(() => {
      console.log("🛑 HTTP server closed.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
