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
      }
    } else {
      console.warn("MONGODB_URI missing — starting without database");
    }

    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

start();
