import {
  Body,
  Controller, Get, Header,
  Param,
  Put, Res, StreamableFile,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { ImageFileService } from "@/domains/image-files/image-file.service";
import { Response } from 'express';
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

  @Get('/:pathUrl')
  async getFileContent(
  @Param('pathUrl') pathUrl: string,
  @Res({ passthrough: true }) res: Response,
  ) {
    const { fileStream, originalFileName } =
      await this.imageFileService.getFileContentStream(pathUrl);
    
    res.set('Content-Type', 'image/png');
    res.set('Content-Disposition', `attachment; filename="${originalFileName}"`);
    
    return new StreamableFile(fileStream);
  }
}
