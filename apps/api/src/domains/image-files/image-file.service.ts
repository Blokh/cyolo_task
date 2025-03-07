import { Injectable } from "@nestjs/common";
import { generateId } from "@/utils/helpers/generate-id/generate-id";
import * as fs from "node:fs";
import * as mime from "mime-types";
import * as path from "node:path";
import { env } from "@/env";
import * as os from "node:os";
import { ImageFileRepository } from "@/domains/image-files/image-file.repository";
import { DeleteFileServiceWorker } from "@/utils/bull-mq/workers/delete-file-service-worker.service";
import {PrismaService} from "@/utils/prisma/prisma.service";

const DEFAULT_RETENTION_TIME_IN_SECONDS = 60

@Injectable()
export class ImageFileService {
  private folderPath: string;
  private client: typeof fs;

  constructor(
    private readonly imageFileRepository: ImageFileRepository,
    private readonly prismaService: PrismaService,
    private readonly deleteFileServiceWorker: DeleteFileServiceWorker,
  ) {
    const folderName = env.DISK_FILE_NAME;
    this.folderPath = path.join(os.homedir(), folderName);
    this.client = fs;
  }

  public async createImageFile(
    userId: string,
    file: Express.Multer.File,
    retentionTimeInSeconds?: number,
  ) {
    const fileId = generateId();
    await this.ensureDirectoryExists(userId);

    const filePath = this.composeFilePath({
      userId,
      fileId,
      mimeType: file.mimetype,
    });

    const [savedFilePath, imageFile] = await this.prismaService.$transaction( async (transaction) => {
      return await Promise.all([
        this.uploadFileUsingStream(file, filePath),
        this.imageFileRepository.create({
          id: fileId,
          filePath: filePath,
          userId,
          originalFileName: file.originalname,
        }, transaction)
      ])
    })

    await this.deleteFileServiceWorker.addJob({fileId: imageFile.id}, {
      delay: (retentionTimeInSeconds ?? DEFAULT_RETENTION_TIME_IN_SECONDS) * 1000,
    })

    return imageFile;
  }

  public async getFileContentStream(filePath: string) {
    const file = await this.imageFileRepository.findFileByPath(filePath); // this throws not found in case it's archived
    const fileStream = this.client.createReadStream(filePath);

    return { fileStream: fileStream, originalFileName: file.originalFileName };
  }

  public async deleteImageFile(fileId: string) {
    const file = await this.imageFileRepository.findFile(fileId);

    await this.deleteFile(file.filePath);
    return await this.imageFileRepository.setAsArchived(file.id);
  }

  public async deleteFileByPath(filePath: string) {
    const file = await this.imageFileRepository.findFileByPath(filePath);

    await this.deleteFile(file.filePath);
    return await this.imageFileRepository.setAsArchived(file.id);
  }

  private async ensureDirectoryExists(userId: string) {
    try {
      return fs.mkdirSync(path.join(this.folderPath, userId), {
        recursive: true,
      });
    } catch (error) {
      if (error.code !== "EEXIST") {
        throw error;
      }
    }
  }

  private composeFilePath({
    userId,
    fileId,
    mimeType,
  }: {
    userId: string;
    fileId: string;
    mimeType: string;
  }) {
    const extension = mime.extension(mimeType) || "";
    const fileName = `${fileId}${extension ? `.${extension}` : ""}`;
    const filePath = path.join(this.folderPath, userId, fileName);

    return filePath;
  }

  private async uploadFileUsingStream(
    file: Express.Multer.File,
    filePath: string,
  ) {
    const writeStream = this.client.createWriteStream(filePath);

    return new Promise<string>((resolve, reject) => {
      writeStream.write(file.buffer);
      writeStream.on("finish", () => resolve(filePath));
      writeStream.on("error", (error) => reject(error));
      writeStream.end();
    });
  }

  private deleteFile(filePath: string) {
    return new Promise((resolve, reject) => {
      fs.rm(filePath, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve({});
        }
      });
    });
  }
}
