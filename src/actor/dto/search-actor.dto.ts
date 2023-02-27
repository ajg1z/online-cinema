import { IsOptional, IsString } from 'class-validator';

export class SearchActorDto {
  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
