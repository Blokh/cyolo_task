import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/utils/prisma/prisma.service';
import type { Prisma } from '@prisma/client';

@Injectable()
export class ImageFileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createImageArgs: Prisma.ImageFileCreateArgs['data']) {
    return await this.prisma.imageFile.create({
      data: createImageArgs,
    });
  }

  async findMany(userId: NonNullable<Prisma.ImageFileFindManyArgs['where']>['userId']) {
    return this.prisma.imageFile.findMany({
      where: { userId, isArchived: false },
    });
  }

  async findFile(fileId: string) {
    const file = await this.prisma.imageFile.findFirst({
      where: { id: fileId, isArchived: false },
    });

    if (!file) {
      throw new NotFoundException('Image file not found');
    }

    return file;
  }

  async findFileByPath(filePath: string) {
    const file = await this.prisma.imageFile.findFirst({
      where: { filePath: filePath, isArchived: false },
    });

    if (!file) {
      throw new NotFoundException('Image file not found');
    }

    return file;
  }

  async setAsArchived(fileId: string) {
    this.prisma.imageFile.update({
      where: { id: fileId },
      data: { isArchived: true },
    });
  }
}
