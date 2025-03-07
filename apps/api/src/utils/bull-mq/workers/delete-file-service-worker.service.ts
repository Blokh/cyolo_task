import {forwardRef, Inject, Injectable, Logger} from "@nestjs/common";
import { BaseQueueWorkerService } from "@/utils/bull-mq/base/base-queue-worker.service";
import { ImageFileService } from "@/domains/image-files/image-file.service";
import { QUEUES } from "@/utils/bull-mq/consts";
import { Job } from "bullmq";

type TDeleteFile = { fileId: string };

@Injectable()
export class DeleteFileServiceWorker extends BaseQueueWorkerService<TDeleteFile> {
  constructor(
      @Inject(forwardRef(() => ImageFileService))
      private readonly imageFileService: ImageFileService,
  ) {
    super(QUEUES.delete_file.name, new Logger("DeleteFileServiceWorker"));
  }

  async handleJob(job: Job<TDeleteFile>) {
    await this.imageFileService.deleteImageFile(job.data.fileId);
  }
}
