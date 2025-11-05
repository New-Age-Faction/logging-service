import axios from "axios";
import { logger } from "../utils/logger";

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL!;

interface DiscordEmbed {
  title: string;
  description: string;
  color?: number;
  fields?: { name: string; value: string; inline?: boolean }[];
}

export async function sendDiscordEmbed(embed: DiscordEmbed) {
  try {
    await axios.post(DISCORD_WEBHOOK, {
      embeds: [embed],
    });
    logger.info(`Sent embed: ${embed.title}`);
  } catch (err) {
    logger.error("Failed to send Discord message", err);
  }
}
