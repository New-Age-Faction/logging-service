// - Start of service ---------------------------------------------------------
import { config } from "dotenv";
import app from "./app";
import { logger } from "./utils/logger";
// - Config loading -----------------------------------------------------------
logger.debug("Loading config...");
config();
logger.debug("Environment config loaded");

// - App management -----------------------------------------------------------
const PORT = process.env.PORT || 3000;
logger.notice(`Service is using port: ${PORT}`);

app.listen(PORT, () => {
  logger.notice(`Application started ${PORT}`);
});
