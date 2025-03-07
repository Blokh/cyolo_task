import { Module } from '@nestjs/common';
import { ApiV1Module } from '@/api/v1/api-v1.module';
import { PrismaModule } from '@/utils/prisma/prisma.module';
import {BullWorkerModule} from "@/utils/bull-mq/bull-worker.module";

@Module({
  imports: [PrismaModule, ApiV1Module, BullWorkerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
