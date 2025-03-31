// src/movies/dto/create-movie.dto.ts
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateMovieDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  publishingYear: number;

  @IsOptional()
  @IsNumber()
  movieId: number;
}
