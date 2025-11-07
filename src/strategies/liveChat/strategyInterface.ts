/**
 * Defines the base interface that all endpoints available for live chat
 * purposes must define to be valid.
 */

// - Imports ------------------------------------------------------------------
import { EmbedBuilder } from "discord.js";
import z from "zod";

// - Classes ------------------------------------------------------------------
export default interface LiveChatEndpointStrategy<T> {
  name: string;
  schema: z.ZodType<T>;
  buildEmbed(data: T): EmbedBuilder;
}
