import express from "express";
import cors from "cors";
import helmet from "helmet";
import { notFoundErrorHandler } from "./middleware/notFoundErrorHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: `http://localhost:3000`,
      credentials: true,
    }),
  );
  app.use(express.json());

  app.use(notFoundErrorHandler);
  app.use(errorHandler);

  return app;
}
