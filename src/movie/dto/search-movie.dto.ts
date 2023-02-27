import { IsString } from 'class-validator';

export class SearchMovieDto {
  @IsString()
  slug?: string;
}
