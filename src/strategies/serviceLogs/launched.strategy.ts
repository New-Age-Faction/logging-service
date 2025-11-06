/**
 * Endpoint strategy for the endpoint services call when they finish launching
 */

// - Imports ------------------------------------------------------------------
import z from "zod";
import ServiceLogEndpointStrategy from "./strategyInterface";
import { baseServiceLogSchema } from "../../schemas/baseServiceLog.schema";
import { EmbedBuilder } from "discord.js";

// - Classes ------------------------------------------------------------------
export default class LaunchedEndpoint
  implements ServiceLogEndpointStrategy<z.infer<typeof baseServiceLogSchema>>
{
  /**
   * Name of the actual endpoint that will be created
   */
  public name = "launched";

  /**
   * Only the basics is required for a service to identify it launched.
   */
  public schema = baseServiceLogSchema.extend({});

  /**
   * The builder responsible for generating the embed to send to discord to
   * generate the service log in the appropriate channel.
   * @param data
   * @returns
   */
  public buildEmbed(data: z.infer<typeof this.schema>): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: "Service Launched",
        iconURL: "https://cdn-icons-png.flaticon.com/512/10148/10148430.png",
      })
      .setColor(0x2596be);
    return embed;
  }
}
