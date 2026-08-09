import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";

async function start() {
  try {
    if (env.mongoUri) {
      try {
        await connectDB(env.mongoUri);
      } catch (dbError) {
        console.warn("MongoDB not connected —", dbError.message);
        if (env.nodeEnv === "production") {
          console.error("Exiting: MongoDB is required in production");
          process.exit(1);
        }
      }
    } else {
      console.warn("MONGODB_URI missing — starting without database");
      if (env.nodeEnv === "production") {
        console.error("Exiting: MONGODB_URI is required in production");
        process.exit(1);
      }
    }

    // Bind all interfaces so Render/containers can reach the process
    app.listen(env.port, "0.0.0.0", () => {
      console.log(`Server listening on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

start();
