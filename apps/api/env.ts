import { config } from 'dotenv';
import { z } from 'zod';
import { createEnv } from '@t3-oss/env-core/dist';

config({ path: '.env' });
export const env = createEnv({
  clientPrefix: 'PUBLIC_',
  server: {
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    NODE_ENV: z.enum(['development', 'sandbox', 'production', 'test', 'local']),

    PORT: z.coerce.number().default(3000),

    DATABASE_URL: z.string().url(),

    REDIS_HOST: z.string().default('127.0.0.1'),
    REDIS_PORT: z.coerce.number().int().nonnegative().default(6379),
    REDIS_DB: z.coerce.number().int().nonnegative().default(0),

    DISK_FILE_NAME: z.string().optional().default('cyolo_uploads'),
  },
  client: {},
  runtimeEnv: process.env,
});

export const configs = () => {
  return env;
};
