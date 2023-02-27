import { ObjectId } from 'mongodb';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsMongoId,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class MovieParametersDto {
  @IsDefined()
  year: number;

  @IsDefined()
  duration: number;

  @IsString()
  country: string;
}

export class CreateMovieDto {
  @IsMongoId()
  poster: ObjectId;

  @IsMongoId()
  bigPoster: ObjectId;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  slug: string;

  @IsMongoId()
  video: ObjectId;

  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => MovieParametersDto)
  parameters: MovieParametersDto;

  @IsString({ each: true })
  @IsMongoId({ each: true })
  @IsArray()
  genres: ObjectId[];

  @IsString({ each: true })
  @IsMongoId({ each: true })
  @IsArray()
  actors: ObjectId[];

  @IsBoolean()
  @IsOptional()
  isSendTelegram?: boolean;
}
