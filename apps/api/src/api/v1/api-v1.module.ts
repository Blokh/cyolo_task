import { Module } from '@nestjs/common';
import { PrismaModule } from '@/utils/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [],
})
export class ApiV1Module {}
