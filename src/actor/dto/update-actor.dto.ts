import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  isMongoId,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongodb';
import { FileModel } from 'src/file/file.model';

export class UpdateActorDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  slug: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  photo: ObjectId[];
}
