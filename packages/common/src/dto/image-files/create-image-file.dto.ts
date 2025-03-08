import { IsInt, IsOptional, Min } from 'class-validator';
import {Transform, Type} from 'class-transformer';

export class CreateImageFileDto {
  @IsOptional()
  @Transform(({ value }) => {
    return typeof value === 'string' ? parseInt(value, 10) : value;
  })
  @IsInt({message: 'The retention time should be a number'})
  @Min(60, { message: 'Retention time must be at least 60 seconds' })
  @Type(() => Number)
  retentionTimeInSeconds?: number;

  file: Express.Multer.File;
}
