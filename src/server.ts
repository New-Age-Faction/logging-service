// - Start of service ---------------------------------------------------------
import app from "./app";
import { logger } from "./utils/logger";

// - Config loading -----------------------------------------------------------
logger.debug("Ensuring the environment is built first.");
import { environment } from "./config/environment";
import { service } from "./services/Service.service";
import axios from "axios";
logger.notice(`Service is using port: ${environment.port}`);
logger.debug(
  "Environment parsed. The rest of the service can continue its initialization",
);

// - Service's logging --------------------------------------------------------
service.setName("Webhook Logging Service");
service.setIcon("https://cdn-icons-png.flaticon.com/512/4400/4400537.png");

// - App management -----------------------------------------------------------

const server = app.listen(environment.port, () => {
  logger.notice(`Application started ${environment.port}`);
  service.launched();
});

// - Process terminaisons -----------------------------------------------------
process.on("uncaughtException", async (err: Error) => {
  logger.crit("Uncaught exception occurred!", err);
  await service.traceback(err).finally(() => {});
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Awaits traceback before the shutdown message
  await service.shutdown("Critical unhandled exception");
  await shutdown();
  logger.error("Printing stack trace");
  console.log(err.stack);
  logger.warning("Application will terminate.");
  logger.notice("Service died.");
  process.exit(1);
});

// CTRL+C
process.on("SIGINT", async () => {
  await service.shutdown("Terminated by SIGINT");
  await shutdown();
  logger.notice("Service died.");
  process.exit(0);
});

// kill command or system shutdown
process.on("SIGTERM", async () => {
  await service.shutdown("Terminated by SIGTERM");
  await shutdown();
  logger.notice("Service died.");
  process.exit(0);
});

const shutdown = async () => {
  logger.debug("Cleaning server resources");
  // Force waiting 1 second for potential axios requests to FULLY terminate
  await new Promise((resolve) => setTimeout(resolve, 1000)); // small buffer
  await new Promise((resolve) => server.close(resolve));
  logger.info("Resources were cleaned up");
};
