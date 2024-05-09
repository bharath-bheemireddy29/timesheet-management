// Importing modules with ES6 syntax
import mongoose from "mongoose";
import app from "./app";
import config from "./config/config";
import logger from "./config/logger";
import { Server } from "http";
import insertUsers from "./services/dumpUsers";

let server: Server | undefined;

mongoose.connect(config.mongoose.url).then(async () => {
  logger.info("Connected to MongoDB");
  // await insertUsers();
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

const exitHandler = (): void => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error): void => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
