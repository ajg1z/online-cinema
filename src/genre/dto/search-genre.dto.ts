import { IsOptional, IsString } from 'class-validator';

export class SearchGenreDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;
}
