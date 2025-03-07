import {forwardRef, Module} from "@nestjs/common";
import { BullMqModule } from "./bull-mq.module";
import { DeleteFileServiceWorker } from "@/utils/bull-mq/workers/delete-file-service-worker.service";
import { ImageFileModule } from "@/domains/image-files/image-file.module";

@Module({
  imports: [BullMqModule, forwardRef(() => ImageFileModule)],
  providers: [DeleteFileServiceWorker],
  exports: [DeleteFileServiceWorker],
})
export class BullWorkerModule {}
