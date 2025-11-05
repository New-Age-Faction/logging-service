// - Start of service ---------------------------------------------------------
import app from "./app";
import Environment from "./config/environment";
import { logger } from "./utils/logger";
// - Config loading -----------------------------------------------------------
logger.debug("Loading config...");
const environment = new Environment();
logger.debug("Environment config loaded");

// - App management -----------------------------------------------------------
logger.notice(`Service is using port: ${environment.port}`);

app.listen(environment.port, () => {
  logger.notice(`Application started ${environment.port}`);
});
