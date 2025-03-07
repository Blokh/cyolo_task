import { ConnectionOptions, Job, Queue, QueueListener, Worker } from 'bullmq';
import {Injectable, Logger, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import { WorkerListener } from 'bullmq';
import { BULL_MQ_PREFIX, QUEUES } from "@/utils/bull-mq/consts";
import {env} from "@/env";

@Injectable()
export abstract class BaseQueueWorkerService<T = any> implements OnModuleDestroy, OnModuleInit {
  protected queue?: Queue;
  protected worker?: Worker;
  protected connectionOptions: ConnectionOptions;

  protected constructor(
    protected queueName: string,
    protected logger: Logger
  ) {
    this.connectionOptions = env.REDIS_CONFIGURATION;

    const currentQueue = Object.entries(QUEUES).find(([_, queueOptions]) => queueOptions.name === queueName);

    if (!currentQueue) {
      throw new Error(`Queue configuration of ${queueName} not found in QUEUES`);
    }

    const queueConfig = currentQueue[1];
    this.queue = new Queue(queueName, {
      connection: this.connectionOptions,
      prefix: BULL_MQ_PREFIX,
      defaultJobOptions: {
        ...queueConfig.config,
        removeOnComplete: false,
        removeOnFail: false,
      },
    });

    this.initializeWorker();
  }

  abstract handleJob(job: Job<T>): Promise<void>;

  async addJob(jobData: T, jobOptions = {}): Promise<void> {
    await this.queue?.add(this.queueName, jobData, jobOptions);
  }

  protected initializeWorker() {
    this.worker = new Worker(
      this.queueName,
      async (job: Job<T>) => {
        await this.handleJob(job);
      },
      { prefix: BULL_MQ_PREFIX, connection: this.connectionOptions },
    );

    this.addWorkerListeners();
    this.addQueueListeners();
  }

  protected addWorkerListeners() {
    this.setWorkerListener({
      worker: this.worker,
      eventName: 'active',
      listener: (job: Job) => {
        this.logger.log(`joob ${job.id} is active`);
      },
    });

    this.setWorkerListener({
      worker: this.worker,
      eventName: 'failed',
      listener: async (job, error, prev) => {
        const queueConfig =
          Object.entries(QUEUES).find(([_, queueOptions]) => queueOptions.name === this.queueName)?.[1]?.config ||
          QUEUES.delete_file.config;

        const maxAllowedRetries = queueConfig.attempts;
        const currentAttempts = job?.attemptsMade ?? 0;

        if (currentAttempts >= maxAllowedRetries) {
          this.logger.error(`Unable execute Job - ${job?.id}`)
        }
      },
    });
  }

  protected addQueueListeners() {
    this.setQueueListener({
      queue: this.queue,
      eventName: 'cleaned',
      listener: (jobs, type) => {
        this.logger.log(`${jobs.length} ${type} jobs have been cleaned from the webhook queue`);
      },
    });
  }

  protected setWorkerListener<T extends keyof WorkerListener>({
    worker,
    eventName,
    listener,
  }: {
    worker: Worker | undefined;
    eventName: T;
    listener: WorkerListener[T];
  }) {
    worker?.removeAllListeners(eventName);
    worker?.on(eventName, listener);
  }

  protected setQueueListener<T extends keyof QueueListener>({
    queue,
    eventName,
    listener,
  }: {
    queue: Queue | undefined;
    eventName: T;
    listener: QueueListener[T];
  }) {
    return async () => {
      queue?.removeAllListeners(eventName);
      queue?.on(eventName, listener);
    };
  }

  async onModuleDestroy() {
    await this.queue?.pause();
    await Promise.all([this.worker?.close(), this.queue?.close()]);
  }

  async onModuleInit() {
    if (this.queue) {
      const isPaused = await this.queue.isPaused();

      if (isPaused) {
        await this.queue.resume();
      }

      const isPausedAfterResume = await this.queue?.isPaused();

      if (isPausedAfterResume) {
        this.logger.log('Paused after resume');
      }
    }
  }
}
