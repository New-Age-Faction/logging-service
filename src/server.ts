// - Start of service ---------------------------------------------------------
import app from "./app";
import { logger } from "./utils/logger";

// - Config loading -----------------------------------------------------------
logger.debug("Ensuring the environment is built first.");
import { environment } from "./config/environment";
import { service } from "./services/Service.service";
logger.notice(`Service is using port: ${environment.port}`);
logger.debug(
  "Environment parsed. The rest of the service can continue its initialization",
);

// - Service's logging --------------------------------------------------------
service.setName("Webhook Logging Service");
service.setIcon("https://cdn-icons-png.flaticon.com/512/18823/18823661.png");

// - App management -----------------------------------------------------------

app.listen(environment.port, () => {
  logger.notice(`Application started ${environment.port}`);
  service.launched();
});
