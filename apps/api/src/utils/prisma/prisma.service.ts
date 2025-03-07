import { Injectable, type OnModuleInit, type OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import type { PrismaClientOptions } from '@prisma/client/runtime/library';
import { env } from '@/env';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const logLevel = (
      env.NODE_ENV === 'local' ? ['query', 'info', 'warn', 'error'] : ['info', 'warn', 'error']
    ) satisfies PrismaClientOptions['log'];

    super({
      log: logLevel,
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
