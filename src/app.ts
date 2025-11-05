// - Imports ------------------------------------------------------------------
import express from "express";
import routes from "./routes";
import { logger } from "./utils/logger";
//import { errorHandler } from "./utils/errorHandler";

// - Application management ---------------------------------------------------
logger.debug("Getting app from express");
const app = express();

app.use(express.json());
logger.debug("Binding routes to application");
app.use("/", routes);
//app.use(errorHandler);

export default app;
