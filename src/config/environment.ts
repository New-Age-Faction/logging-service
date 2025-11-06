/*
  Singleton class that parses the environment's variables and makes them
  accessible to all the code throughout the entire service.
  
  These allows quick debug of your .env, ensuring this service actually reads
  the variables properly.
*/

// - Imports ------------------------------------------------------------------
import { logger } from "../utils/logger";
import { config } from "dotenv";

// - Classes ------------------------------------------------------------------
/**
 * Singleton class that hosts all of the environment variables required for
 * this service to run and execute properly
 */
class Environment {
  /**
   * Local instance kept within the class forever, to return only one
   * instantiated class ever.
   */
  private static instance: Environment;
  public port: string = "";
  public webhooks = {
    serviceLogging: "",
  };

  // Private constructor prevents external instantiation
  constructor() {
    if (Environment.instance) {
      return Environment.instance;
    }
    logger.info("Singleton, Building the environment");
    logger.debug("Running dotenv config()");
    config();
    logger.debug("Config ran successfully");

    // Time to extract the stuff from the process' env.
    this.setupPort();
    this.setupServiceLogWebHook();

    Environment.instance = this;
  }

  /**
   * Setup the port the application uses
   */
  private setupPort() {
    logger.debug("Managing port from env");
    const variable = process.env.PORT;

    if (variable === undefined) {
      logger.warning("PORT variable is undefined. Defaulting to 3000");
      this.port = "3000";
    } else {
      logger.info(`PORT variable is defined as ${variable}`);
      this.port = variable;
    }
  }

  /**
   * Setup the service log channel's webhook
   */
  private setupServiceLogWebHook() {
    logger.debug("Managing service logging webhook");
    const variable = process.env.SERVICE_LOGGING_WEBHOOK;

    if (variable === undefined) {
      logger.error("No webhook specified for the service logging!");
      throw new Error(
        "No webhook found in process' environment variables for the Service Logging discord channel: SERVICE_LOGGING_WEBHOOK. Without this, the service cannot send logs from services back to discord",
      );
    } else {
      logger.info(
        `Service webhook variable was found. Not printed for obvious reasons`,
      );
      this.webhooks.serviceLogging = variable;
    }
  }

  // Public method to access the single instance
  public static getInstance(): Environment {
    if (!Environment.instance) {
      Environment.instance = new Environment();
    }
    return Environment.instance;
  }
}

export const environment = new Environment();
