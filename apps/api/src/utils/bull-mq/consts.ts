import { BaseJobOptions } from "bullmq";

export const QUEUES = {
    delete_file: {
        name: 'delete_file',
        config: {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
        },
    },
} satisfies Record<string, { name: string; dlq?: string; config: BaseJobOptions }>;

export const BULL_MQ_PREFIX = '{bull}'