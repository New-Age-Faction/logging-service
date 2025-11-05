/*
  Routes all the sub routes of the service logging to their individual
  endpoints. Essentially linking the controller to the endpoints.
*/

// - Imports ------------------------------------------------------------------
import { Router } from "express";
import { logEvent } from "../controllers/serviceLogs.controller";
import { logger } from "../utils/logger";

// - Routing ------------------------------------------------------------------
const router = Router();

logger.debug("Binding log events to router");
router.post("/log", logEvent);

logger.info("Service log router configured");
export default router;
