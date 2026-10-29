import { createApp } from "./app.js";
import http from "node:http";
import env from "./config/env.js";
import { logger } from "./lib/logger.js";
import { assertDatabaseConnection } from "./db/db.js";

async function bootstrap() {
  try {
    console.log("hello")
    await assertDatabaseConnection();
    console.log("hello2")

    const app = createApp();
    const server = http.createServer(app);
    const port = Number(env.PORT) || 5000;


    server.listen(port, () => {
      logger.info(`"Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    logger.error("Failed to start the server", (error as Error).message);
    process.exit(1);
  }
}

bootstrap();