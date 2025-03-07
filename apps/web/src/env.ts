import { z } from "zod";

const EnvSchema = z
    .object({
        VITE_LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
        VITE_NODE_ENV: z.enum(["development", "sandbox", "production", "test", "local"]),
        VITE_PORT: z.coerce.number().default(8080),
        VITE_BASE_URL: z.string().url().optional().default("http://localhost:3000"),
    });

export const env = EnvSchema.parse(import.meta.env);
