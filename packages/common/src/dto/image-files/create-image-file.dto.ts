import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateImageFileDto {
  @IsOptional()
  @IsInt()
  @Min(60, { message: 'Retention time must be at least 60 seconds' })
  @Type(() => Number)
  retentionTimeInSeconds?: number;

  file: Express.Multer.File;
}
