import { Module } from '@nestjs/common';
import { PrismaService } from '@/utils/prisma/prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
