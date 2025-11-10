/**
 * Defines the base interface that all endpoints available for live chat
 * purposes must define to be valid.
 */

// - Imports ------------------------------------------------------------------
import { EmbedBuilder } from "discord.js";
import z from "zod";

// - Classes ------------------------------------------------------------------
export default interface LiveChatEndpointStrategy<T> {
  /**
   * The endpoint name. Added at the end of the slashes.
   * Don't add a slash at the start or the end.
   */
  name: string;
  /**
   * Defines if that live chat endpoint should only be shown in the private
   * channel and never the public one.
   * If true, it'll be available in the public channel.
   */
  public: boolean;
  /**
   * REST schema to utilize to build the endpoint from. That's what defines
   * what's available in the data in the building functions.
   */
  schema: z.ZodType<T>;
  buildPublic(data: T): EmbedBuilder;
  buildPrivate(data: T): string;
}
