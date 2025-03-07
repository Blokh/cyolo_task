import {forwardRef, Module} from "@nestjs/common";
import { ImageFileRepository } from "@/domains/image-files/image-file.repository";
import { ImageFileService } from "@/domains/image-files/image-file.service";
import { PrismaModule } from "@/utils/prisma/prisma.module";
import { BullWorkerModule } from "@/utils/bull-mq/bull-worker.module";

@Module({
  imports: [PrismaModule, BullWorkerModule],
  providers: [ImageFileService, ImageFileRepository],
  exports: [ImageFileService],
})
export class ImageFileModule {}
