import { Module } from '@nestjs/common';
import { ApiV1Module } from '@/api/v1/api-v1.module';
import { PrismaModule } from '@/utils/prisma/prisma.module';

@Module({
  imports: [PrismaModule, ApiV1Module],
  controllers: [],
  providers: [],
})
export class AppModule {}
