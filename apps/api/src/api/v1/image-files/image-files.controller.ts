import {
  Body,
  Controller,
  Put,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { ImageFileService } from "@/domains/image-files/image-file.service";
import { CustomFileValidatorInterceptor } from "@/utils/interceptors/image-validation.interceptor";
import type { CreateImageFileDto } from "@cyolo/common";
import { ApiTags } from "@nestjs/swagger";
import { UploadFileDecorator } from "@/api/v1/image-files/decorators/upload-file-decorator";

@ApiTags("Image File")
@Controller("file")
export class ImageFilesController_V1 {
  constructor(private imageFileService: ImageFileService) {}

  @Put()
  @UploadFileDecorator()
  @UseInterceptors(CustomFileValidatorInterceptor())
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createImageFileDto: CreateImageFileDto,
  ) {
    return await this.imageFileService.createImageFile(
      "12345",
      file,
      createImageFileDto.retentionTimeInSeconds,
    );
  }
}
