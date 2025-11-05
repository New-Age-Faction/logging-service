/**
 * Schema containing detailed information services must provide when logging
 * a warning in the discord.
 */

// - Imports ------------------------------------------------------------------
import { baseServiceLogSchema } from "./baseServiceLog.schema";
import { z } from "zod";

// - Schema -------------------------------------------------------------------
export const warningServiceLogSchema = baseServiceLogSchema.extend({
  title: z.string(),
  description: z.string(),
});
