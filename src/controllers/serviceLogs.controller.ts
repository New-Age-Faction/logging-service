import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { sendDiscordEmbed } from "../services/discordWebhooks.service";

const schema = z.object({
  service: z.string(),
  level: z.enum(["info", "warn", "error"]),
  message: z.string(),
  context: z.record(z.string(), z.any()).optional(),
});

export async function logEvent(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = schema.parse(req.body);

    await sendDiscordEmbed({
      title: `[${data.service}] ${data.level.toUpperCase()}`,
      description: data.message,
      color:
        data.level === "error"
          ? 0xff0000
          : data.level === "warn"
            ? 0xffa500
            : 0x00ff00,
      fields: Object.entries(data.context ?? {}).map(([key, value]) => ({
        name: key,
        value: String(value),
        inline: true,
      })),
    });

    res.status(200).json({ status: "ok" });
  } catch (err) {
    next(err);
  }
}
