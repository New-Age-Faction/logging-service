/**
 * Defines the base interface that all endpoints available for the logging of
 * services in discord must implement to be valid.
 * Its the foundation of the strategy.
 */

// - Imports ------------------------------------------------------------------
import { EmbedBuilder } from "discord.js";
import z from "zod";

// - Classes ------------------------------------------------------------------
export default interface ServiceLogEndpointStrategy<T> {
  name: string;
  schema: z.ZodType<T>;
  buildEmbed(data: T): EmbedBuilder;
}
