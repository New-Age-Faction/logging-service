// src/controllers/serviceLog.controller.ts
import { Request, Response, NextFunction } from "express";
import {
  sendDiscordEmbed,
  sendDiscordMessage,
} from "../services/discordWebhooks.service";
import { environment } from "../config/environment";
import { logger } from "../utils/logger";
import z from "zod";
import { baseLiveChatSchema } from "../schemas/baseLivechat.schema";
import LiveChatEndpointStrategy from "../strategies/liveChat/strategyInterface";

type BaseLiveChatLog = z.infer<typeof baseLiveChatSchema>;

/**
 * Create an endpoint controller from a live chat strategy.
 * Since all the live chat logging does the same exact thing... aka build an
 * embed and send it to discord... this allows us to avoid copy pasting this
 * logic for every service logs or something.
 * @param strategy
 * @returns
 */
export const makeLiveChatController = <T extends BaseLiveChatLog>(
  strategy: LiveChatEndpointStrategy<T>,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = strategy.schema.parse(req.body);

      // Public is managed only if specified and wanted.
      const canBePublic = strategy.public;
      if (canBePublic && !data.privateOnly) {
        const publicEmbed = strategy.buildPublic(data);
        await sendDiscordEmbed(
          publicEmbed,
          environment.webhooks.publicLiveServer,
        );
      }

      // Private logging management
      const privateString = strategy.buildPrivate(data);
      await sendDiscordMessage(
        privateString,
        environment.webhooks.privateLiveServer,
      );
      logger.debug(`Sent live chat data to appropriate log channel.`);
      res.status(200).json({ status: "ok" });
    } catch (err) {
      next(err);
    }
  };
};
