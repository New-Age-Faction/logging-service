/**
 * The foundation of a REST schema utilized across ALL service logging
 * endpoints. This avoid the duplication of fields everywhere and potential
 * naming / schema issues.
 */

// - Imports ------------------------------------------------------------------
import { z } from "zod";

// - Schema -------------------------------------------------------------------
export const baseServiceLogSchema = z.object({
  serviceName: z
    .string()
    .describe("Name of the service responsible for the log occurrences"),
  serviceIcon: z
    .url()
    .describe(
      "URL to give along side the service name in the footer of embeds",
    ),
  thumbnail: z
    .string()
    .optional()
    .describe("Environment in which the service is currently residing"),
});
