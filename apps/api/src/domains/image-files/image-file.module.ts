import { Module } from '@nestjs/common';
import { PrismaService } from '@/utils/prisma/prisma.service';
import { ImageFileRepository } from '@/domains/image-files/image-file.repository';

@Module({
  imports: [PrismaService],
  providers: [PrismaService, ImageFileRepository],
  exports: [PrismaService],
})
export class ImageFileModule {}
