/**
 * The foundation of a REST schema utilized across ALL service logging
 * endpoints. This avoid the duplication of fields everywhere and potential
 * naming / schema issues.
 */

// - Imports ------------------------------------------------------------------
import { z } from "zod";

// - Schema -------------------------------------------------------------------
export const baseServiceLogSchema = z.object({
  serviceID: z.string().describe("ID of the service to log"),
  environment: z
    .enum(["dev", "prod"])
    .describe("Environment in which the service is currently residing"),
  context: z
    .record(z.string(), z.any())
    .optional()
    .describe("Optional context"),
  thumbnail: z
    .string()
    .optional()
    .describe("Environment in which the service is currently residing"),
});
