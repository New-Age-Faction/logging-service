/**
 * Endpoint strategy for services that need to display a full process
 * terminating traceback... Better than having to go check in the console on
 * the KVM every time this happens.
 */

// - Imports ------------------------------------------------------------------
import z from "zod";
import ServiceLogEndpointStrategy from "./strategyInterface";
import { baseServiceLogSchema } from "../../schemas/baseServiceLog.schema";
import { EmbedBuilder } from "discord.js";
import { logger } from "../../utils/logger";

// - Classes ------------------------------------------------------------------
export default class TracebackEndpoint
  implements ServiceLogEndpointStrategy<z.infer<typeof baseServiceLogSchema>>
{
  /**
   * Name of the actual endpoint that will be created
   */
  public name = "traceback";

  /**
   * Contains all the data you'd require to build a traceback when a critical
   * error occurs in your programs. If you can't parse the stack, just send
   * only that.
   */
  public schema = baseServiceLogSchema.extend({
    message: z.string().describe("The error object's message."),
    description: z.string().optional(),
    stackTrace: z.string().optional(),
    method: z.string().optional().describe("The method that threw the error"),
    file: z
      .string()
      .optional()
      .describe("The file from which the error came from"),
    column: z
      .number()
      .optional()
      .describe("Column number where the error occurred"),
    line: z
      .number()
      .optional()
      .describe("Line number where the error occurred"),
  });

  /**
   * The builder responsible for generating the embed to send to discord to
   * generate the service log in the appropriate channel.
   * @param data
   * @returns
   */
  public buildEmbed(data: z.infer<typeof this.schema>): EmbedBuilder {
    logger.debug("Building traceback embed.");
    logger.debug(`Description: ${data.description}`);
    logger.debug(`Message: ${data.message}`);
    logger.debug(`Method: ${data.method}`);
    logger.debug(`column: ${data.column}`);
    logger.debug(`File: ${data.file}`);
    logger.debug(`Line: ${data.line}`);
    logger.debug(`Stacktrace: ${data.stackTrace}`);
    const embed = new EmbedBuilder()
      .setAuthor({
        name: "Traceback",
        iconURL: "https://cdn-icons-png.flaticon.com/512/14090/14090276.png",
      })
      .setColor(0xff0000)
      .setTitle(data.message);

    // Build the stack trace code block only if there's one.
    if (data.stackTrace) {
      embed.setDescription(`\`\`\`\n${data.stackTrace}\n\`\`\``);
    }
    if (data.file) {
      embed.addFields({
        name: "File",
        value: `-# ${data.file}`,
        inline: true,
      });
    }
    if (data.method) {
      embed.addFields({
        name: "Function",
        value: `-# ${data.method}`,
        inline: true,
      });
    }
    if (data.column) {
      embed.addFields({
        name: "Cl",
        value: `-# ${data.column}`,
        inline: true,
      });
    }
    if (data.line) {
      embed.addFields({
        name: "Ln",
        value: `-# ${data.line}`,
        inline: true,
      });
    }
    if (data.description) {
      embed.addFields({
        name: "Describe",
        value: `${data.description}`,
        inline: false,
      });
    }
    return embed;
  }
}
