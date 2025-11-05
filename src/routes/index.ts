/*
  Entry point for the routing logic handled by this service.
  The goal of this file is to setup all the routes of the different services
  types instanciated by this logging service.
*/

// - Imports ------------------------------------------------------------------
import { Router } from "express";
import serviceLogs from "./serviceLogs.routes";
import { logger } from "../utils/logger";
//import discordRoutes from "./discord.routes";
//import gameChatRoutes from "./gameChat.routes";

// - Router -------------------------------------------------------------------
const router = Router();

logger.debug("Binding services router to main router");
router.use("/services", serviceLogs);

logger.info("Main logger configured");
export default router;
