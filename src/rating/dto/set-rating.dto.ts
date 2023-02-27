import { IsMongoId, IsNumber } from 'class-validator';
import { ObjectId } from 'mongodb';

export class SetRatingDto {
  @IsMongoId()
  movieId: ObjectId;

  @IsNumber()
  value: number;
}
