import axios, { AxiosError } from "axios";
import { logger } from "../utils/logger";
import { EmbedBuilder } from "discord.js";

export async function sendDiscordEmbed(
  embed: EmbedBuilder,
  webhookURL: string,
) {
  try {
    await axios.post(webhookURL, {
      embeds: [embed.toJSON()],
    });
    logger.info(`Sent embed: ${embed.data.color}`);
  } catch (err) {
    logger.error("Failed to send an embed to discord");
    if (err instanceof AxiosError) {
      logger.error("Failed to send embed. Axios error", err);
    }
  }
}

export async function sendDiscordMessage(content: string, webhookURL: string) {
  try {
    await axios.post(webhookURL, {
      content, // Discord webhooks accept plain text messages via the "content" field
    });

    logger.info(`Sent message: "${content}"`);
  } catch (err) {
    logger.error("Failed to send message to Discord");
    if (err instanceof AxiosError) {
      logger.error("Failed to send message. Axios error", err);
    }
  }
}
