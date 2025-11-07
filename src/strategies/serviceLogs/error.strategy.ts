/**
 * Endpoint strategy for the error logging of services.
 */

// - Imports ------------------------------------------------------------------
import z from "zod";
import ServiceLogEndpointStrategy from "./strategyInterface";
import { baseServiceLogSchema } from "../../schemas/baseServiceLog.schema";
import { Embed, EmbedBuilder } from "discord.js";

// - Classes ------------------------------------------------------------------
export default class ErrorEndpoint
  implements ServiceLogEndpointStrategy<z.infer<typeof baseServiceLogSchema>>
{
  /**
   * Name of the actual endpoint that will be created
   */
  name = "error";

  /**
   * Could've also been externalized to /src/schemas as errorSchema.
   * Putting it there localizes the building process of endpoints for service
   * loggings.
   *
   * Extends an already existing schema that ALL endpoints have to respect
   * at minimum.
   */
  schema = baseServiceLogSchema.extend({
    title: z.string(),
    description: z.string(),
  });

  /**
   * The builder responsible for generating the embed to send to discord to
   * generate the service log in the appropriate channel.
   * @param data
   * @returns
   */
  buildEmbed(data: z.infer<typeof this.schema>): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setTitle(data.title)
      .setDescription(data.description)
      .setAuthor({
        name: "Error",
        iconURL: "https://cdn-icons-png.flaticon.com/512/12483/12483530.png",
      })
      .setColor(0xee3839);

    return embed;
  }
}
