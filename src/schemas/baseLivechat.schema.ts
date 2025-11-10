/**
 * The foundation of a REST schema utilized across ALL Live chat logging
 * endpoints. This avoid the duplication of fields everywhere and potential
 * naming / schema issues.
 */

// - Imports ------------------------------------------------------------------
import { z } from "zod";

// - Schema -------------------------------------------------------------------
export const baseLiveChatSchema = z.object({
  privateOnly: z
    .boolean()
    .describe("Ensures the logging is only for the private live chat channel."),
});
