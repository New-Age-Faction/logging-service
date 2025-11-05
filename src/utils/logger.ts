/**
 * Contains the logger object used throughout the entire service to log
 * exactly what's happening on a local level.
 *
 * This logger is NOT what the logging service utilizes to log things. The
 * logging service is an endpoint for services to log things in DISCORD.
 *
 * This logger is powerful enough to later be used with open telemetry and
 * a clickhouse database to fully grasp the depth of errors that will happen
 * within the stack.
 */

// - Imports ------------------------------------------------------------------
import winston from "winston";
import colors from "colors";

// - Constants ----------------------------------------------------------------
export const logger = winston.createLogger({
  level: "debug",
  levels: winston.config.syslog.levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ level, message, timestamp }) => {
      const greyTimestamp = colors.gray.dim(`[${timestamp}]`);
      const upperLevel = level.toUpperCase().padEnd(7, " ");

      // Severity level colors
      const colorMap: Record<string, (s: string) => string> = {
        ERROR: colors.red,
        WARN: colors.yellow,
        INFO: colors.cyan,
        DEBUG: colors.blue,
        NOTICE: colors.magenta,
      };

      // text and color formatting
      const colorize = colorMap[upperLevel.trim()] || colors.white;
      const coloredLevel = colorize(upperLevel);
      const formattedLevel = colors.bold(coloredLevel);
      const coloredMessage = colorize(message as string);
      const dimmedMessage = colors.dim(coloredMessage);
      const formattedMessage = dimmedMessage.padEnd(7, " ");

      return `${greyTimestamp} ${formattedLevel} ${formattedMessage}`;
    }),
  ),
  transports: [new winston.transports.Console()],
});
