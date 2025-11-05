import axios from "axios";
import { logger } from "../utils/logger";
import Environment from "../config/environment";
import { EmbedBuilder } from "discord.js";

const environment = new Environment();

export async function sendDiscordEmbed(embed: EmbedBuilder) {
  try {
    await axios.post(environment.webhooks.serviceLogging, {
      embeds: [embed.toJSON()],
    });
    logger.info(`Sent embed: ${embed.data.type}`);
  } catch (err) {
    logger.error("Failed to send Discord message", err);
  }
}
