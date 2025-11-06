/**
 * Endpoint strategy for services that shutdown. Like the opposite of Launched
 */

// - Imports ------------------------------------------------------------------
import z from "zod";
import ServiceLogEndpointStrategy from "./strategyInterface";
import { baseServiceLogSchema } from "../../schemas/baseServiceLog.schema";
import { EmbedBuilder } from "discord.js";

// - Classes ------------------------------------------------------------------
export default class ShutdownEndpoint
  implements ServiceLogEndpointStrategy<z.infer<typeof baseServiceLogSchema>>
{
  /**
   * Name of the actual endpoint that will be created
   */
  public name = "shutdown";

  /**
   * Contains all the data you'd require to build a traceback when a critical
   * error occurs in your programs. If you can't parse the stack, just send
   * only that.
   */
  public schema = baseServiceLogSchema.extend({
    reason: z
      .string()
      .optional()
      .describe("Optional reason that led to the service's shutdown"),
  });

  /**
   * The builder responsible for generating the embed to send to discord to
   * generate the service log in the appropriate channel.
   * @param data
   * @returns
   */
  public buildEmbed(data: z.infer<typeof this.schema>): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: "Service stopped",
        iconURL: "https://cdn-icons-png.flaticon.com/512/7826/7826834.png",
      })
      .setColor(0xda1515);

    // Build the stack trace code block only if there's one.
    if (data.reason) {
      embed.setDescription(`-# **${data.reason}**`);
    }
    return embed;
  }
}
