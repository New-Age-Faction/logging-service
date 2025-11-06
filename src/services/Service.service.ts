/**
 * Singleton class that handles this service's own logging.
 * This can be confusing because the logging service... kinda needs itself
 * to log itself doesn't it...
 *
 * Well, this is the management OTHER services implement with HTTP requests
 * to the logging service. However, since we're already the logging service,
 * direct webhook calls can be made to log ourselves.
 */

// - Imports ------------------------------------------------------------------
import { EmbedBuilder } from "discord.js";
import { environment } from "../config/environment";
import LaunchedEndpoint from "../strategies/serviceLogs/launched.strategy";
import { logger } from "../utils/logger";
import { sendDiscordEmbed } from "./discordWebhooks.service";
import addServiceIdentificationToEmbed from "../utils/serviceLogEmbedBase";
import TracebackEndpoint from "../strategies/serviceLogs/traceback.strategy";
import { parseErrorStack } from "../utils/parseErrorStack";
import ShutdownEndpoint from "../strategies/serviceLogs/shutdown.strategy";

// - Classes ------------------------------------------------------------------
class Service {
  /**
   * Local instance kept within the class forever, to return only one
   * instantiated class ever.
   */
  private static instance: Service;
  public displayName: string = "";
  public iconUrl: string = "";

  constructor() {
    if (Service.instance) {
      return Service.instance;
    }
    this.displayName = "NOT SET";
    this.iconUrl = "";
    logger.debug("Service's service manager instantiated");
    Service.instance = this;
  }

  public static getInstance(): Service {
    if (!Service.instance) {
      Service.instance = new Service();
    }
    return Service.instance;
  }

  public setName(name: string) {
    this.displayName = name;
  }

  public setIcon(url: string) {
    this.iconUrl = url;
  }

  private async sendEmbed(embed: EmbedBuilder) {
    const contextualizedEmbed = addServiceIdentificationToEmbed(embed, {
      serviceName: this.displayName,
      serviceIcon: this.iconUrl,
    });
    logger.debug("Awaiting sendDiscordEmbed");
    await sendDiscordEmbed(
      contextualizedEmbed,
      environment.webhooks.serviceLogging,
    );
  }

  /**
   * Call this when the service has fully launched and becomes completely
   * operational.
   */
  public async launched() {
    logger.debug("Service is self sending itself as launched");
    const endpoint = new LaunchedEndpoint();
    const embed = endpoint.buildEmbed({
      serviceName: this.displayName,
      serviceIcon: this.iconUrl,
    });
    this.sendEmbed(embed);
  }

  /**
   * Call this when the service goes through a critical crash and needs to send
   * a full traceback to the webhook service
   */
  public async traceback(err: Error) {
    logger.debug("Service is self sending a traceback");
    const parsed = parseErrorStack(err.stack);

    const endpoint = new TracebackEndpoint();
    const embed = endpoint.buildEmbed({
      serviceName: this.displayName,
      serviceIcon: this.iconUrl,
      column: parsed?.column,
      line: parsed?.line,
      message: err.message,
      stackTrace: err.stack,
      file: parsed?.file,
      method: parsed?.method,
    });
    this.sendEmbed(embed);
  }

  /**
   * Call this when the service finally shuts down.
   * You WILL need to await a promise of minimum 1000ms to ensure
   * that the embed has been propagated to discord
   */
  public async shutdown(reason: string) {
    logger.debug("Service is self sending a shutdown");

    const endpoint = new ShutdownEndpoint();
    const embed = endpoint.buildEmbed({
      serviceName: this.displayName,
      serviceIcon: this.iconUrl,
      reason: reason,
    });
    this.sendEmbed(embed);
  }
}

export const service = new Service();
