
import app from "./app";
import connectDB from "./config/Database";
import dotenv from "dotenv";

dotenv.config({ path: "src/.env" });

const PORT = process.env.PORT || 5000;


const startServer = async () => {
  try {
    await connectDB(); 
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
  }
};

startServer();

// Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("🔻 Closing server...");
  await connectDB(); 
  process.exit(0);
});