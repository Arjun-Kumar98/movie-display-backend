import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  publishingYear: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
