// src/controllers/serviceLog.controller.ts
import { Request, Response, NextFunction } from "express";
import { sendDiscordEmbed } from "../services/discordWebhooks.service";
import { environment } from "../config/environment";
import ServiceLogEndpointStrategy from "../strategies/serviceLogs/strategyInterface";
import addServiceIdentificationToEmbed from "../utils/serviceLogEmbedBase";
import { logger } from "../utils/logger";
import { baseServiceLogSchema } from "../schemas/baseServiceLog.schema";
import z from "zod";

type BaseServiceLog = z.infer<typeof baseServiceLogSchema>;

/**
 * Create an endpoint controller from a service strategy.
 * Since all the service logging does the same exact thing... aka build an
 * embed and send it to discord... this allows us
 * @param strategy
 * @returns
 */
export const makeServiceLogController = <T extends BaseServiceLog>(
  strategy: ServiceLogEndpointStrategy<T>,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = strategy.schema.parse(req.body);
      let embed = strategy.buildEmbed(data);
      embed = addServiceIdentificationToEmbed(embed, data);
      await sendDiscordEmbed(embed, environment.webhooks.serviceLogging);
      logger.debug(
        `Sent an embed to the service log channel. Footer text: ${embed.data.footer?.text}, title: ${embed.data.title}, author: ${embed.data.author?.name}`,
      );
      res.status(200).json({ status: "ok" });
    } catch (err) {
      next(err);
    }
  };
};
