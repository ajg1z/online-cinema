import { IsArray, IsMongoId, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

export class CreateActorDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsArray()
  @IsMongoId({ each: true })
  photo: ObjectId[];
}
