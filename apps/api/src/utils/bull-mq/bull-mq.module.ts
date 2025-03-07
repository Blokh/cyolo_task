import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import {env} from "@/env";
import {BULL_MQ_PREFIX} from "@/utils/bull-mq/consts";


const QUEUES = {
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
} as const

const composeQueues = (queue: (typeof QUEUES)[keyof typeof QUEUES]) => {
    const baseQueues = BullBoardModule.forFeature({
        name: queue.name,
        options: {
            prefix: BULL_MQ_PREFIX,
        },
        adapter: BullMQAdapter,
    });


    return [baseQueues];
};

const composeInitiateQueueWithDlq = (queue: (typeof QUEUES)[keyof typeof QUEUES]) =>
    [
        {
            name: queue.name,
            prefix: BULL_MQ_PREFIX,
            ...queue.config,
        },
    ].filter(Boolean);

export const bullServerAdapter = new ExpressAdapter();
bullServerAdapter.setBasePath('/queues');

@Module({
    imports: [
        BullModule.forRootAsync({
            useFactory: () => {
                return {
                    connection: env.REDIS_CONFIGURATION,
                    defaultJobOptions: {
                        removeOnComplete: false,
                        removeOnFail: false,
                    },
                };
            },
        }),
        BullModule.registerQueue(
            ...Object.values(QUEUES).flatMap(queue => {
                return composeInitiateQueueWithDlq(queue);
            }),
        ),
        BullBoardModule.forRoot({
            route: '/queues',
            adapter: ExpressAdapter,
        }),
        ...Object.values(QUEUES)
            .map(queue => composeQueues(queue))
            .flat(),
    ],
    providers: [],
    exports: [BullModule],
})
export class BullMqModule {}
