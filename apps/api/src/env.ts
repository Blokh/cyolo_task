import { config } from "dotenv";
import { z } from "zod";

config({ path: ".env" });
const EnvSchema = z
  .object({
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
    NODE_ENV: z.enum(["development", "sandbox", "production", "test", "local"]).default("local"),

    PORT: z.coerce.number().default(3000),

    DATABASE_URL: z.string().url(),

    REDIS_HOST: z.string().default("127.0.0.1"),
    REDIS_PORT: z.coerce.number().int().nonnegative().default(6379),
    REDIS_DB: z.coerce.number().int().nonnegative().default(0),
    REDIS_TLS: z
      .string()
      .optional()
      .default("false")
      .transform((val) => val === "true"),

    DISK_FILE_NAME: z.string().optional().default("cyolo_uploads"),
  })
  .transform((envs) => {
    return {
      ...envs,
      REDIS_CONFIGURATION: {
        host: envs.REDIS_HOST,
        port: envs.REDIS_PORT,
        db: envs.REDIS_DB,
        ...(envs.REDIS_TLS
          ? {
              tls: {
                rejectUnauthorized: false,
                checkServerIdentity: () => undefined,
              },
            }
          : {}),
      },
    } as const;
  });

export const env = EnvSchema.parse(process.env);
