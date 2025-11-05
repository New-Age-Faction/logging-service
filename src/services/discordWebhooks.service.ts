import axios from "axios";
import { logger } from "../utils/logger";
import Environment from "../config/environment";

const environment = new Environment();

interface DiscordEmbed {
  title: string;
  description: string;
  color?: number;
  fields?: { name: string; value: string; inline?: boolean }[];
}

export async function sendDiscordEmbed(embed: DiscordEmbed) {
  try {
    await axios.post(environment.webhooks.serviceLogging, {
      embeds: [embed],
    });
    logger.info(`Sent embed: ${embed.title}`);
  } catch (err) {
    logger.error("Failed to send Discord message", err);
  }
}
