/**
 * Changes the metadata of embeds used to log service's stuff.
 * Adds the fields and formatting that ALL service logging embed contains.
 *
 * This logic is to be implemented after the strategies have built their
 * embeds.
 */

// - Imports ------------------------------------------------------------------
import { EmbedBuilder } from "discord.js";
import z from "zod";
import { baseServiceLogSchema } from "../schemas/baseServiceLog.schema";

// - Classes ------------------------------------------------------------------
type BaseServiceLog = z.infer<typeof baseServiceLogSchema>;

export default function addServiceIdentificationToEmbed<
  T extends BaseServiceLog,
>(embed: EmbedBuilder, data: T): EmbedBuilder {
  // Builder functions not utilized due to formatting issues when the same builder methods are called multiple times.
  embed.data.footer = {
    text: data.serviceName,
    icon_url: data.serviceIcon,
  };
  embed.setTimestamp();
  return embed;
}
