import { Module } from "@nestjs/common";
import { ImageFilesController_V1 } from "@/api/v1/image-files/image-files.controller";
import { ImageFileModule } from "@/domains/image-files/image-file.module";

@Module({
  imports: [ImageFileModule],
  controllers: [ImageFilesController_V1],
})
export class ApiV1Module {}
