import { IsArray, IsMongoId, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

export class FindMovieByGenres {
  @IsArray()
  @IsMongoId({ each: true })
  genres: ObjectId[];
}

export class FindMovieBySlug {
  @IsString()
  slug: string;
}
