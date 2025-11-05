/**
 * Schema containing detailed information required when a service launches and
 * wants to broadcast it to discord.
 */

// - Imports ------------------------------------------------------------------
import { baseServiceLogSchema } from "./baseServiceLog.schema";
import { z } from "zod";

// - Schema -------------------------------------------------------------------
export const launchedServiceLogSchema = baseServiceLogSchema.extend({});
