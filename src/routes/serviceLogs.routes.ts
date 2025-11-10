/*
  Routes all the sub routes of the service logging to their individual
  endpoints. Essentially linking the controller to the endpoints.
*/

// - Imports ------------------------------------------------------------------
import { Router } from "express";
import { logger } from "../utils/logger";
import path from "path";
import fs from "fs";
import { makeServiceLogController } from "../controllers/serviceLogs.controller";

// - Routing ------------------------------------------------------------------
// TODO: CLEAN UP
const router = Router();

logger.info("Managing ServiceLogs endpoints...");
logger.debug("Creating path to service log endpoint strategies");
const endpointsDir = path.join(__dirname, "../strategies/serviceLogs");
logger.debug(`Strategies are found in: ${endpointsDir}`);

logger.debug(`Gathering endpoint strategy files`);
const files = fs
  .readdirSync(endpointsDir)
  .filter((f) => f.endsWith(".strategy.ts"));

for (const file of files) {
  logger.debug(`\tManaging: ${file}`);
  const modulePath = path.join(endpointsDir, file);
  const module = import(modulePath).then((module) => {
    logger.info(`Finished importing ${file}. Parsing import contents`);

    // Find the exported class (assume first exported class is the endpoint)
    const EndpointClass = Object.values(module).find(
      (v) => typeof v === "function" && v.toString().startsWith("class "),
    ) as new () => any;

    if (!EndpointClass) {
      logger.warning(`\tSkipping. No valid endpoint class found.`);
    }

    const endpoint = new EndpointClass();
    const controller = makeServiceLogController(endpoint);
    router.post(`/${endpoint.name}`, controller);
  });
}

logger.info("Service log router configured");
export default router;
