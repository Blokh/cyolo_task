import { IMAGE_MEME_TYPES } from "@cyolo/common";
import {
  BadRequestException,
  type NestInterceptor,
  type Type,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

export const CustomFileValidatorInterceptor = (
  fieldName = "file",
  allowedMimeTypes = IMAGE_MEME_TYPES,
): Type<NestInterceptor> => {
  const multerOptions = {
    limits: {
      // fileSize: maxSize, removed as it wasn't required in task
    },
    fileFilter: (_req, file, callback) => {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return callback(
          new BadRequestException(
            `File type not allowed. Allowed types: ${allowedMimeTypes.join(", ")}`,
          ),
          false,
        );
      }
      callback(null, true);
    },
  } satisfies MulterOptions;

  return FileInterceptor(fieldName, multerOptions);
};