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
    if (err instanceof AxiosError) {
      logger.error("Failed to send embed.", err);
    }
  }
}
