import { Module } from '@nestjs/common';
import { ImageFileRepository } from '@/domains/image-files/image-file.repository';
import { ImageFileService } from '@/domains/image-files/image-file.service';
import { PrismaModule } from '@/utils/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ImageFileService, ImageFileRepository],
  exports: [ImageFileService],
})
export class ImageFileModule {}
